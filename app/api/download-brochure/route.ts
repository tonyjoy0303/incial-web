import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "pdf", "Brochure.pdf");

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Brochure is not available at the moment. Please contact us directly." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Incial-Brochure.pdf"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400", // Cache for 24h — PDF rarely changes
      },
    });
  } catch (error) {
    console.error("Download brochure error:", error);
    return NextResponse.json(
      { error: "Failed to serve brochure. Please try again later." },
      { status: 500 }
    );
  }
}