import fs from "fs";
import path from "path";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  console.error("Missing ImageKit credentials in .env file.");
  process.exit(1);
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

async function uploadFile(filePath, folderPath) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: fileBuffer,
        fileName: fileName,
        folder: folderPath,
        useUniqueFileName: false, // keep original names if possible, but ImageKit might add suffixes if it exists
      },
      (error, result) => {
        if (error) {
          console.error(`❌ Failed to upload ${fileName}:`, error.message);
          reject(error);
        } else {
          console.log(`✅ Uploaded ${fileName} -> ${result.url}`);
          resolve(result);
        }
      },
    );
  });
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Only include image/svg files
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      "Usage: node scripts/upload-directory.mjs <local-directory-path> [imagekit-base-folder]",
    );
    console.error(
      "Example: node scripts/upload-directory.mjs ./public /incial-web/public",
    );
    process.exit(1);
  }

  const sourceDir = path.resolve(args[0]);
  const baseIkFolder = args[1] || "/incial-web";

  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    process.exit(1);
  }

  console.log(`Scanning ${sourceDir} for images...`);
  const allFiles = getAllFiles(sourceDir);

  if (allFiles.length === 0) {
    console.log("No images found in the specified directory.");
    return;
  }

  console.log(
    `Found ${allFiles.length} images. Starting upload to ImageKit folder: ${baseIkFolder}`,
  );

  for (const filePath of allFiles) {
    // Calculate relative path to maintain folder structure
    const relativePath = path.relative(sourceDir, filePath);
    const dirName = path.dirname(relativePath);

    // Determine ImageKit folder
    let ikFolder = baseIkFolder;
    if (dirName !== ".") {
      // Replace Windows backslashes with forward slashes for ImageKit
      ikFolder = `${baseIkFolder}/${dirName.replace(/\\/g, "/")}`;
    }

    try {
      await uploadFile(filePath, ikFolder);
    } catch (err) {
      // Continue with the next file even if one fails
    }
  }

  console.log("🎉 All uploads completed!");
}

main();
