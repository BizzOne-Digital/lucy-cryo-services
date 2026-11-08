import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Usage: npm run hash-password -- "YourStrongPassword"  (min 10 characters)');
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 12);
console.log("\nADMIN_PASSWORD_HASH (raw):\n" + hash);
console.log("\nFor .env / .env.local files (dollar signs escaped):\n" + hash.replace(/\$/g, "\$"));
console.log("\nOn Vercel, paste the raw value (no escaping).\n");
