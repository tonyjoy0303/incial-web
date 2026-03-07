import fs from "fs";
import path from "path";

// Function to replace local image paths with ImageKit URLs
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");
    const originalContent = content;

    // We replace /images/... with the new ImageKit URL
    // e.g. /images/about/Brand.png -> https://ik.imagekit.io/0bs3my2iz/incial-web/images/about/Brand.png
    content = content.replace(
      /"\/images\/([^"]+)"/g,
      '"https://ik.imagekit.io/0bs3my2iz/incial-web/images/$1"',
    );

    // Replace /clients/...
    content = content.replace(
      /"\/clients\/([^"]+)"/g,
      '"https://ik.imagekit.io/0bs3my2iz/incial-web/clients/$1"',
    );

    // Replace /logo/...
    content = content.replace(
      /"\/logo\/([^"]+)"/g,
      '"https://ik.imagekit.io/0bs3my2iz/incial-web/logo/$1"',
    );

    // Special cases in TSX files where it might not have quotes (e.g. src="/images/...")
    content = content.replace(
      /src="\/images\/([^"]+)"/g,
      'src="https://ik.imagekit.io/0bs3my2iz/incial-web/images/$1"',
    );
    content = content.replace(
      /src="\/clients\/([^"]+)"/g,
      'src="https://ik.imagekit.io/0bs3my2iz/incial-web/clients/$1"',
    );
    content = content.replace(
      /src="\/logo\/([^"]+)"/g,
      'src="https://ik.imagekit.io/0bs3my2iz/incial-web/logo/$1"',
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Only check JS, TS, JSX, TSX, and JSON files
      if (/\.(js|ts|jsx|tsx|json)$/i.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function main() {
  const dataDir = path.resolve("./data");
  const compDir = path.resolve("./components");
  const appDir = path.resolve("./app");

  let allFiles = [];

  if (fs.existsSync(dataDir)) allFiles = allFiles.concat(getAllFiles(dataDir));
  if (fs.existsSync(compDir)) allFiles = allFiles.concat(getAllFiles(compDir));
  if (fs.existsSync(appDir)) allFiles = allFiles.concat(getAllFiles(appDir));

  if (allFiles.length === 0) {
    console.log("No files found to process.");
    return;
  }

  console.log(`Scanning ${allFiles.length} files for local image paths...`);

  for (const filePath of allFiles) {
    processFile(filePath);
  }

  console.log("🎉 Replace operation completed!");
}

main();
