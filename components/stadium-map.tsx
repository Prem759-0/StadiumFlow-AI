"use client";

// ============================================================
// StadiumFlow AI - Interactive Stadium Map with Heatmap
// SVG-based stadium visualization with color-coded congestion
// ============================================================

import { useMemo } from "react";
import { getCongestionLevel, getCongestionColor } from "@/lib/utils";
import type { StadiumZone } from "@/lib/mock-data";

interface StadiumMapProps {
  zones: StadiumZone[];
  selectedZone?: string | null;
  onZoneClick?: (zoneId: string) => void;
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export default function StadiumMap({
  zones,
  selectedZone,
  onZoneClick,
  showLabels = true,
  compact = false,
  className = "",
}: StadiumMapProps) {
  const processedZones = useMemo(
    () =>
      zones.map((zone) => ({
        ...zone,
        density: (zone.currentOccupancy / zone.capacity) * 100,
        level: getCongestionLevel((zone.currentOccupancy / zone.capacity) * 100),
      })),
    [zones]
  );

  const viewBox = compact ? "5 5 90 90" : "0 0 100 100";

  return (
    <div className={`relative ${className}`} role="img" aria-label="Stadium heatmap showing crowd density by zone">
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <defs>
          <radialGradient id="field-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00e639" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00e639" stopOpacity="0.03" />
          </radialGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stadium outline */}
        <ellipse
          cx="50"
          cy="50"
          rx="46"
          ry="44"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="36"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />

        {/* Playing field */}
        <ellipse
          cx="50"
          cy="50"
          rx="18"
          ry="14"
          fill="url(#field-gradient)"
          stroke="rgba(0,230,57,0.3)"
          strokeWidth="0.3"
        />
        {/* Pitch */}
        <rect
          x="47"
          y="44"
          width="6"
          height="12"
          rx="0.5"
          fill="rgba(0,230,57,0.1)"
          stroke="rgba(0,230,57,0.2)"
          strokeWidth="0.2"
        />

        {/* Zone rectangles */}
        {processedZones.map((zone) => {
          const color = getCongestionColor(zone.level);
          const isSelected = selectedZone === zone.id;

          return (
            <g key={zone.id}>
              <rect
                x={zone.position.x - zone.dimensions.width / 2}
                y={zone.position.y - zone.dimensions.height / 2}
                width={zone.dimensions.width}
                height={zone.dimensions.height}
                rx="1"
                fill={color}
                fillOpacity={isSelected ? 0.7 : 0.35}
                stroke={isSelected ? "#fff" : color}
                strokeWidth={isSelected ? 0.6 : 0.3}
                className="transition-all duration-500 cursor-pointer"
                style={{ animation: zone.level === "high" ? "heatmapPulse 2s ease-in-out infinite" : undefined }}
                onClick={() => onZoneClick?.(zone.id)}
                role="button"
                tabIndex={0}
                aria-label={`${zone.name}: ${Math.round(zone.density)}% occupied, ${zone.level} congestion`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onZoneClick?.(zone.id);
                  }
                }}
              />
              {showLabels && !compact && zone.dimensions.width > 5 && (
                <text
                  x={zone.position.x}
                  y={zone.position.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="1.8"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                  aria-hidden="true"
                >
                  {zone.name.replace(/Section |Food Court |Restroom |Parking Lot /, "").slice(0, 6)}
                </text>
              )}
            </g>
          );
        })}

        {/* Center label */}
        {!compact && (
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="2.5"
            fontWeight="700"
            className="pointer-events-none"
            aria-hidden="true"
          >
            FIELD
          </text>
        )}
      </svg>

      {/* Legend */}
      {!compact && (
        <div
          className="absolute bottom-2 left-2 flex gap-3 text-xs"
          aria-label="Heatmap legend"
        >
          {[
            { level: "Low", color: "#22c55e" },
            { level: "Medium", color: "#eab308" },
            { level: "High", color: "#ef4444" },
          ].map(({ level, color }) => (
            <div key={level} className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: color, opacity: 0.6 }}
                aria-hidden="true"
              />
              <span className="text-navy-300">{level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
