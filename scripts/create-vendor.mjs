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
const serviceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const VENDOR_EMAIL = process.env.VENDOR_EMAIL || "Styledbyuriel1@gmail.com";
const VENDOR_PASSWORD = process.env.VENDOR_PASSWORD || "StyledByUriel2026!";

async function createVendor() {
  console.log(`Provisioning vendor account: ${VENDOR_EMAIL}...`);

  // Check if user already exists
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("Error listing users:", listErr.message);
    return;
  }

  const existing = userList.users.find((u) => u.email === VENDOR_EMAIL);

  if (existing) {
    console.log(`Vendor user already exists (ID: ${existing.id}). Updating password and metadata...`);
    const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(
      existing.id,
      {
        password: VENDOR_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: "vendor",
          name: "Natasha Uriel",
          atelier: "Enyimba Atelier Aba",
        },
      }
    );

    if (updateErr) {
      console.error("Error updating vendor user:", updateErr.message);
    } else {
      console.log(`✓ Vendor user updated successfully! (ID: ${updated.user.id})`);
    }
  } else {
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: VENDOR_EMAIL,
      password: VENDOR_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: "vendor",
        name: "Natasha Uriel",
        atelier: "Enyimba Atelier Aba",
      },
    });

    if (createErr) {
      console.error("Error creating vendor user:", createErr.message);
    } else {
      console.log(`✓ Vendor user created successfully! (ID: ${created.user.id})`);
    }
  }

  console.log(`\n===========================================`);
  console.log(`Vendor Login Credentials Ready:`);
  console.log(`Email:    ${VENDOR_EMAIL}`);
  console.log(`Password: ${VENDOR_PASSWORD}`);
  console.log(`===========================================\n`);
}

createVendor().catch(console.error);
