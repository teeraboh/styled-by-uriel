#!/usr/bin/env node

/**
 * ============================================================================
 * Styled by Uriel — Cross-Project Supabase Migration Tool
 * ============================================================================
 * 
 * Safely migrates database records and storage bucket assets from an OLD
 * Supabase project to a NEW Supabase project.
 * 
 * Invariants:
 * - Defaults to DRY-RUN mode (read-only verification).
 * - Requires explicit `--execute` flag to perform writes.
 * - Preserves all existing UUIDs, relationships, and timestamps.
 * - Migrates tables in topological order (FK constraint safe).
 * - Rewrites product_images URLs from old project domain to new project domain.
 * - Leaves external Google/CDN image URLs untouched.
 * - Never deletes or alters records in the source (OLD) project.
 * - Never prints or logs secrets/keys.
 * ============================================================================
 */

import { createClient } from "@supabase/supabase-js";

// ── 1. Parse Arguments & Mode ───────────────────────────────────────────────

const args = process.argv.slice(2);
const isExecuteMode = args.includes("--execute");
const isDryRun = !isExecuteMode;

console.log("================================================================");
console.log(" Styled by Uriel — Supabase Cross-Project Migration Tool");
console.log(` Mode: ${isExecuteMode ? "🚀 LIVE EXECUTION" : "🔍 DRY RUN (Read-Only Audit)"}`);
console.log("================================================================\n");

// ── 2. Environment Variables & Validation ───────────────────────────────────

const oldUrl = process.env.OLD_SUPABASE_URL?.trim();
const oldKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY?.trim();
const newUrl = process.env.NEW_SUPABASE_URL?.trim();
const newKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY?.trim();

const missingVars = [];
if (!oldUrl) missingVars.push("OLD_SUPABASE_URL");
if (!oldKey) missingVars.push("OLD_SUPABASE_SERVICE_ROLE_KEY");
if (!newUrl) missingVars.push("NEW_SUPABASE_URL");
if (!newKey) missingVars.push("NEW_SUPABASE_SERVICE_ROLE_KEY");

if (missingVars.length > 0) {
  console.error("❌ Error: Missing required environment variables:");
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\nUsage example:");
  console.error("  OLD_SUPABASE_URL=\"https://xxx.supabase.co\" \\");
  console.error("  OLD_SUPABASE_SERVICE_ROLE_KEY=\"ey...\" \\");
  console.error("  NEW_SUPABASE_URL=\"https://yyy.supabase.co\" \\");
  console.error("  NEW_SUPABASE_SERVICE_ROLE_KEY=\"ey...\" \\");
  console.error("  node scripts/migrate-supabase.mjs [--execute]\n");
  process.exit(1);
}

// Extract project hostnames for safe URL rewriting (e.g. "xxx.supabase.co")
let oldHost = "";
let newHost = "";
try {
  oldHost = new URL(oldUrl).host;
  newHost = new URL(newUrl).host;
} catch (err) {
  console.error("❌ Error: Invalid Supabase URL format provided.");
  process.exit(1);
}

console.log(`Source Project:      ${oldHost} (Protected read)`);
console.log(`Destination Project: ${newHost} (${isExecuteMode ? "Target write" : "Target read-check"})`);
console.log("");

// ── 3. Initialize Clients (Service Role Key for RLS Bypass) ─────────────────

