/**
 * Seed: Create default super admin
 * Run with: node database/seeds/002_admin.js
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query } = require("../../src/config/database");

async function seedAdmin() {
  try {
    const email = "admin@ustad.online";
    const password = "Admin@12345"; // Change after first login!
    const name = "Super Admin";

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO admins (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'super_admin')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, role`,
      [name, email, passwordHash]
    );

    if (result.length > 0) {
      console.log("? Super Admin created successfully!");
      console.log("   Email:", email);
      console.log("   Password:", password);
      console.log("   IMPORTANT: Change the password after first login!");
    } else {
      console.log("??  Admin already exists with this email, skipped.");
    }
    process.exit(0);
  } catch (err) {
    console.error("? Admin seed failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();
