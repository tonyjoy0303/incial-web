import fs from "fs";
import path from "path";

/**
 * Script to upload an image to ImageKit via the Next.js API.
 * Usage: node scripts/upload.mjs <path-to-image>
 */

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node scripts/upload.mjs <path-to-image>");
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Uploading ${filePath} to ImageKit via Next.js API...`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);

    const formData = new FormData();
    formData.append("file", blob, path.basename(filePath));

    // The API route currently uses this default secret if ADMIN_SECRET isn't in .env
    const adminSecret = process.env.ADMIN_SECRET || "incial-admin-2024";

    // Ensure Next.js server is running on localhost:3000
    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminSecret}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    console.log("✅ Upload successful!");
    console.log("🌐 Image URL:", data.url);
  } catch (error) {
    console.error("❌ Error uploading image:", error.message);
    console.error(
      "Make sure your Next.js development server is running on http://localhost:3000",
    );
  }
}

main();
