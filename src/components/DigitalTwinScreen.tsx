import React, { useState } from 'react';
import { Layers, Droplets, Satellite, Activity, Zap, ThermometerSun, Leaf, PlayCircle, AlertTriangle, Battery, Wifi, Terminal, ArrowLeft } from 'lucide-react';

export interface DigitalTwinScreenProps {
  onBack?: () => void;
}

export const DigitalTwinScreen: React.FC<DigitalTwinScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'telemetry'>('3d');
  const [mapLayer, setMapLayer] = useState<'3d' | 'thermal' | 'ndvi'>('thermal');

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* Üst Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-4 rounded-xl border border-slate-800 gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          {/* GERİ BUTONU BURADA */}
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors mr-1 border border-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Layers className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">Donanım & Dijital İkiz</h1>
            <p className="text-xs text-slate-400">Gelişmiş IoT Arazi İzleme Merkezi</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-blue-500/30">
            <Satellite className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Sentinel-2 Uydusu: Senkronize</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs text-emerald-400 font-medium">ESP-NOW Mesh: Kesintisiz</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-1 overflow-hidden shadow-2xl relative">
            
            <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur border border-slate-700 p-1.5 rounded-lg flex space-x-1 shadow-lg">
              <button onClick={() => setMapLayer('3d')} className={`px-3 py-1.5 rounded text-xs font-medium transition ${mapLayer === '3d' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>3D Grid</button>
              <button onClick={() => setMapLayer('thermal')} className={`px-3 py-1.5 rounded text-xs font-medium transition ${mapLayer === 'thermal' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Termal Uydu</button>
              <button onClick={() => setMapLayer('ndvi')} className={`px-3 py-1.5 rounded text-xs font-medium transition ${mapLayer === 'ndvi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>NDVI (Bitki)</button>
            </div>

            <div className="absolute top-4 right-4 z-10 bg-slate-950/80 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg flex flex-col space-y-2 text-xs shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                <span className="text-slate-300 font-medium">İdeal Nem Oranı</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                <span className="text-slate-300 font-medium">Su Stresi / Kritik</span>
              </div>
            </div>

            <div className="h-[420px] w-full bg-slate-950 rounded-xl relative overflow-hidden group">
              <div 
                className={`absolute inset-0 transition-all duration-700 ${mapLayer !== '3d' ? 'opacity-80' : 'opacity-20'}`}
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: mapLayer === 'ndvi' ? 'hue-rotate(90deg) saturate(150%) contrast(110%)' : 'saturate(110%) contrast(110%)'
                }}
              ></div>

              <div className={`absolute inset-0 transition-opacity duration-500 ${mapLayer === '3d' ? 'opacity-60' : 'opacity-10'} bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]`}></div>

              <div className={`absolute left-1/4 top-1/2 w-64 h-48 rounded-full blur-[50px] pointer-events-none transition-all duration-700 ${mapLayer === 'ndvi' ? 'bg-emerald-500/50' : 'bg-blue-600/40'}`}></div>
              <div className={`absolute right-1/4 top-1/2 w-64 h-48 rounded-full blur-[50px] pointer-events-none transition-all duration-700 ${mapLayer === 'ndvi' ? 'bg-red-500/50' : 'bg-red-600/50'}`}></div>

              <div className="absolute left-1/3 top-1/2 flex flex-col items-center">
                <div className="bg-slate-950/90 border border-emerald-500/50 px-2 py-1 rounded text-slate-200 mb-2 shadow-lg backdrop-blur text-center">
                  <p className="text-[10px] font-mono font-bold text-emerald-400">NODE-01</p>
                  <p className="text-[9px]">%68 Nem</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
              </div>

              <div className="absolute right-[30%] top-[45%] flex flex-col items-center">
                <div className="bg-slate-950/90 border border-red-500/50 px-2 py-1 rounded text-slate-200 mb-2 shadow-lg backdrop-blur text-center">
                  <p className="text-[10px] font-mono font-bold text-red-400">NODE-02</p>
                  <p className="text-[9px]">%21 Nem</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden h-[428px] flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white tracking-wide">TerraMind AI Karar Motoru</h3>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-red-500/20 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-400">Kritik Stres Tespiti</p>
                  <p className="text-xs text-slate-400 mt-1">Güney-Doğu parselinde (NODE-02) bitki su stresi ve anormal zemin sıcaklığı (32°C) algılandı. Hücresel bozulma riski: %74.</p>
                </div>
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20 flex items-start space-x-3">
                <Droplets className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400">Otonom Müdahale Önerisi</p>
                  <p className="text-xs text-slate-400 mt-1">Sadece kurak bölgeye 45 dakika (12 Litre/m²) lokal damlama sulama yapılması rekolte kaybını önleyecektir.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 mt-auto">
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-900/50 flex items-center justify-center space-x-2 transition-all active:scale-95">
                <PlayCircle className="w-5 h-5" />
                <span className="text-sm">Otonom Sulamayı Başlat (Bölge 2)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white tracking-wide">Cihaz Sağlığı & Ağ Topolojisi</h3>
            </div>
            <span className="text-xs font-mono bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800">Protokol: ESP-NOW (2.4 GHz)</span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm font-mono font-bold text-slate-200">NODE-01 (Kuzey Parsel)</p>
                  <p className="text-[10px] text-slate-500 font-mono">MAC: C8:F0:9E:XX:XX:X1 | Rol: Slave</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-emerald-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">%92</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400 font-mono">-42 dBm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm font-mono font-bold text-slate-200">NODE-02 (Güney Parsel)</p>
                  <p className="text-[10px] text-slate-500 font-mono">MAC: C8:F0:9E:XX:XX:X2 | Rol: Slave</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-amber-400" />
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[34%] h-full bg-amber-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">%34</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400 font-mono">-78 dBm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-white tracking-wide">Sistem Günlüğü</h3>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-y-auto space-y-3 font-mono text-[10px]">
            <div className="flex space-x-2 text-slate-400">
              <span className="text-blue-400 shrink-0">[10:45:22]</span>
              <span>Uydu verisi güncellendi. (Sentinel-2 L2A)</span>
            </div>
            <div className="flex space-x-2 text-slate-400">
              <span className="text-emerald-400 shrink-0">[10:48:15]</span>
              <span>NODE-01 telemetri paketi alındı. (Başarılı)</span>
            </div>
            <div className="flex space-x-2 text-slate-400">
              <span className="text-amber-400 shrink-0">[11:02:03]</span>
              <span>NODE-02 veri iletim gecikmesi &gt; 2 sn.</span>
            </div>
            <div className="flex space-x-2 text-slate-400">
              <span className="text-red-400 shrink-0">[11:05:40]</span>
              <span>AI_MOTOR: Güney parselde kritik su stresi tespit edildi. (Risk: Yüksek)</span>
            </div>
            <div className="flex space-x-2 text-slate-400">
              <span className="text-purple-400 shrink-0">[11:06:12]</span>
              <span>AI_MOTOR: Lokal sulama senaryosu (45dk) kuyruğa eklendi. Kullanıcı onayı bekleniyor.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};