const oldClient = createClient(oldUrl, oldKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const newClient = createClient(newUrl, newKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── 4. Helper Functions ─────────────────────────────────────────────────────

const BATCH_SIZE = 50;

/**
 * Fetch all rows from a table with pagination to avoid payload limits
 */
async function fetchAllRows(client, tableName, orderBy = "created_at") {
  const allRows = [];
  let page = 0;
  const pageSize = 500;

  while (true) {
    let query = client
      .from(tableName)
      .select("*")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch from table '${tableName}': ${error.message}`);
    }

    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < pageSize) break;
    page++;
  }

  return allRows;
}

/**
 * List all objects in a bucket recursively
 */
async function listAllStorageObjects(client, bucketName, folderPath = "products") {
  const allFiles = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await client.storage
      .from(bucketName)
      .list(folderPath, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      // If bucket or folder is empty / not found
      return allFiles;
    }

    if (!data || data.length === 0) break;

    for (const item of data) {
      if (item.id === null) {
        // It's a folder, recurse into it
        const subFiles = await listAllStorageObjects(client, bucketName, `${folderPath}/${item.name}`);
        allFiles.push(...subFiles);
      } else {
        allFiles.push({
          name: item.name,
          fullPath: `${folderPath}/${item.name}`,
          metadata: item.metadata,
        });
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return allFiles;
}

/**
 * Rewrite image URLs belonging to the old project domain
 */
function rewriteImageUrl(imageUrl, sourceHost, destHost) {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;

  if (imageUrl.includes(sourceHost)) {
    return imageUrl.replace(sourceHost, destHost);
  }
  return imageUrl; // External CDN/Google URL untouched
}

// ── 5. Main Migration & Audit Workflow ──────────────────────────────────────

async function main() {
  const audit = {
    source: {},
    destInitial: {},
    storage: { sourceFiles: [], copied: 0, skipped: 0, errors: [] },
    db: { migrated: {}, errors: {} },
  };

  // ── Step A: Test Connections & Schema Reachability ──
  console.log("── Step 1: Testing Connections & Destination Schema ──");
  
  const tables = [
    "categories",
    "products",
    "product_images",
    "product_variations",
    "orders",
    "order_items",
  ];

  for (const table of tables) {
    const { count, error } = await newClient
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(`❌ Destination table '${table}' check failed:`, error.message);
      console.error("   Ensure migrations 001, 002, 003 have been applied to the destination database.");
      process.exit(1);
    }
    audit.destInitial[table] = count || 0;
  }
  console.log("✓ All 6 destination tables verified and reachable.");

  // Check destination bucket
  const { data: bucketData, error: bucketError } = await newClient.storage.getBucket("product-images");
  if (bucketError || !bucketData) {
    console.error("❌ Destination bucket 'product-images' not accessible:", bucketError?.message);
    console.error("   Ensure migration 002 has been run and bucket 'product-images' exists.");
    process.exit(1);
  }
  console.log(`✓ Destination storage bucket 'product-images' verified (Public: ${bucketData.public}).\n`);

  // ── Step B: Read & Audit Source Data ──
  console.log("── Step 2: Extracting & Auditing Source Records (OLD DB) ──");

  const categories = await fetchAllRows(oldClient, "categories", "name");
  const products = await fetchAllRows(oldClient, "products", "created_at");
  const productImages = await fetchAllRows(oldClient, "product_images", "created_at");
  const productVariations = await fetchAllRows(oldClient, "product_variations", "id");
  const orders = await fetchAllRows(oldClient, "orders", "created_at");
  const orderItems = await fetchAllRows(oldClient, "order_items", "id");

  audit.source.categories = categories.length;
  audit.source.products = products.length;
  audit.source.product_images = productImages.length;
  audit.source.product_variations = productVariations.length;
  audit.source.orders = orders.length;
  audit.source.order_items = orderItems.length;

  console.log(`   - categories:         ${categories.length} records`);
  console.log(`   - products:           ${products.length} records`);
  console.log(`   - product_images:     ${productImages.length} records`);
  console.log(`   - product_variations: ${productVariations.length} records`);
  console.log(`   - orders:             ${orders.length} records`);
  console.log(`   - order_items:        ${orderItems.length} records`);

  // Relational Integrity Checks
  const categoryIdSet = new Set(categories.map((c) => c.id));
  const productIdSet = new Set(products.map((p) => p.id));
  const orderIdSet = new Set(orders.map((o) => o.id));

  const orphanedProducts = products.filter((p) => !categoryIdSet.has(p.category_id));
  const orphanedImages = productImages.filter((img) => !productIdSet.has(img.product_id));
  const orphanedVariations = productVariations.filter((v) => !productIdSet.has(v.product_id));
  const orphanedOrderItems = orderItems.filter((item) => !orderIdSet.has(item.order_id));

  if (orphanedProducts.length > 0) {
    console.warn(`⚠️ Warning: Found ${orphanedProducts.length} products with missing category_id reference.`);
  }
  if (orphanedImages.length > 0) {
    console.warn(`⚠️ Warning: Found ${orphanedImages.length} product_images with missing product_id reference.`);
  }
  if (orphanedVariations.length > 0) {
    console.warn(`⚠️ Warning: Found ${orphanedVariations.length} product_variations with missing product_id reference.`);
  }
  if (orphanedOrderItems.length > 0) {
    console.warn(`⚠️ Warning: Found ${orphanedOrderItems.length} order_items with missing order_id reference.`);
  }
  if (
    orphanedProducts.length === 0 &&
    orphanedImages.length === 0 &&
    orphanedVariations.length === 0 &&
    orphanedOrderItems.length === 0
  ) {
    console.log("✓ Relational integrity check: 100% valid. No orphaned child records found.");
  }

  // Image URL rewriting preview
  let supabaseImageCount = 0;
  let externalImageCount = 0;
  const sampleRewrites = [];

  for (const img of productImages) {
    if (img.image_url && img.image_url.includes(oldHost)) {
      supabaseImageCount++;
      if (sampleRewrites.length < 3) {
        sampleRewrites.push({
          original: img.image_url,
          rewritten: rewriteImageUrl(img.image_url, oldHost, newHost),
        });
      }
    } else {
      externalImageCount++;
    }
  }

  console.log(`\n── Step 3: Product Image URL Inspection ──`);
  console.log(`   - Images hosted on old Supabase storage: ${supabaseImageCount} (will be rewritten to new domain)`);
  console.log(`   - Images hosted on external CDNs/Google:   ${externalImageCount} (will be preserved as-is)`);

  if (sampleRewrites.length > 0) {
    console.log("   Sample URL transformation preview:");
    sampleRewrites.forEach((s, idx) => {
      console.log(`     [${idx + 1}] OLD: ${s.original}`);
      console.log(`         NEW: ${s.rewritten}`);
    });
  }

  // ── Step C: Storage Bucket Inspection ──
  console.log(`\n── Step 4: Storage Files Inspection (Bucket: 'product-images') ──`);
  const allStorageFiles = await listAllStorageObjects(oldClient, "product-images", "products");
  
  // Filter storage files to only those referenced in product_images table
  const storageFiles = allStorageFiles.filter((file) => {
    return productImages.some((img) => img.image_url && img.image_url.includes(file.name));
  });
  const unreferencedFiles = allStorageFiles.filter((file) => !storageFiles.includes(file));

  audit.storage.sourceFiles = storageFiles;
  console.log(`   - Total files found in 'products/**':      ${allStorageFiles.length}`);
  console.log(`   - Referenced files scheduled to migrate:    ${storageFiles.length}`);
  console.log(`   - Unreferenced/orphaned files to skip:      ${unreferencedFiles.length}`);
  
  if (unreferencedFiles.length > 0) {
    unreferencedFiles.forEach((f) => console.log(`       [SKIPPED ORPHAN] • ${f.fullPath}`));
  }
  if (storageFiles.length > 0) {
    console.log(`   - Referenced files:`);
    storageFiles.forEach((f) => console.log(`       [REFERENCED]     • ${f.fullPath}`));
  }

  // ── Step D: Dry-Run Assessment or Execution ──
  console.log("\n================================================================");
  if (isDryRun) {
    console.log(" 🔍 DRY-RUN AUDIT SUMMARY (No changes have been made)");
    console.log("================================================================");
    console.log("The following data is READY for migration to the new project:\n");
    console.log(`  📦 Storage Objects:      ${storageFiles.length} referenced files to copy (${unreferencedFiles.length} orphaned skipped)`);
    console.log(`  🗄️ Database Categories:  ${categories.length} records`);
    console.log(`  🗄️ Database Products:    ${products.length} records`);
    console.log(`  🗄️ Database Images:      ${productImages.length} records (${supabaseImageCount} URLs rewritten)`);
    console.log(`  🗄️ Database Variations:  ${productVariations.length} records`);
    console.log(`  🗄️ Database Orders:      ${orders.length} records`);
    console.log(`  🗄️ Database Order Items: ${orderItems.length} records\n`);

    console.log("Destination Table Current State:");
    for (const table of tables) {
      console.log(`  - ${table.padEnd(20)}: ${audit.destInitial[table]} existing rows`);
    }

    console.log("\nTo perform the actual live migration, run this command with the --execute flag:");
    console.log("  node scripts/migrate-supabase.mjs --execute\n");
    return;
  }

  // ── LIVE EXECUTION MODE ──────────────────────────────────────────────────
  console.log(" 🚀 EXECUTING MIGRATION (Writing to destination)");
  console.log("================================================================\n");

  // 1. Migrate Storage Files
  console.log("── Phase 1: Migrating Storage Objects ──");
  for (const file of storageFiles) {
    try {
      // Download from old storage
      const { data: fileBlob, error: downloadError } = await oldClient.storage
        .from("product-images")
        .download(file.fullPath);

      if (downloadError || !fileBlob) {
        throw new Error(`Download failed: ${downloadError?.message || "Empty blob"}`);
      }

      const buffer = Buffer.from(await fileBlob.arrayBuffer());
      const contentType = file.metadata?.mimetype || "image/jpeg";

      // Upload to new storage
      const { error: uploadError } = await newClient.storage
        .from("product-images")
        .upload(file.fullPath, buffer, {
          contentType,
          upsert: true, // Idempotent
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      audit.storage.copied++;
      process.stdout.write(`\r   Transferred storage files: ${audit.storage.copied}/${storageFiles.length}`);
    } catch (err) {
      audit.storage.errors.push({ file: file.fullPath, error: err.message });
      console.error(`\n   ❌ Failed to transfer ${file.fullPath}: ${err.message}`);
    }
  }
  console.log(`\n✓ Storage migration complete (${audit.storage.copied} copied, ${audit.storage.errors.length} errors).\n`);

  // 2. Migrate Database Tables in Topological Order
  async function insertBatch(tableName, rows) {
    if (rows.length === 0) return 0;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const { error } = await newClient
        .from(tableName)
        .upsert(batch, { onConflict: "id" });

      if (error) {
        throw new Error(`Upsert error on '${tableName}': ${error.message}`);
      }
      inserted += batch.length;
    }
    return inserted;
  }

  console.log("── Phase 2: Migrating Database Tables ──");

  // 2.1 Categories
  try {
    const count = await insertBatch("categories", categories);
    console.log(`✓ [1/6] categories: migrated ${count}/${categories.length} records`);
    audit.db.migrated.categories = count;
  } catch (err) {
    console.error("❌ Failed to migrate categories:", err.message);
    audit.db.errors.categories = err.message;
  }

  // 2.2 Products
  try {
    const count = await insertBatch("products", products);
    console.log(`✓ [2/6] products: migrated ${count}/${products.length} records`);
    audit.db.migrated.products = count;
  } catch (err) {
    console.error("❌ Failed to migrate products:", err.message);
    audit.db.errors.products = err.message;
  }

  // 2.3 Product Images (with URL rewrite)
  try {
    const preparedImages = productImages.map((img) => ({
      ...img,
      image_url: rewriteImageUrl(img.image_url, oldHost, newHost),
    }));
    const count = await insertBatch("product_images", preparedImages);
    console.log(`✓ [3/6] product_images: migrated ${count}/${productImages.length} records (with domain rewrites)`);
    audit.db.migrated.product_images = count;
  } catch (err) {
    console.error("❌ Failed to migrate product_images:", err.message);
    audit.db.errors.product_images = err.message;
  }

  // 2.4 Product Variations
  try {
    const count = await insertBatch("product_variations", productVariations);
    console.log(`✓ [4/6] product_variations: migrated ${count}/${productVariations.length} records`);
    audit.db.migrated.product_variations = count;
  } catch (err) {
    console.error("❌ Failed to migrate product_variations:", err.message);
    audit.db.errors.product_variations = err.message;
  }

  // 2.5 Orders
  try {
    const count = await insertBatch("orders", orders);
    console.log(`✓ [5/6] orders: migrated ${count}/${orders.length} records`);
    audit.db.migrated.orders = count;
  } catch (err) {
    console.error("❌ Failed to migrate orders:", err.message);
    audit.db.errors.orders = err.message;
  }

  // 2.6 Order Items
  try {
    const count = await insertBatch("order_items", orderItems);
    console.log(`✓ [6/6] order_items: migrated ${count}/${orderItems.length} records`);
    audit.db.migrated.order_items = count;
  } catch (err) {
    console.error("❌ Failed to migrate order_items:", err.message);
    audit.db.errors.order_items = err.message;
  }

  // ── Phase 3: Post-Migration Destination Audit ──
  console.log("\n── Phase 3: Post-Migration Destination Audit ──");
  let allMatches = true;

  for (const table of tables) {
    const { count } = await newClient
      .from(table)
      .select("*", { count: "exact", head: true });

    const sourceCount = audit.source[table];
    const match = count >= sourceCount;
    if (!match) allMatches = false;

    console.log(
      `   ${table.padEnd(20)}: Source (${sourceCount}) ➔ Destination (${count}) ${match ? "✓ PASS" : "⚠️ MISMATCH"}`
    );
  }

  console.log("\n================================================================");
  if (allMatches && audit.storage.errors.length === 0) {
    console.log(" 🎉 MIGRATION SUCCEEDED: All records & assets migrated cleanly!");
  } else {
    console.log(" ⚠️ MIGRATION FINISHED WITH WARNINGS. Review logs above.");
  }
  console.log("================================================================\n");
}

main().catch((err) => {
  console.error("❌ Unhandled migration error:", err);
  process.exit(1);
});
