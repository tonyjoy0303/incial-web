import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// Generate a random string for filename mapping
function generateId(length: number = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function validateAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const adminSecret = process.env.ADMIN_SECRET || "incial-admin-2024";
  return token === adminSecret;
}

export async function POST(req: NextRequest) {
  if (!validateAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      return NextResponse.json(
        { error: "ImageKit is not configured on the server." },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create a unique filename
    const ext = file.name.split(".").pop() || "png";
    const filename = `img-${Date.now()}-${generateId()}.${ext}`;

    // Allow callers to specify a subfolder (e.g. "images/about", "clients")
    const folder = (formData.get("folder") as string | null) || "";
    const targetFolder = folder
      ? `/incial-web/${folder.replace(/^\/|\/$/g, "")}`
      : "/incial-web/uploads";

    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: filename,
          folder: targetFolder,
        },
        function(error, result) {
          if (error) reject(error);
          else resolve(result);
        }
      );
    }) as any;

    return NextResponse.json({ url: uploadResponse.url }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload to ImageKit." },
      { status: 500 }
    );
  }
}
