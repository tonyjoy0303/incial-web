// lib/imagekitLoader.ts
// Custom loader for Next.js Image Component to utilize ImageKit CDN directly.
// Falls back gracefully for local and non-ImageKit external images.

interface ImageKitLoaderContext {
  src: string;
  width: number;
  quality?: number;
}

const IK_ENDPOINT = "https://ik.imagekit.io/0bs3my2iz";
// Snap to these widths to maximise ImageKit cache hits
const SNAP_WIDTHS = [640, 1080, 1920];

function snapWidth(w: number): number {
  for (const bucket of SNAP_WIDTHS) {
    if (w <= bucket) return bucket;
  }
  return SNAP_WIDTHS[SNAP_WIDTHS.length - 1];
}

export default function imagekitLoader({ src, width, quality }: ImageKitLoaderContext): string {
  if (!src) return src;

  // ── ImageKit CDN URLs: add transformation params ──────────────────────────
  if (src.startsWith(IK_ENDPOINT) || src.startsWith("https://ik.imagekit.io")) {
    const optimizedWidth = snapWidth(width);
    const q = quality ?? 80;
    const paramsString = `w-${optimizedWidth},q-${q}`;

    try {
      const url = new URL(src);
      // url.pathname = "/0bs3my2iz/incial-web/..." → strip the account-id prefix
      // so we don't duplicate it when prepending IK_ENDPOINT
      const accountId = "0bs3my2iz";
      const pathAfterAccount = url.pathname.startsWith(`/${accountId}`)
        ? url.pathname.slice(`/${accountId}`.length)  // → "/incial-web/..."
        : url.pathname;
      return `${IK_ENDPOINT}/tr:${paramsString}${pathAfterAccount}`;
    } catch {
      return src;
    }
  }

  // ── Local paths (e.g. /logo/Logoo-white.svg) ─────────────────────────────
  // Custom loaders MUST return absolute URLs; derive origin from env var.
  if (src.startsWith("/")) {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    return `${base}${src}`;
  }

  // ── Any other external URL → return unchanged ─────────────────────────────
  return src;
}

