// Set (or create) the admin login directly in MongoDB.
// Usage: npm run set-admin-password -- "NewPassword" [email]
// Reads MONGODB_URI and ADMIN_EMAIL from .env / .env.local.
import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

nextEnv.loadEnvConfig(process.cwd());

const password = process.argv[2];
const email = (process.argv[3] || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const uri = process.env.MONGODB_URI;

if (!password || !email) {
  console.error('Usage: npm run set-admin-password -- "NewPassword" [email]');
  process.exit(1);
}
if (!uri || uri.includes("xxxxx")) {
  console.error("MONGODB_URI is missing or still a placeholder in .env");
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
const passwordHash = await bcrypt.hash(password, 12);
const res = await mongoose.connection.collection("adminusers").updateOne(
  { email },
  {
    $set: { passwordHash, updatedAt: new Date() },
    $setOnInsert: { email, name: "Lucy CRYO Admin", createdAt: new Date() },
  },
  { upsert: true },
);
console.log(res.upsertedCount ? `Admin created: ${email}` : `Password updated for: ${email}`);
await mongoose.disconnect();
