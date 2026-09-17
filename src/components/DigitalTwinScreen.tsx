import React, { useState } from 'react';
import { ArrowLeft, Server, Layers, Radio, Droplets, AlertTriangle, Wifi, Cpu, Activity, Map, Crosshair } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function DigitalTwinScreen({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'telemetry'>('heatmap');
  const [mapLayer, setMapLayer] = useState<'satellite' | 'infrared'>('satellite');

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* ÜST BİLGİ */}
      <header className="flex items-center gap-3 p-4 bg-[#0F172A] border-b border-slate-800 sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-[16px] font-black text-white flex items-center gap-2">
            <Server size={18} className="text-emerald-400" /> Donanım & Dijital İkiz
          </h1>
          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5 mt-0.5 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[ping_1.5s_ease-in-out_infinite]"></span>
            Mesh Ağı Aktif
          </span>
        </div>
      </header>

      {/* SEKMELER */}
      <div className="p-4 pb-0 z-10">
        <div className="flex bg-[#0F172A] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'heatmap' ? 'bg-[#1E293B] text-emerald-400 shadow-md border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Layers size={16} /> Drone Radar Haritası
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'telemetry' ? 'bg-[#1E293B] text-emerald-400 shadow-md border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Radio size={16} /> Cihaz Telemetrisi
          </button>
        </div>
      </div>

      <main className="flex-1 p-4 pb-24">
        {activeTab === 'heatmap' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* YENİ GERÇEKÇİ HARİTA */}
            <div className="relative w-full h-[500px] bg-slate-900 rounded-3xl border-2 border-slate-700/50 shadow-2xl overflow-hidden group">
              
              {/* 1. KATMAN: Gerçekçi Tarla Uydu Fotoğrafı */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${mapLayer === 'satellite' ? 'opacity-80 scale-100' : 'opacity-30 scale-105'}`}
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop)' }}
              ></div>

              {/* 2. KATMAN: Karartma ve Tarama Efekti */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/80"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay"></div>

              {/* 3. KATMAN: Sensör Veri Noktaları (HUD) */}
              
              {/* SENSÖR 1: KUZEY PARSEL (Sağlıklı) */}
              <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2">
                {/* Mavi Isı Yansıması */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/40 rounded-full blur-[40px] pointer-events-none mix-blend-screen animate-pulse"></div>
                
                {/* Hedef İmleci */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="absolute w-12 h-12 border-2 border-blue-400/50 rounded-full animate-[spin_4s_linear_infinite]"></div>
                  <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                </div>

                {/* Veri Etiketi */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 mt-2 bg-[#0F172A]/90 backdrop-blur-md border border-blue-500/50 p-2.5 rounded-xl shadow-xl w-32 flex flex-col items-center">
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-1">NODE-01</span>
                  <div className="flex items-center gap-1.5 text-blue-400 font-black text-sm">
                    <Droplets size={14} /> %78
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Durum: Optimal</span>
                </div>
              </div>

              {/* SENSÖR 2: GÜNEY PARSEL (Kritik) */}
              <div className="absolute bottom-[30%] right-[25%] -translate-x-1/2 -translate-y-1/2">
                {/* Kırmızı Isı Yansıması */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/40 rounded-full blur-[50px] pointer-events-none mix-blend-screen animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                
                {/* Hedef İmleci */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="absolute w-12 h-12 border-2 border-red-500/50 rounded-full animate-[ping_1.5s_ease-in-out_infinite]"></div>
                  <div className="w-4 h-4 bg-red-600 border-2 border-white rounded-full shadow-[0_0_20px_#ef4444]"></div>
                </div>

                {/* Veri Etiketi */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 mt-2 bg-[#0F172A]/90 backdrop-blur-md border border-red-500/80 p-2.5 rounded-xl shadow-xl w-32 flex flex-col items-center">
                  <span className="text-[10px] text-red-300 font-bold uppercase tracking-widest mb-1">NODE-02</span>
                  <div className="flex items-center gap-1.5 text-red-500 font-black text-sm animate-pulse">
                    <AlertTriangle size={14} /> %18
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">Durum: KRİTİK</span>
                </div>
              </div>

              {/* HARİTA KONTROLLERİ */}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-1.5 flex flex-col gap-1.5 z-20 shadow-lg">
                <button onClick={() => setMapLayer('satellite')} className={`p-2 rounded-lg transition-all ${mapLayer === 'satellite' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`} title="Uydu Katmanı">
                  <Map size={18} />
                </button>
                <button onClick={() => setMapLayer('infrared')} className={`p-2 rounded-lg transition-all ${mapLayer === 'infrared' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`} title="Kızılötesi Radar">
                  <Crosshair size={18} />
                </button>
              </div>
            </div>

            {/* OTONOM KARAR MOTORU KARTI */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 shrink-0">
                  <Activity size={24} className="text-red-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white mb-1 tracking-wide">Radar Analiz Sonucu</h3>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                    Radar haritasında <strong className="text-white">kırmızı</strong> ile işaretlenen NODE-02 bölgesinde şiddetli su stresi tespit edildi. Hedeflenen bölgedeki damlama sulama vanalarının <span className="text-emerald-400 font-bold">otonom olarak açılması</span> planlanıyor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* TELEMETRİ LİSTESİ */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 bg-[#1E293B]/50">
                <h2 className="text-sm font-black text-white">ESP-32 Ağ Düğümleri</h2>
                <p className="text-[11px] text-slate-400">Gateway bağlantılı aktif sensörler</p>
              </div>
              <div className="divide-y divide-slate-800/80">
                
                {/* CİHAZ 1 */}
                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Cpu size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">NODE-01 (Kuzey)</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Wifi size={10} className="text-blue-400"/> -45 dBm (Güçlü Sinyal)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/20 uppercase">Çevrimiçi</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Pil: %94</p>
                  </div>
                </div>

                {/* CİHAZ 2 */}
                <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                      <Cpu size={20} className="text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">NODE-02 (Güney)</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Wifi size={10} className="text-red-400"/> -78 dBm (Zayıf Sinyal)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/20 uppercase">Çevrimiçi</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Pil: %42</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}