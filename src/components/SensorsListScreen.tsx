import React, { useState, useEffect } from 'react';
import { ArrowLeft, Terminal, Cpu, Wifi, Battery, Droplets, ThermometerSun, Zap, Activity, MapPin } from 'lucide-react';

interface SensorsListScreenProps {
  onBack: () => void;
}

export default function SensorsListScreen({ onBack }: SensorsListScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>('node-2');
  const [isValveOpen, setIsValveOpen] = useState(false);

  useEffect(() => {
    const newLogs = [
      "Bağlantı kuruldu: mqtt://terramind.broker:1883",
      "Saha Topolojisi Yüklendi (Malatya-Parsel-A)",
      "Node-01 (Kuzey) veri akışı stabil. RSSI: -45dBm",
      "Node-02 (Güney) uyarısı: Zemin nemi kritik eşikte (%18)",
      "Yapay Zeka: Bölgesel kuraklık stresi tespit edildi."
    ];
    setLogs(newLogs);

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('tr-TR', { hour12: false });
      const randomLog = [
        `[${time}] Node-01 Telemetri: 32ms`,
        `[${time}] Node-02 Sensör Kalibrasyonu Ok...`,
        `[${time}] Node-02 Toprak Sıcaklığı: 24.${Math.floor(Math.random() * 9)}°C`,
      ][Math.floor(Math.random() * 3)];

      setLogs(prev => [...prev.slice(-4), randomLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-[#0F172A] min-h-screen font-sans animate-in fade-in duration-300 text-slate-200 pb-6">

      {/* ÜST BAR */}
      <div className="bg-[#1E293B] px-6 py-4 flex items-center shadow-lg sticky top-0 z-20 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-700 transition-colors mr-3">
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-black text-white">Saha Donanımı & Dijital İkiz</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Canlı Veri Akışı</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex flex-col lg:flex-row gap-6">

        {/* SOL BÖLÜM: 3D Tarla Kesiti & Terminal */}
        <div className="flex-1 space-y-6">

          <div className="bg-[#1E293B] rounded-3xl border border-slate-700 p-6 relative overflow-hidden h-[400px] shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="font-bold text-slate-300">Arazi 3D Kesiti & Sensör Düğümleri</h2>
              <div className="flex gap-4 text-xs font-bold bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Sağlıklı</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Kurak</div>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center [perspective:1200px]">

              {/* GERÇEKÇİ 3D TOPRAK DİLİMİ (TERRAIN SLICE) */}
              <div
                className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-xl transition-all duration-700 hover:scale-105"
                style={{
                  transform: 'rotateX(55deg) rotateZ(-40deg)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '-1px 1px 0 #3f2a1d, -2px 2px 0 #3f2a1d, -3px 3px 0 #2d1e15, -4px 4px 0 #2d1e15, -5px 5px 0 #1e140e, -15px 15px 30px rgba(0,0,0,0.8)'
                }}
              >

                {/* Gerçek Uydu Görüntüsü (Esri World Imagery — Malatya/Yeşilyurt tarım arazisi) + NDVI Isı Haritası */}
                <div
                  className="absolute inset-0 bg-cover bg-center rounded-xl border-2 border-emerald-900/30 overflow-hidden bg-[#1a2e1a]"
                  style={{ backgroundImage: "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/25192/39725')" }}
                >
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-90"
                    style={{
                      backgroundImage: `
                        radial-gradient(ellipse 50% 40% at 20% 25%, rgba(21,128,61,0.65) 0%, rgba(34,197,94,0.35) 42%, transparent 72%),
                        radial-gradient(ellipse 38% 32% at 32% 38%, rgba(234,179,8,0.4) 0%, transparent 68%),
                        radial-gradient(ellipse 34% 42% at 70% 68%, rgba(220,38,38,0.7) 0%, rgba(234,88,12,0.4) 45%, transparent 74%),
                        radial-gradient(ellipse 45% 50% at 55% 55%, rgba(202,138,4,0.25) 0%, transparent 65%)
                      `,
                    }}
                  ></div>

                  <svg className="absolute inset-0 h-full w-full opacity-[0.15] mix-blend-overlay pointer-events-none">
                    <filter id="terramind-noise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#terramind-noise)" />
                  </svg>

                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                {/* DİK DURAN SENSÖR PİNLERİ (Kameraya dönük) */}
                <div
                  className="absolute top-[25%] left-[25%] transition-all duration-300 z-20"
                  style={{ transform: 'translateZ(10px) rotateZ(40deg) rotateX(-55deg)' }}
                >
                  <button
                    onClick={() => setSelectedNode('node-1')}
                    className="relative flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`bg-slate-900/95 border ${selectedNode === 'node-1' ? 'border-blue-500' : 'border-slate-600'} text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl mb-1 flex items-center gap-1.5 backdrop-blur-sm transition-colors`}>
                      <MapPin size={12} className="text-blue-400" />
                      NODE-01
                    </div>
                    <div className={`w-0.5 h-10 ${selectedNode === 'node-1' ? 'bg-blue-400' : 'bg-slate-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${selectedNode === 'node-1' ? 'bg-blue-500 ring-4 ring-blue-500/30' : 'bg-slate-400'}`}></div>
                  </button>
                </div>

                <div
                  className="absolute bottom-[20%] right-[20%] transition-all duration-300 z-20"
                  style={{ transform: 'translateZ(10px) rotateZ(40deg) rotateX(-55deg)' }}
                >
                  <button
                    onClick={() => setSelectedNode('node-2')}
                    className="relative flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`bg-slate-900/95 border ${selectedNode === 'node-2' ? 'border-red-500' : 'border-slate-600'} text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl mb-1 flex items-center gap-1.5 backdrop-blur-sm transition-colors animate-pulse`}>
                      <MapPin size={12} className="text-red-400" />
                      NODE-02
                    </div>
                    <div className={`w-0.5 h-10 ${selectedNode === 'node-2' ? 'bg-red-400' : 'bg-slate-400'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${selectedNode === 'node-2' ? 'bg-red-500 ring-4 ring-red-500/30' : 'bg-slate-400'}`}></div>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Canlı Terminal */}
          <div className="bg-[#0B1120] rounded-2xl border border-slate-800 p-4 font-mono text-xs shadow-inner h-36 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/80 text-slate-500">
              <Terminal size={14} /> <span>telemetry_stream.log</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide flex flex-col justify-end relative z-10">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('kritik') || log.includes('Karar') || log.includes('Yapay') ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                  <span className="text-slate-600 mr-2">{'>'}</span>{log}
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-full h-12 bg-gradient-to-b from-[#0B1120] to-transparent pointer-events-none z-20"></div>
          </div>

        </div>

        {/* SAĞ BÖLÜM: Düğüm (Node) İnceleme Paneli */}
        <div className="w-full lg:w-80 bg-[#1E293B] rounded-3xl border border-slate-700 shadow-xl overflow-hidden shrink-0 flex flex-col transition-all">
          <div className={`p-5 ${selectedNode === 'node-2' ? 'bg-red-500/10 border-b border-red-500/20' : 'bg-blue-500/10 border-b border-blue-500/20'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-white text-lg uppercase tracking-wider">{selectedNode === 'node-2' ? 'NODE-02' : 'NODE-01'}</h3>
                <p className="text-slate-400 text-xs font-medium">Güney-Doğu Parseli</p>
              </div>
              <div className="bg-slate-800 p-2 rounded-xl border border-slate-600">
                <Cpu size={20} className="text-slate-300" />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <Wifi size={16} className="text-slate-400 mb-1" />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Sinyal (RSSI)</p>
                <p className="text-sm font-black text-white">-68 dBm</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <Battery size={16} className="text-emerald-400 mb-1" />
                <p className="text-[10px] text-slate-500 font-bold uppercase">Batarya</p>
                <p className="text-sm font-black text-white">%84</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Droplets size={18} className={selectedNode === 'node-2' ? 'text-red-400' : 'text-blue-400'} />
                  <span className="text-sm font-bold text-slate-300">Toprak Nemi</span>
                </div>
                <span className={`font-black text-lg ${selectedNode === 'node-2' ? 'text-red-400' : 'text-blue-400'}`}>
                  {selectedNode === 'node-2' ? '%18' : '%45'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <ThermometerSun size={18} className="text-amber-400" />
                  <span className="text-sm font-bold text-slate-300">Yüzey Sıcaklığı</span>
                </div>
                <span className="font-black text-lg text-amber-400">26.4°C</span>
              </div>
            </div>

            {selectedNode === 'node-2' && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-3 flex items-center gap-1">
                  <Activity size={12} /> Manuel Röle Kontrolü
                </p>
                <button
                  onClick={() => setIsValveOpen(!isValveOpen)}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isValveOpen
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-slate-900/50 border border-slate-600'
                  }`}
                >
                  <Zap size={18} className={isValveOpen ? 'text-blue-200' : 'text-slate-400'} />
                  {isValveOpen ? 'SULAMA AKTİF (Kapat)' : 'Otonomu Ez & Sula'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}