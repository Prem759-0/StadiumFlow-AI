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
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F5F0E8" stopOpacity="1" />
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
        <rect
          x="5"
          y="15"
          width="90"
          height="70"
          rx="15"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="2"
        />
        <rect
          x="10"
          y="20"
          width="80"
          height="60"
          rx="10"
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Playing field */}
        <rect
          x="30"
          y="30"
          width="40"
          height="40"
          rx="2"
          fill="url(#field-gradient)"
          stroke="#000000"
          strokeWidth="1.5"
        />
        {/* Pitch */}
        <rect
          x="47"
          y="44"
          width="6"
          height="12"
          rx="0.5"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
        />

        {/* Zone rectangles */}
        {processedZones.map((zone) => {
          const color = zone.isLockedDown ? "#000000" : getCongestionColor(zone.level);
          const isSelected = selectedZone === zone.id;

          return (
            <g key={zone.id}>
              <rect
                x={zone.position.x - zone.dimensions.width / 2}
                y={zone.position.y - zone.dimensions.height / 2}
                width={zone.dimensions.width}
                height={zone.dimensions.height}
                rx="0"
                fill={color}
                fillOpacity={isSelected || zone.isLockedDown ? 1 : 0.8}
                stroke={zone.isLockedDown ? "#FF3333" : "#000"}
                strokeWidth={zone.isLockedDown ? 2 : isSelected ? 1.5 : 0.8}
                className="transition-all duration-500 cursor-pointer"
                style={{
                  animation: zone.isLockedDown 
                    ? "sos-pulse 1s ease-in-out infinite" 
                    : zone.level === "high" 
                      ? "heatmapPulse 2s ease-in-out infinite" 
                      : undefined, 
                  filter: isSelected ? "drop-shadow(2px 2px 0px #000)" : "drop-shadow(1px 1px 0px #000)" 
                }}
                onClick={() => onZoneClick?.(zone.id)}
                role="button"
                tabIndex={0}
                aria-label={`${zone.name}: ${Math.round(zone.density)}% occupied, ${zone.level} congestion${zone.isLockedDown ? ", LOCKED DOWN" : ""}`}
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
                  fill={zone.isLockedDown ? "#FF3333" : "#000"}
                  fontSize="1.8"
                  fontWeight="900"
                  className="pointer-events-none select-none uppercase"
                  aria-hidden="true"
                >
                  {zone.isLockedDown ? "LOCKED" : zone.name.replace(/Section |Food Court |Restroom |Parking Lot /, "").slice(0, 6)}
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
            fill="#000"
            fontSize="2.5"
            fontWeight="900"
            className="pointer-events-none opacity-40 uppercase"
            aria-hidden="true"
          >
            FIELD
          </text>
        )}

        {/* Advanced Animations: Linear Scanner and Particle Flow */}
        {!compact && (
          <>
            <g className="animate-scanner pointer-events-none">
              <rect x="5" y="15" width="2" height="70" fill="#00FF87" />
              <rect x="5" y="15" width="15" height="70" fill="url(#scan-gradient)" />
            </g>
            <defs>
              <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FF87" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Simulating crowd flow with particles */}
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="0.8"
                fill="#FFE600"
                className="animate-particle pointer-events-none"
                style={{
                  '--tx': `${(Math.random() - 0.5) * 80}px`,
                  '--ty': `${(Math.random() - 0.5) * 60}px`,
                  animationDelay: `${i * 0.25}s`
                } as any}
              />
            ))}
          </>
        )}
      </svg>

      {/* Legend */}
      {!compact && (
        <div
          className="absolute bottom-2 left-2 flex gap-3 text-xs"
          aria-label="Heatmap legend"
        >
          {[
            { level: "Low", color: "#00FF87" },
            { level: "Medium", color: "#FFE600" },
            { level: "High", color: "#FF3333" },
          ].map(({ level, color }) => (
            <div key={level} className="flex items-center gap-1.5 px-2 py-0.5 bg-white border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
              <span
                className="w-2.5 h-2.5 rounded-none border border-black"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-black font-black uppercase tracking-wider text-[9px]">{level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
