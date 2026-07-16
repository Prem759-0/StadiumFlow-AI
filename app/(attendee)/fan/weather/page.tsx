"use client";

// ============================================================
// StadiumFlow AI - Weather & Safety Page
// Real-time weather, heat index, safety advisories
// ============================================================

import { useState, useEffect } from "react";
import { ThermometerSun, Droplets, Wind, Eye, AlertTriangle, Shield, Zap, Sun } from "lucide-react";

const WEATHER_DATA = {
  temp: 34,
  feelsLike: 41,
  humidity: 68,
  windSpeed: 12,
  visibility: "Good",
  condition: "Partly Cloudy",
  uvIndex: 8,
  heatIndex: "Extreme Caution",
  heatIndexColor: "#FF6B00",
};

const SAFETY_ADVISORIES = [
  {
    level: "warning",
    icon: "🌡️",
    title: "Heat Advisory Active",
    desc: "Temperature 34°C with 68% humidity. Heat index in EXTREME CAUTION zone. Stay hydrated.",
    color: "#FF6B00",
  },
  {
    level: "info",
    icon: "💧",
    title: "Free Water Stations",
    desc: "25 free hydration stations active near all gates and food courts. Look for the blue tents.",
    color: "#00C6FF",
  },
  {
    level: "success",
    icon: "🏥",
    title: "Medical Posts Staffed",
    desc: "4 medical response stations active at Gates A, B, C, D. Response time < 90 seconds.",
    color: "#00FF87",
  },
  {
    level: "warning",
    icon: "☀️",
    title: "High UV Warning",
    desc: "UV Index 8 (Very High). SPF 30+ sunscreen recommended for outdoor areas.",
    color: "#FFE600",
  },
];

const HYDRATION_TIPS = [
  "Drink 500ml water every 30 minutes",
  "Avoid alcohol & sugary drinks in heat",
  "Wear light, breathable clothing",
  "Find shade during peak sun (12–3pm)",
  "Know the signs of heat stroke",
];

export default function WeatherPage() {
  const [temp, setTemp] = useState(WEATHER_DATA.temp);

  useEffect(() => {
    const id = setInterval(() => {
      setTemp(t => t + (Math.random() > 0.5 ? 0.1 : -0.1));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#FF6B00", border: "2px solid #000", boxShadow: "3px 3px 0 #000" }}>
          <ThermometerSun className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "#050505" }}>Weather & Safety</h1>
          <p className="text-xs" style={{ color: "#555555" }}>Real-time conditions · MetLife Stadium</p>
        </div>
        <span className="comic-label ml-auto">LIVE</span>
      </div>

      {/* Main Temperature Card */}
      <div className="rounded-xl p-5 comic-panel bg-white" style={{ background: "#FFFFFF", border: "2px solid #FF6B00", boxShadow: "4px 4px 0 #FF6B00" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-7xl font-black tabular-nums" style={{ color: "#FF6B00" }}>
              {Math.round(temp)}<span className="text-3xl">°C</span>
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: "#555555" }}>{WEATHER_DATA.condition}</p>
            <p className="text-xs mt-0.5" style={{ color: "#555555" }}>
              Feels like {WEATHER_DATA.feelsLike}°C
            </p>
          </div>
          <div className="text-center">
            <Sun className="w-16 h-16" style={{ color: "#FFE600", filter: "drop-shadow(0 0 12px rgba(255,230,0,0.5))" }} />
            <div className="mt-2 px-3 py-1 rounded-lg font-black text-xs"
              style={{ background: `${WEATHER_DATA.heatIndexColor}22`, border: `2px solid ${WEATHER_DATA.heatIndexColor}`, color: WEATHER_DATA.heatIndexColor }}>
              {WEATHER_DATA.heatIndex}
            </div>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Droplets, label: "Humidity", value: `${WEATHER_DATA.humidity}%`, color: "#00C6FF" },
            { icon: Wind, label: "Wind", value: `${WEATHER_DATA.windSpeed} km/h`, color: "#00FF87" },
            { icon: Eye, label: "UV Index", value: `${WEATHER_DATA.uvIndex} Very High`, color: "#FFE600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${color}25` }}>
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <p className="text-xs font-bold" style={{ color: "#050505" }}>{value}</p>
              <p className="text-[9px]" style={{ color: "#3b4480" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Advisories */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "#050505" }}>
          <Shield className="w-4 h-4" style={{ color: "#00FF87" }} />
          Safety Advisories
        </h2>
        <div className="space-y-2">
          {SAFETY_ADVISORIES.map((advisory) => (
            <div key={advisory.title} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: "#FFFFFF", border: `2px solid ${advisory.color}`, boxShadow: `3px 3px 0 ${advisory.color}` }}>
              <span className="text-2xl flex-shrink-0">{advisory.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: advisory.color }}>{advisory.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#555555" }}>{advisory.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Tips */}
      <div className="rounded-xl p-4" style={{ background: "#FFFFFF", border: "2px solid #00C6FF", boxShadow: "4px 4px 0 #00C6FF" }}>
        <h2 className="text-sm font-black flex items-center gap-2 mb-3" style={{ color: "#00C6FF" }}>
          <Droplets className="w-4 h-4" /> Hydration & Heat Safety Tips
        </h2>
        <div className="space-y-2">
          {HYDRATION_TIPS.map((tip, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
                style={{ background: "#00C6FF", color: "#0A0A0A" }}>{i + 1}</div>
              <p className="text-xs" style={{ color: "#555555" }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
