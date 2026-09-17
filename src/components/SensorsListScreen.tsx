import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Cpu, Wifi, BatteryMedium, BatteryFull, BatteryLow, Radio, Activity, CheckCircle2, AlertTriangle, Layers, Droplets, AlertOctagon } from 'lucide-react';

interface SensorsListScreenProps {
  onBack: () => void;
  onOpenDetail?: (page: string) => void;
}

// --- Isı haritası için gerçek sensör düğümleri (x, y: %, moisture: %0-100) ---
interface HeatNode {
  id: string;
  label: string;
  x: number;
  y: number;
  moisture: number;
}

const HEAT_NODES: HeatNode[] = [
  { id: 'MASTER', label: 'Master Gateway', x: 15, y: 70, moisture: 42 },
  { id: 'NODE-01', label: 'NODE-01 (Sera-1)', x: 25, y: 30, moisture: 68 },
  { id: 'NODE-02', label: 'NODE-02 (Sera-2)', x: 70, y: 65, moisture: 18 },
  { id: 'NODE-03', label: 'NODE-03 (Açık Alan)', x: 78, y: 25, moisture: 35 },
];

function moistureToColor(moisture: number): [number, number, number] {
  const t = Math.max(0, Math.min(100, moisture)) / 100;
  if (t < 0.5) {
    const k = t / 0.5;
    return [
      Math.round(239 + (245 - 239) * k),
      Math.round(68 + (158 - 68) * k),
      Math.round(68 + (11 - 68) * k),
    ];
  }
  const k = (t - 0.5) / 0.5;
  return [
    Math.round(245 + (59 - 245) * k),
    Math.round(158 + (130 - 158) * k),
    Math.round(11 + (246 - 11) * k),
  ];
}

