"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

interface DotData {
  lng: number;
  lat: number;
  visible: boolean;
}

let cachedLandFeatures: any = null;
let cachedDots: DotData[] | null = null;

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    let containerSize = 0;
    let radius = 0;

    // Create projection and path generator for Canvas
    const projection = d3
      .geoOrthographic()
      .scale(1)
      .translate([0, 0])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(ctx);

    const pointInPolygon = (
      point: [number, number],
      polygon: number[][],
    ): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        // Check if point is in outer ring
        if (!pointInPolygon(point, coordinates[0])) {
          return false;
        }
        // Check if point is in any hole (inner rings)
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false; // Point is in a hole
          }
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        // Check each polygon in the MultiPolygon
        for (const polygon of geometry.coordinates) {
          // Check if point is in outer ring
          if (pointInPolygon(point, polygon[0])) {
            // Check if point is in any hole
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) {
              return true;
            }
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;
      let pointsGenerated = 0;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
            pointsGenerated++;
          }
        }
      }

      return dots;
    };

    const allDots: DotData[] = [];
    let landFeatures: any;

    function render() {
      if (!containerSize || !radius) return;

      // Clear canvas
      ctx.clearRect(0, 0, containerSize, containerSize);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Draw ocean (globe background)
      ctx.beginPath();
      ctx.arc(
        containerSize / 2,
        containerSize / 2,
        currentScale,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.strokeStyle = "rgba(100, 150, 255, 0.4)"; // Slightly glowing edge
      ctx.lineWidth = 2 * scaleFactor;
      ctx.stroke();

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule();
        ctx.beginPath();
        path(graticule());
        ctx.strokeStyle = "rgba(100, 150, 255, 0.2)";
        ctx.lineWidth = 1 * scaleFactor;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw land outlines
        ctx.beginPath();
        landFeatures.features.forEach((feature: any) => {
          path(feature);
        });
        ctx.strokeStyle = "rgba(100, 150, 255, 0.6)";
        ctx.lineWidth = 1 * scaleFactor;
        ctx.stroke();

        // Draw halftone dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerSize &&
            projected[1] >= 0 &&
            projected[1] <= containerSize
          ) {
            ctx.beginPath();
            ctx.arc(
              projected[0],
              projected[1],
              1.2 * scaleFactor,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle = "rgba(150, 200, 255, 0.8)";
            ctx.fill();
          }
        });
      }
    }

    const fitCanvasToContainer = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const { width: wrapperWidth, height: wrapperHeight } =
        wrapper.getBoundingClientRect();
      const nextSize = Math.max(
        1,
        Math.floor(Math.min(wrapperWidth, wrapperHeight)),
      );

      containerSize = nextSize;
      radius = nextSize / 2.5;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = nextSize * dpr;
      canvas.height = nextSize * dpr;
      canvas.style.width = `${nextSize}px`;
      canvas.style.height = `${nextSize}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      projection.scale(radius).translate([nextSize / 2, nextSize / 2]);
      render();
    };
    const loadWorldData = async () => {
      try {
        setIsLoading(true);

        if (cachedLandFeatures && cachedDots) {
          landFeatures = cachedLandFeatures;
          allDots.push(...cachedDots);
          render();
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
        );
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        // Generate dots for all land features
        let totalDots = 0;
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 18);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true });
            totalDots++;
          });
        });

        cachedLandFeatures = landFeatures;
        cachedDots = [...allDots];

        render();
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load land map data");
        setIsLoading(false);
      }
    };

    // Set up rotation and interaction
    const rotation: [number, number] = [0, 0];
    let autoRotate = true;
    const rotationSpeed = 0.5;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      }
    };

    // Auto-rotation timer
    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [rotation[0], rotation[1]];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        setTimeout(() => {
          autoRotate = true;
        }, 10);
      };

      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
    };

    const handleWheel = (event: WheelEvent) => {
      // Allow scroll events to bubble up for the scroll section logic
      // event.preventDefault();
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newRadius = Math.max(
        radius * 0.5,
        Math.min(radius * 3, projection.scale() * scaleFactor),
      );
      projection.scale(newRadius);
      render();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel);

    fitCanvasToContainer();

    const resizeObserver = new ResizeObserver(() => {
      fitCanvasToContainer();
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    } else {
      window.addEventListener("resize", fitCanvasToContainer);
    }

    // Load the world data
    loadWorldData();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitCanvasToContainer);
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">
            Error loading Earth visualization
          </p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-transparent rounded-full cursor-grab active:cursor-grabbing"
        style={{
          filter:
            "drop-shadow(0 0 40px rgba(100, 150, 255, 0.4)) drop-shadow(0 0 80px rgba(100, 150, 255, 0.2))",
        }}
      />
    </div>
  );
}
