import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_SECTIONS = [
  "about", "clients", "trust", "blogs", "services",
  "casestudies", "products", "sections",
];

function getDataFilePath(section: string): string {
  return path.join(process.cwd(), "data", `${section}.json`);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  try {
    const filePath = getDataFilePath(section);
    const raw = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  // Server-side session check — replaces the old Bearer token approach
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { section } = await params;
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const filePath = getDataFilePath(section);
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