// Inverse Distance Weighting: her piksel, tüm sensörlerin uzaklığa göre
// ağırlıklandırılmış ortalaması olarak hesaplanır — sensöre yakın alanlarda o
// sensörün rengi baskın, sensörler arası boşlukta renkler yumuşakça karışır.
function drawHeatmap(canvas: HTMLCanvasElement, nodes: HeatNode[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.createImageData(w, h);
  const POWER = 2.5;

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const xPct = (px / w) * 100;
      const yPct = (py / h) * 100;

      let weightSum = 0;
      let valueSum = 0;
      let closestDist = Infinity;

      for (const node of nodes) {
        const dx = xPct - node.x;
        const dy = yPct - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        closestDist = Math.min(closestDist, dist);
        const weight = 1 / Math.pow(dist, POWER);
        weightSum += weight;
        valueSum += weight * node.moisture;
      }

      const interpolated = valueSum / weightSum;
      const [r, g, b] = moistureToColor(interpolated);

      const idx = (py * w + px) * 4;
      imageData.data[idx] = r;
      imageData.data[idx + 1] = g;
      imageData.data[idx + 2] = b;
      imageData.data[idx + 3] = Math.round(Math.min(160, 60 + 2200 / (closestDist + 8)));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export default function SensorsListScreen({ onBack }: SensorsListScreenProps) {
  const [activeTab, setActiveTab] = useState<'twin' | 'devices'>('twin');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeTab !== 'twin') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 120;
    canvas.height = 120;
    drawHeatmap(canvas, HEAT_NODES);
  }, [activeTab]);

  // Sahadaki ESP32 / Sensör Düğümleri (Mock Data)
  const devices = [
    { id: 'ESP-M1', mac: 'A4:CF:12:8F:B1:01', role: 'Master Gateway', battery: 98, signal: -45, status: 'online', type: 'esp32' },
    { id: 'NODE-01', mac: '8C:AA:B5:71:11:A2', role: 'Toprak Sensörü (Sera-1)', battery: 85, signal: -62, status: 'online', type: 'esp-now' },
    { id: 'NODE-02', mac: '8C:AA:B5:71:18:C4', role: 'Toprak Sensörü (Sera-2)', battery: 42, signal: -78, status: 'online', type: 'esp-now' },
    { id: 'NODE-03', mac: '8C:AA:B5:72:04:E8', role: 'Hava İstasyonu (Açık Alan)', battery: 12, signal: -89, status: 'warning', type: 'esp-now' },
    { id: 'VALVE-1', mac: '3C:71:BF:44:2A:90', role: 'Otonom Su Vanası', battery: 100, signal: -55, status: 'online', type: 'relay' },
  ];

  const criticalHeatNode = HEAT_NODES.reduce((min, n) => (n.moisture < min.moisture ? n : min), HEAT_NODES[0]);

  const getBatteryIcon = (level: number) => {
    if (level > 70) return <BatteryFull size={18} className="text-emerald-500" />;
    if (level > 20) return <BatteryMedium size={18} className="text-yellow-500" />;
    return <BatteryLow size={18} className="text-red-500 animate-pulse" />;
  };

  const getSignalStrength = (dbm: number) => {
    if (dbm >= -50) return { label: 'Mükemmel', color: 'text-emerald-500', bar: 4 };
    if (dbm >= -70) return { label: 'İyi', color: 'text-emerald-400', bar: 3 };
    if (dbm >= -85) return { label: 'Zayıf', color: 'text-yellow-500', bar: 2 };
    return { label: 'Kritik', color: 'text-red-500', bar: 1 };
  };

  return (
    <div className="flex-1 bg-slate-900 min-h-screen font-sans text-slate-200 animate-in fade-in duration-300 flex flex-col">

      {/* ÜST BAŞLIK */}
      <div className="flex items-center justify-between p-6 pb-2 sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-black text-white">Donanım & Dijital İkiz</h1>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ESP-NOW Mesh Ağı Aktif
            </p>
          </div>
        </div>
        <div className="bg-emerald-500/10 p-2.5 rounded-full border border-emerald-500/20">
          <Cpu size={20} className="text-emerald-400" />
        </div>
      </div>

      {/* SEKME KONTROLLERİ */}
      <div className="px-6 pt-6">
        <div className="flex bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('twin')}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'twin' ? 'bg-slate-700 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers size={18} className="mr-2" />
            3D Dijital İkiz (Heatmap)
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'devices' ? 'bg-slate-700 text-blue-400 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Radio size={18} className="mr-2" />
            Cihaz Yönetimi (Telemetri)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* 3D DİJİTAL İKİZ KATMANI — gerçek IDW ısı haritası */}
        {activeTab === 'twin' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl overflow-hidden relative">

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="font-black text-white text-lg">Arazi Topografi & Nem Haritası</h3>
                  <p className="text-xs text-slate-400">Sensör düğümlerinden gelen eşzamanlı ısı/nem yansımaları</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-700"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Islak</span>
                  <span className="flex items-center text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-700"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Kurak</span>
                </div>
              </div>

              {/* Gerçek ısı haritası: canvas + sensör noktaları */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/50">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full mix-blend-screen"
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                {HEAT_NODES.map((node) => {
                  const isCritical = node.moisture < 25;
                  const isOptimal = node.moisture >= 60;
                  const dotColor = isCritical ? 'bg-red-500' : isOptimal ? 'bg-blue-400' : 'bg-emerald-400';
                  const glow = isCritical ? '#ef4444' : isOptimal ? '#3b82f6' : '#34d399';
                  const borderColor = isCritical ? 'border-red-500/50' : isOptimal ? 'border-blue-500/50' : 'border-emerald-500/50';
                  const textColor = isCritical ? 'text-red-400' : isOptimal ? 'text-blue-400' : 'text-emerald-400';

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <div
                        className={`w-4 h-4 ${dotColor} rounded-full ${isCritical ? 'animate-pulse' : ''}`}
                        style={{ boxShadow: `0 0 20px ${glow}` }}
                      ></div>
                      <div className={`absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] p-2 rounded-lg border ${borderColor} font-bold whitespace-nowrap shadow-xl`}>
                        {node.label}<br />
                        <span className={textColor}>Nem: %{node.moisture}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700 flex items-start gap-4">
              {criticalHeatNode.moisture < 25 ? (
                <AlertOctagon className="text-red-400 shrink-0 mt-1" size={24} />
              ) : (
                <Activity className="text-blue-400 shrink-0 mt-1" size={24} />
              )}
              <div>
                <h4 className="font-bold text-white mb-1">Katman Analizi</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  <strong className="text-white">{criticalHeatNode.label}</strong> sensöründen düşük nem (%{criticalHeatNode.moisture}) ve yüksek zemin sıcaklığı yansımaları alınıyor. İkiz model üzerinde kırmızı heatmap olarak işaretlenen bu alana otonom sulama yönlendirilebilir.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CİHAZ YÖNETİM PANELİ (TELEMETRİ) */}
        {activeTab === 'devices' && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
            {devices.map((device, index) => {
              const signalData = getSignalStrength(device.signal);
              const isWarning = device.status === 'warning';

              return (
                <div key={index} className={`bg-slate-800 rounded-2xl p-5 border transition-all ${isWarning ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-500/10' : 'bg-slate-700'}`}>
                        {device.type === 'esp32' ? <Cpu size={24} className="text-blue-400" /> :
                         device.type === 'relay' ? <Activity size={24} className="text-emerald-400" /> :
                         <Radio size={24} className={isWarning ? 'text-red-400' : 'text-slate-300'} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-white">{device.id}</h4>
                          {isWarning ? <AlertTriangle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
                        </div>
                        <p className="text-xs font-medium text-slate-400">{device.role}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-widest">{device.mac}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Sinyal</span>
                        <div className="flex items-end gap-1 h-5">
                          {[1, 2, 3, 4].map(bar => (
                            <div key={bar} className={`w-1.5 rounded-t-sm ${bar <= signalData.bar ? 'bg-current ' + signalData.color : 'bg-slate-700'}`} style={{ height: `${bar * 25}%` }}></div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1">{device.signal} dBm</span>
                      </div>

                      <div className="w-px h-8 bg-slate-700"></div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Güç</span>
                        {getBatteryIcon(device.battery)}
                        <span className={`text-[10px] font-bold mt-1 ${device.battery < 20 ? 'text-red-400' : 'text-slate-400'}`}>%{device.battery}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}