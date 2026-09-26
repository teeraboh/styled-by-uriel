import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("No .env.local found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx !== -1) {
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    envVars[key] = val;
  }
}

const url = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"] || envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

if (!url || !serviceKey) {
  console.error("Missing SUPABASE URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const CATEGORIES = [
  { name: "Tracksuits & Sets", slug: "tracksuits" },
  { name: "Tees & Polos", slug: "tees" },
  { name: "Denim & Cargo", slug: "denim" },
  { name: "Shorts & Joggers", slug: "shorts" },
];

const INITIAL_PRODUCTS = [
  {
    sku: "SBU-TRK-01",
    name: "Signature Up & Down Tracksuit",
    categorySlug: "tracksuits",
    description: "Tan / Beige luxury streetwear jacket & jogger set with custom embroidery patches.",
    price: 25000,
    stock: 8,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Uc3_GlB4S9KdmUbHXlFKrHSfWTqZU4UiKu1G91NhfnYQ4iArMUhYvNfbReEQXhuin9nLk0A6jzVC0ydJhgsDjBTYGFLkkupkq3SmicTl29NrifpGKPiBYJZLMQtERiyaOxX5bcj1yaRo5zZuL5gMS4TQGkSmP5hwfQPErw0jSgfprcKXfZZ3ImEoTHpRR7lhFUA5-Jfa5rnGGYEowGSu7NDo2ct7HOcBxfmxPBb4NKPnMT6cv-8Z7Aes0",
  },
  {
    sku: "SBU-TEE-04",
    name: "California Vintage Ringer Tee",
    categorySlug: "tees",
    description: "Cream / Navy retro typography everyday luxury casual tee.",
    price: 15000,
    stock: 18,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Vh4cGJWj_5j2IzXk_CCzajXd8wdeo17EabHyTsFT_5k8iC8MvXM1QwoMdXgvlcKXrcEqxhjReDXa04gDDNa32RZKTKmoU1uDOR6QRabneGpU8dw7M-0HaS03TzJEmTzwSDF2-O9d9n4UFSyDjZ-gqQKVKLyBzUj3Fj20-91c_-RstZMRsqgcxC-Oy1TpHfuDaZFBstZM-NsqGE6diZUoJQjAladQ5_XN2h5YU1gvRQmSMWCPkwmxVAS84",
  },
  {
    sku: "SBU-DNM-02",
    name: "Utility Washed Cargo Jeans",
    categorySlug: "denim",
    description: "Charcoal Grey multi-pocket washed heavyweight denim trousers.",
    price: 22000,
    stock: 3,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XvR2EwOK9GssvNZvRU3IlE7_8fe2-_TQhF1lJLdL9CeQvL8ZxHztw9XTRf8UrAn8eXjsF9K6fd6fxvaGN_suT4F_HrhID2DqSikQlkIZn9Uf6yYb1vmKxmhEr_VXAyfr6JKOaX9rgT8fZ7ETCitdLAiATD-j4cIPjA9JQfEv6YcR1KV40JkZUnSiYAY8mYLBmU_YhwRwDEim7s0yjKujVW5exDXiXVYMxov5tWfUqNb9kfI7nGYJlFn1w",
  },
  {
    sku: "SBU-SHT-01",
    name: "Beige Cargo Jogger & Shorts Set",
    categorySlug: "shorts",
    description: "Sand Dune relaxed fit streetwear jogger combo with utility flap pockets.",
    price: 22000,
    stock: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0",
  },
  {
    sku: "SBU-TEE-02",
    name: "California State Vintage Polo",
    categorySlug: "tees",
    description: "Contrasting navy collar cream cotton polo with fine stitch details.",
    price: 15000,
    stock: 14,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UNGbh2Vydr4Elt1NIZop3F6TtBSVg95Qdi-m6yvH2DNFDJD_aP4L4dseK5CYqQsUzQiNJ7Z_wLZQYItoT9UUANh_mkZKW2aaQUwTOw2NKemf-Ncex5grs1N29ABimQ-s2Z1ChDTINMI7ZrxLdD0bkQ0AIkKA1zyEvsQQF0taWNPNrlTN7Cim9OzjQG2ByaNab_fipnsGXcblMuNcwVst2sZwgY23guuBFWMI0dGTugSE_F44ayA9V7EVs",
  },
  {
    sku: "SBU-DNM-03",
    name: "Urban Cargo Street Trousers",
    categorySlug: "denim",
    description: "Reinforced knee stitching, relaxed fit washed black denim.",
    price: 17000,
    stock: 11,
    imageUrl: "https://lh3.googleusercontent.com/aida/AEtjO1VZFGAF20LCOV1QXdhtNxhydXUSDcVQbN3g_RGl_JLEtVj2F-7RbNQ2aJgOPQtKDi87ii4J1r4VFM9q31P20XeLSrAIxrfTtvrJV6uks_Ck36Ah4RC39jBV8zL2OdURjaMM11AE26HyeSZM1qJBkMpFnjsLQ_9grVzifAyt6-BwjQOz7IP7SlWRV_a_B--rmzv3J0O62UG0wkHdYd6xxKuoVDQFeisgKy6yiGtcaZpq4QbDeLUqMI8miL0",
  },
];

async function seed() {
  console.log("Seeding categories...");
  const categoryMap = {};

  for (const cat of CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name: cat.name, slug: cat.slug }, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error(`Error upserting category ${cat.name}:`, error.message);
    } else {
      categoryMap[cat.slug] = data.id;
      console.log(`✓ Category: ${cat.name} (${data.id})`);
    }
  }

  console.log("\nSeeding baseline products...");
  for (const prod of INITIAL_PRODUCTS) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.warn(`Category not found for slug ${prod.categorySlug}`);
      continue;
    }

    const slug = `${prod.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}-${prod.sku.toLowerCase()}`;

    const { data: product, error: prodErr } = await supabase
      .from("products")
      .upsert(
        {
          name: prod.name,
          slug,
          description: prod.description,
          price: prod.price,
          category_id: categoryId,
          availability: true,
          stock_quantity: prod.stock,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (prodErr) {
      console.error(`Error upserting product ${prod.name}:`, prodErr.message);
      continue;
    }

    console.log(`✓ Product: ${product.name} (${product.id})`);

    // Insert image
    if (prod.imageUrl) {
      await supabase.from("product_images").upsert({
        product_id: product.id,
        image_url: prod.imageUrl,
        sort_order: 0,
      });
    }

    // Insert variations
    await supabase.from("product_variations").upsert([
      {
        product_id: product.id,
        colour: "Standard",
        size: "4Y - 6Y",
        additional_price: 0,
        stock_quantity: Math.floor(prod.stock / 2),
        availability: true,
      },
      {
        product_id: product.id,
        colour: "Standard",
        size: "7Y - 10Y",
        additional_price: 0,
        stock_quantity: Math.ceil(prod.stock / 2),
        availability: true,
      },
    ]);
  }

  console.log("\nSeeding completed successfully!");
}

seed().catch(console.error);
