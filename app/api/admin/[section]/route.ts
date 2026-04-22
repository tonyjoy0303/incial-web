import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ALLOWED_SECTIONS = [
  "about", "clients", "trust", "blogs", "services",
  "casestudies", "products", "sections",
];

type BlogCategory = "popular" | "newest";

interface ValidationError {
  path: string;
  message: string;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  mins: number;
  date: string;
  image: string;
  images?: string[];
  category: BlogCategory;
  content?: string;
}

interface BlogsData {
  popularPosts: BlogPost[];
  newestPosts: BlogPost[];
}

function getDataFilePath(section: string): string {
  return path.join(process.cwd(), "data", `${section}.json`);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateBlogPost(
  raw: unknown,
  index: number,
  category: BlogCategory,
  errors: ValidationError[]
): BlogPost | null {
  const pathPrefix = `${category}Posts[${index}]`;
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  if (!raw || typeof raw !== "object") {
    errors.push({
      path: pathPrefix,
      message: "Post must be an object.",
    });
    return null;
  }

  const id = Number(obj.id);
  if (!Number.isInteger(id) || id <= 0) {
    errors.push({
      path: `${pathPrefix}.id`,
      message: "id must be a positive integer.",
    });
  }

  const rawSlug = typeof obj.slug === "string" ? obj.slug.trim() : "";
  if (!rawSlug) {
    errors.push({
      path: `${pathPrefix}.slug`,
      message: "slug is required.",
    });
  }
  const normalizedSlug = slugify(rawSlug);
  if (rawSlug && rawSlug !== normalizedSlug) {
    errors.push({
      path: `${pathPrefix}.slug`,
      message: "slug must be lowercase and URL-safe (letters, numbers, hyphens).",
    });
  }

  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  if (!title) {
    errors.push({
      path: `${pathPrefix}.title`,
      message: "title is required.",
    });
  }

  const author = typeof obj.author === "string" ? obj.author.trim() : "";
  if (!author) {
    errors.push({
      path: `${pathPrefix}.author`,
      message: "author is required.",
    });
  }

  const mins = Number(obj.mins);
  if (!Number.isInteger(mins) || mins <= 0) {
    errors.push({
      path: `${pathPrefix}.mins`,
      message: "mins must be a positive integer.",
    });
  }

  const date = typeof obj.date === "string" ? obj.date.trim() : "";
  if (!date) {
    errors.push({
      path: `${pathPrefix}.date`,
      message: "date is required.",
    });
  }

  const image = typeof obj.image === "string" ? obj.image.trim() : "";
  if (!image) {
    errors.push({
      path: `${pathPrefix}.image`,
      message: "image is required.",
    });
  }

  let images: string[] = [];
  if (typeof obj.images !== "undefined") {
    if (!Array.isArray(obj.images)) {
      errors.push({
        path: `${pathPrefix}.images`,
        message: "images must be an array of image URLs.",
      });
    } else {
      images = obj.images
        .map((item, imageIndex) => {
          const value = typeof item === "string" ? item.trim() : "";
          if (!value) {
            errors.push({
              path: `${pathPrefix}.images[${imageIndex}]`,
              message: "Each gallery image must be a non-empty URL.",
            });
          }
          return value;
        })
        .filter(Boolean);
    }
  }

  const incomingCategory = typeof obj.category === "string" ? obj.category.trim() : "";
  if (incomingCategory && incomingCategory !== category) {
    errors.push({
      path: `${pathPrefix}.category`,
      message: `category must be \"${category}\" in this list.`,
    });
  }

  if (errors.some((e) => e.path.startsWith(pathPrefix))) {
    return null;
  }

  return {
    id,
    slug: rawSlug,
    title,
    author,
    mins,
    date,
    image,
    images,
    category,
    content: typeof obj.content === "string" ? obj.content : "",
  };
}

function validateBlogsData(input: unknown): {
  data: BlogsData | null;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];
  const body = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  if (!Array.isArray(body.popularPosts)) {
    errors.push({
      path: "popularPosts",
      message: "popularPosts must be an array.",
    });
  }
  if (!Array.isArray(body.newestPosts)) {
    errors.push({
      path: "newestPosts",
      message: "newestPosts must be an array.",
    });
  }

  const popularInput = Array.isArray(body.popularPosts) ? body.popularPosts : [];
  const newestInput = Array.isArray(body.newestPosts) ? body.newestPosts : [];

  const popularPosts = popularInput
    .map((post, index) => validateBlogPost(post, index, "popular", errors))
    .filter((post): post is BlogPost => post !== null);
  const newestPosts = newestInput
    .map((post, index) => validateBlogPost(post, index, "newest", errors))
    .filter((post): post is BlogPost => post !== null);

  const allPosts = [...popularPosts, ...newestPosts];
  const seenSlugs = new Set<string>();
  const seenIds = new Set<number>();

  allPosts.forEach((post) => {
    if (seenSlugs.has(post.slug)) {
      errors.push({
        path: "slug",
        message: `Duplicate slug found: \"${post.slug}\". Slugs must be unique.`,
      });
    }
    seenSlugs.add(post.slug);

    if (seenIds.has(post.id)) {
      errors.push({
        path: "id",
        message: `Duplicate id found: ${post.id}. ids must be unique.`,
      });
    }
    seenIds.add(post.id);
  });

  if (errors.length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      popularPosts,
      newestPosts,
    },
    errors,
  };
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
    let payload = body;

    if (section === "blogs") {
      const { data, errors } = validateBlogsData(body);
      if (errors.length > 0 || !data) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: errors,
          },
          { status: 400 }
        );
      }
      payload = data;
    }

    const filePath = getDataFilePath(section);

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");

    if (section === "blogs") {
      revalidatePath("/blogs");
      revalidatePath("/blogs/[slug]", "page");
      revalidatePath("/admin/blogs");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
