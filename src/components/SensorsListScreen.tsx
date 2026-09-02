import React, { useState } from 'react';
import { ArrowLeft, Cpu, Wifi, BatteryMedium, BatteryFull, BatteryLow, Radio, Activity, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface SensorsListScreenProps {
  onBack: () => void;
  onOpenDetail?: (page: string) => void;
}

export default function SensorsListScreen({ onBack }: SensorsListScreenProps) {
  const [activeTab, setActiveTab] = useState<'twin' | 'devices'>('twin');

  // Sahadaki ESP32 / Sensör Düğümleri (Mock Data)
  const devices = [
    { id: 'ESP-M1', mac: 'A4:CF:12:8F:B1:01', role: 'Master Gateway', battery: 98, signal: -45, status: 'online', type: 'esp32' },
    { id: 'NODE-01', mac: '8C:AA:B5:71:11:A2', role: 'Toprak Sensörü (Sera-1)', battery: 85, signal: -62, status: 'online', type: 'esp-now' },
    { id: 'NODE-02', mac: '8C:AA:B5:71:18:C4', role: 'Toprak Sensörü (Sera-2)', battery: 42, signal: -78, status: 'online', type: 'esp-now' },
    { id: 'NODE-03', mac: '8C:AA:B5:72:04:E8', role: 'Hava İstasyonu (Açık Alan)', battery: 12, signal: -89, status: 'warning', type: 'esp-now' },
    { id: 'VALVE-1', mac: '3C:71:BF:44:2A:90', role: 'Otonom Su Vanası', battery: 100, signal: -55, status: 'online', type: 'relay' },
  ];

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
      <div className="bg-slate-950/80 px-6 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Donanım & Dijital İkiz</h1>
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
        
        {/* 3D DİJİTAL İKİZ KATMAMNI */}
        {activeTab === 'twin' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl overflow-hidden relative">
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="font-black text-white text-lg">Arazi Topografi & Nem Haritası</h3>
                  <p className="text-xs text-slate-400">Sensör düğümlerinden gelen eşzamanlı ısı/nem yansımaları</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-700"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Islak</span>
                  <span className="flex items-center text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-700"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Kurak</span>
                </div>
              </div>

              {/* CSS İzometrik 3D Grid Simülasyonu */}
              <div className="w-full h-80 flex items-center justify-center relative perspective-[1200px]">
                <div 
                  className="relative w-64 h-64 md:w-80 md:h-80 border-2 border-emerald-500/20 grid grid-cols-4 grid-rows-4 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                  style={{ transform: 'rotateX(60deg) rotateZ(-45deg)', transformStyle: 'preserve-3d' }}
                >
                  {/* Grid Çizgileri */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-emerald-500/10 bg-slate-800/50 backdrop-blur-sm"></div>
                  ))}

                  {/* Sensör Düğümü 1 (Master / Yeşil Alan) */}
                  <div className="absolute top-[10%] left-[20%] w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399] z-20" style={{ transform: 'translateZ(20px)' }}>
                    <div className="absolute -top-16 -left-12 bg-slate-900/90 text-white text-[9px] p-2 rounded-lg border border-emerald-500/50 font-bold whitespace-nowrap shadow-xl" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)' }}>
                      MASTER GATEWAY<br/><span className="text-emerald-400">Nem: %42</span>
                    </div>
                  </div>
                  {/* Heatmap Blob 1 */}
                  <div className="absolute top-[-10%] left-[0%] w-32 h-32 bg-blue-500/30 rounded-full blur-[30px] z-10 pointer-events-none"></div>

                  {/* Sensör Düğümü 2 (Kurak Alan) */}
                  <div className="absolute top-[60%] left-[70%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_#ef4444] z-20 animate-pulse" style={{ transform: 'translateZ(10px)' }}>
                    <div className="absolute -top-16 -left-8 bg-slate-900/90 text-white text-[9px] p-2 rounded-lg border border-red-500/50 font-bold whitespace-nowrap shadow-xl" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)' }}>
                      NODE-02 (Kurak)<br/><span className="text-red-400">Nem: %18</span>
                    </div>
                  </div>
                  {/* Heatmap Blob 2 */}
                  <div className="absolute top-[40%] left-[50%] w-40 h-40 bg-red-500/20 rounded-full blur-[40px] z-10 pointer-events-none"></div>

                </div>
              </div>
            </div>
            
            <div className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700 flex items-start gap-4">
              <Activity className="text-blue-400 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-white mb-1">Katman Analizi</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Güney-Doğu parselindeki NODE-02 sensöründen düşük nem ve yüksek zemin sıcaklığı yansımaları alınıyor. İkiz model üzerinde kırmızı heatmap olarak işaretlenen bu alana otonom sulama yönlendirilebilir.
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
