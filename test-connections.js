import { PrismaClient } from "@prisma/client";
import ImageKit from "imagekit";
import * as dotenv from "dotenv";
dotenv.config();

async function testConnections() {
  console.log("--- Testing Neon Database Connection ---");
  const prisma = new PrismaClient();
  try {
    // Just a simple query to ensure the connection is alive
    const result = await prisma.$queryRaw`SELECT 1 as test_connection`;
    console.log("✅ Neon Database Connection Successful:", result);
  } catch (err) {
    console.error("❌ Neon Database Connection Failed:", err);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n--- Testing ImageKit Storage Connection ---");
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    console.error("❌ ImageKit credentials are not fully configured in .env");
    return;
  }

  const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
  try {
    // Check if we can authenticate to generate auth parameters
    const authParams = imagekit.getAuthenticationParameters();
    if (authParams && authParams.token) {
      console.log(
        "✅ ImageKit Configuration Looks Valid (Auth Token Generated).",
      );
    } else {
      console.log("⚠️ ImageKit Auth Generation Failed or returned empty.");
    }
  } catch (error) {
    console.error("❌ ImageKit Connection/Config Error:", error);
  }
}

testConnections();
