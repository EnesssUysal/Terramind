import React, { useState, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Droplets,
  AlertTriangle,
  Sparkles,
  CloudRain,
  RotateCcw,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// TerraMind — Karbon Ayak İzi Paneli: Kriz Simülasyonu
//
// Sunum akışı (jüri önünde canlı demo):
//   1) idle    -> her şey normal, toprak nemi %45
//   2) crisis  -> "Simüle Et" tetiklenir, nem aniden %15'e düşer, kırmızı alarm
//   3) solved  -> ~1.5sn sonra AI Su Tasarruf Motoru devreye girer (yeşil kart)
//
// Sağ üstteki "Simüle Et" butonu bilinçli olarak küçük/soluk tutuldu; jüri
// ilk bakışta fark etmez, sunucu kolayca tıklayabilir.
// ---------------------------------------------------------------------------

const BASE_HISTORY = [
  { time: "-6s", moisture: 44 },
  { time: "-5s", moisture: 45 },
  { time: "-4s", moisture: 46 },
  { time: "-3s", moisture: 45 },
  { time: "-2s", moisture: 44 },
  { time: "-1s", moisture: 45 },
];

const CRITICAL_LEVEL = 20; // %20 altı kritik kuraklık eşiği

export default function CrisisSimulationPanel() {
  // "idle" | "crisis" | "solved"
  const [stage, setStage] = useState("idle");

  const isCrisis = stage === "crisis" || stage === "solved";
  const isSolved = stage === "solved";

  const currentMoisture = isCrisis ? 15 : 45;

  const chartData = useMemo(() => {
    return [...BASE_HISTORY, { time: "Şimdi", moisture: currentMoisture }];
  }, [currentMoisture]);

  const runSimulation = useCallback(() => {
    if (stage !== "idle") return; // tekrar tetiklemeyi engelle
    setStage("crisis");
    setTimeout(() => setStage("solved"), 1600);
  }, [stage]);

  const resetSimulation = useCallback(() => {
    setStage("idle");
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Ana Panel */}
      <div
        className={`rounded-2xl border transition-colors duration-500 p-5 shadow-sm
          ${
            isCrisis
              ? "bg-red-50 border-red-500"
              : "bg-white border-slate-200"
          }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets
              className={`w-5 h-5 ${
                isCrisis ? "text-red-500" : "text-sky-500"
              }`}
            />
            <h3 className="font-semibold text-slate-800">
              Toprak Nemi — Detaylı Analiz
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-bold tabular-nums ${
                isCrisis ? "text-red-600" : "text-sky-600"
              }`}
            >
              %{currentMoisture}
            </span>

            {/* Tetikleyici — normal akışta, hiçbir absolute/fixed hile yok.
                Panelin geri kalanı render oluyorsa bu da olur. */}
            <button
              type="button"
              onClick={stage === "idle" ? runSimulation : resetSimulation}
              title={stage === "idle" ? "Simüle Et" : "Sıfırla"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                color: "#6b7280",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                cursor: "pointer",
              }}
            >
              {stage === "idle" ? <Zap size={12} /> : <RotateCcw size={12} />}
              {stage === "idle" ? "Simüle Et" : "Sıfırla"}
            </button>
          </div>
        </div>

        {/* Recharts grafiği */}
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isCrisis ? "#ef4444" : "#0ea5e9"}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={isCrisis ? "#ef4444" : "#0ea5e9"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis
                domain={[0, 60]}
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                width={30}
              />
              <ReferenceLine
                y={CRITICAL_LEVEL}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: "Kritik Eşik",
                  fontSize: 10,
                  fill: "#ef4444",
                  position: "insideTopRight",
                }}
              />
              <Tooltip
                formatter={(value) => [`%${value}`, "Nem"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke={isCrisis ? "#ef4444" : "#0ea5e9"}
                strokeWidth={2.5}
                fill="url(#moistureFill)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Kırmızı Alarm Durumu */}
        {isCrisis && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500 bg-red-100/70 px-3 py-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Kritik Kuraklık Tespit Edildi
              </p>
              <p className="text-xs text-red-600">
                Toprak nemi güvenli aralığın altına düştü (%{CRITICAL_LEVEL} eşik).
              </p>
            </div>
          </div>
        )}

        {/* AI Müdahalesi — Wow Efekti */}
        {isSolved && (
          <div
            className="mt-3 relative overflow-hidden rounded-xl border border-emerald-400
                       bg-slate-900 px-4 py-3 shadow-lg shadow-emerald-500/50
                       transition-opacity duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 opacity-60" />
            <div className="relative flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-emerald-400">
                    AI Su Tasarruf Motoru Devrede
                  </p>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <CloudRain className="w-3 h-3 inline mr-1 -mt-0.5 text-emerald-300" />
                  18 saat sonra yağmur bekleniyor, AI sulamayı otomatik iptal
                  etti.{" "}
                  <span className="text-emerald-300 font-semibold">
                    420L su tasarrufu
                  </span>{" "}
                  sağlandı.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}