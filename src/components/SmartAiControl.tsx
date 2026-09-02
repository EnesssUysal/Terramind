import React, { useState } from 'react';
import { CloudRain, ShieldCheck, AlertOctagon, Bot, Power, TrendingDown, Info } from 'lucide-react';

export default function SmartAiControl() {
  const [isAiActive, setIsAiActive] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0); // 0: AI Kontrolü, 25: Can Suyu, 100: Tam Sulama

  const handleManualOverride = (level: number) => {
    setWaterLevel(level);
    setIsAiActive(false);
    setShowWarningModal(false);
  };

  const restoreAiControl = () => {
    setWaterLevel(0);
    setIsAiActive(true);
  };

  return (
    <div className="relative">
      <div className={`p-6 rounded-3xl border-2 transition-all duration-500 shadow-sm ${
        isAiActive ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-300'
      }`}>

        {/* Üst Başlık ve Durum */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${isAiActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
              <Bot size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">TerraMind DSS</h2>
              <p className="text-sm font-semibold text-slate-500">Karar Destek ve Sulama Motoru</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-black flex items-center shadow-sm ${
            isAiActive ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse'
          }`}>
            {isAiActive ? (
              <><ShieldCheck size={18} className="mr-2" /> OTONOM MOD</>
            ) : (
              <><AlertOctagon size={18} className="mr-2" /> MANUEL MÜDAHALE</>
            )}
          </div>
        </div>

        {/* Ana Rapor Kartı */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 mb-6 shadow-sm">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-50">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Mevcut Toprak Durumu</p>
              <p className="text-slate-800 font-semibold">%20 Nem (Kritik Eşik Uyarıları Aktif)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Meteorolojik Öngörü</p>
              <p className="text-blue-600 font-bold flex items-center justify-end">
                <CloudRain size={16} className="mr-1" /> 18 Saat Sonra Şiddetli Yağış
              </p>
            </div>
          </div>

          {isAiActive ? (
            <div className="flex items-center justify-between">
              <p className="text-emerald-700 font-medium leading-relaxed max-w-[65%]">
                "Hava tahmin modelleri sebebiyle bugünkü sulama programı beklemeye alındı. Doğal sulama bekleniyor."
              </p>
              <div className="text-right">
                <span className="block text-3xl font-black text-emerald-600">420 L</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">KORUNAN SU</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Çiftçi Kararı: <span className="font-bold text-slate-800">% {waterLevel} Kapasite</span> ile manuel sulama başlatıldı.
                </p>
                <p className="text-amber-600 text-sm font-semibold mt-1 flex items-center">
                  <TrendingDown size={14} className="mr-1" /> COP31 Karbon Hedefinden Sapıldı
                </p>
              </div>
              <div className="text-right">
                <span className="block text-3xl font-black text-slate-300">0 L</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">TASARRUF İPTAL</span>
              </div>
            </div>
          )}
        </div>

        {/* Kontrol Butonları */}
        <div className="flex space-x-4">
          {isAiActive ? (
            <button
              onClick={() => setShowWarningModal(true)}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Power size={18} className="mr-2" />
              Sistemi Ez (Manuel Kontrol)
            </button>
          ) : (
            <button
              onClick={restoreAiControl}
              className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
            >
              <Bot size={18} className="mr-2" />
              AI Otonomisine Geri Dön
            </button>
          )}
        </div>
      </div>

      {/* RİSK ANALİZİ VE MÜDAHALE MODALI (DSS) */}
      {showWarningModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-3xl p-4">
          <div className="bg-white rounded-2xl p-6 w-full shadow-2xl border-2 border-amber-500">
            <div className="flex items-center text-amber-600 mb-4">
              <Info size={28} className="mr-3" />
              <h3 className="text-xl font-black">Müdahale Risk Analizi</h3>
            </div>

            <p className="text-slate-600 font-medium mb-6 leading-relaxed">
              Yapay zeka modelleri 18 saat içinde %85 ihtimalle yağmur bekliyor. Eğer şimdi manuel sulama yaparsanız ve yağmur yağarsa:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg font-semibold text-sm">
                <span className="mr-2">🌱</span> Toprağın suya doyması sebebiyle kök çürümesi riski %40 artacak.
              </li>
              <li className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg font-semibold text-sm">
                <span className="mr-2">💧</span> 420 Litre su ve tahmini 125 TL enerji israf edilecek.
              </li>
            </ul>

            <div className="space-y-3">
              <button
                onClick={() => handleManualOverride(25)}
                className="w-full py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold hover:bg-blue-100 transition-colors"
              >
                Sadece %25 Can Suyu Ver (Önerilen)
              </button>
              <button
                onClick={() => handleManualOverride(100)}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Riski Kabul Ediyorum, Tam Kapasite Sula
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black shadow-md hover:bg-emerald-700 transition-colors mt-2"
              >
                İptal Et ve Yapay Zekaya Güven
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}