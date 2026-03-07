"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type CursorMode = "default" | "clicking" | "selecting";

/* ─────────────────────────────────────────────────────────
   CSS keyframes – injected once into <head>
   The glass look needs:
     1. Semi-transparent background  (lets content show through)
     2. backdrop-filter: blur        (frosts whatever is behind)
     3. Specular highlight           (top edge catches "light")
     4. Outer glow                   (blue halo for depth)
───────────────────────────────────────────────────────── */
const CURSOR_STYLES = `
  /* ── Default circle: breathe + shimmer ───────────────── */
  @keyframes cur-breathe {
    0%,100% { box-shadow:
                0 0 12px  4px  rgba(60,130,255,.60),
                0 0 32px 10px  rgba(60,130,255,.28),
                0 0 60px 20px  rgba(60,130,255,.10),
                inset 0  1px 0 rgba(255,255,255,.80),
                inset 0 -1px 0 rgba(180,210,255,.25); }
    50%     { box-shadow:
                0 0 22px  8px  rgba(60,130,255,.85),
                0 0 55px 18px  rgba(60,130,255,.40),
                0 0 90px 30px  rgba(60,130,255,.16),
                inset 0  1px 0 rgba(255,255,255,1.0),
                inset 0 -1px 0 rgba(200,225,255,.40); }
  }
  @keyframes cur-shimmer {
    0%   { background-position: -80px center; }
    100% { background-position:  80px center; }
  }
  .cur-default {
    animation: cur-breathe 2.2s ease-in-out infinite,
               cur-shimmer  2.8s linear        infinite;
    background-image: linear-gradient(
      108deg,
      rgba(60,130,255,.22)  0%,
      rgba(60,130,255,.22)  24%,
      rgba(230,245,255,.80) 48%,
      rgba(60,130,255,.22)  72%,
      rgba(60,130,255,.22)  100%
    );
    background-size: 180px 100%;
  }


  /* ── Click: scale pop spring ──────────────────────────── */
  @keyframes cur-pop {
    0%   { transform: translate(-50%,-50%) scale(1)    rotate(45deg); }
    28%  { transform: translate(-50%,-50%) scale(.65)  rotate(45deg); }
    62%  { transform: translate(-50%,-50%) scale(1.14) rotate(45deg); }
    100% { transform: translate(-50%,-50%) scale(1)    rotate(45deg); }
  }
  .cur-clicking {
    animation: cur-pop 0.32s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── Select: solid glass pulse ────────────────────────── */
  @keyframes cur-sel-pulse {
    0%,100% { box-shadow: 0 0 14px 4px rgba(60,130,255,.50),
                          inset 0 1px 0 rgba(255,255,255,.35); }
    50%     { box-shadow: 0 0 26px 9px rgba(60,130,255,.78),
                          inset 0 1px 0 rgba(255,255,255,.55); }
  }
  .cur-selecting {
    animation: cur-sel-pulse 1.1s ease-in-out infinite;
  }
`;

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const [mode, setMode] = useState<CursorMode>("default");

  /* Inject styles once */
  useEffect(() => {
    const id = "custom-cursor-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = CURSOR_STYLES;
    document.head.appendChild(tag);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  /* rAF position loop — zero re-renders for movement */
  const moveCursor = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    }
    rafRef.current = requestAnimationFrame(moveCursor);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(moveCursor);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [moveCursor]);

  /* Mouse events */
  useEffect(() => {
    const hasSel = () => (window.getSelection()?.toString().length ?? 0) > 0;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setMode((prev) => {
        if (prev === "clicking" || prev === "selecting") return prev;
        return "default";
      });
    };
    const onDown = () => setMode(hasSel() ? "selecting" : "clicking");
    const onUp = (e: MouseEvent) => {
      if (hasSel()) {
        setMode("selecting");
        return;
      }
      setMode("default");
    };
    const onSel = () => {
      if (hasSel()) {
        setMode("selecting");
        return;
      }
      setMode((p) => (p === "selecting" ? "default" : p));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("selectionchange", onSel);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("selectionchange", onSel);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999999, // Maximum z-index
        willChange: "transform",
      }}
    >
      <div
        key={mode}
        className={`cur-${mode}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          ...getShapeStyle(mode),
          transition:
            mode !== "clicking"
              ? "width 200ms cubic-bezier(.22,1,.36,1), height 200ms cubic-bezier(.22,1,.36,1), border-radius 200ms cubic-bezier(.22,1,.36,1), border-color 200ms ease"
              : "none",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Shape styles per mode
   backdrop-filter is the real glass magic — it blurs the
   pixels *behind* the element, creating the frosted look.
   Needs a semi-transparent background to be visible.
───────────────────────────────────────────────────────── */
function getShapeStyle(mode: CursorMode): React.CSSProperties {
  // Strong glassmorphism: high blur + translucent tint so the frosted distortion is clearly visible
  const glassBase: React.CSSProperties = {
    backdropFilter: "blur(20px) saturate(220%) brightness(1.08)",
    WebkitBackdropFilter: "blur(20px) saturate(220%) brightness(1.08)",
  };

  if (mode === "default") {
    return {
      ...glassBase,
      translate: "-50% -50%",
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "rgba(60,130,255,0.28)",
      border: "1.5px solid rgba(180,215,255,0.75)",
    };
  }

  if (mode === "clicking") {
    return {
      ...glassBase,
      transform: "translate(-50%,-50%) rotate(45deg)",
      width: 18,
      height: 18,
      borderRadius: "20%",
      background: "rgba(60,130,255,0.30)",
      border: "1.5px solid rgba(180,215,255,0.80)",
      boxShadow:
        "0 0 28px 8px rgba(60,130,255,.75), 0 0 55px 18px rgba(60,130,255,.30), inset 0 1px 0 rgba(255,255,255,.95)",
    };
  }

  // selecting
  return {
    ...glassBase,
    translate: "-50% -50%",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "rgba(80,155,255,0.65)",
    border: "1.5px solid rgba(190,220,255,0.80)",
    backdropFilter: "blur(20px) saturate(220%) brightness(1.08)",
    WebkitBackdropFilter: "blur(20px) saturate(220%) brightness(1.08)",
    boxShadow:
      "0 0 22px 7px rgba(60,130,255,.70), 0 0 50px 16px rgba(60,130,255,.28), inset 0 1px 0 rgba(255,255,255,.85)",
  };
}
