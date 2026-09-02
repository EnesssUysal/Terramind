import React, { useState, useEffect } from 'react';
import { Field } from '../types';
import { CloudRain, AlertTriangle, Zap, RotateCcw, Sprout, Bug, ShieldAlert, CircleDollarSign, Fingerprint, MapPin, Droplets } from 'lucide-react';
import { mockWaterSavingEvents } from '../mockData';
import WaterSoilAnalysisPanel from './WaterSoilAnalysisPanel';
import ClimateAnalysisPanel from './ClimateAnalysisPanel';

interface AnalysisTabProps {
  selectedField: Field;
  fields: Field[];
}

type SimStage = 'idle' | 'crisis' | 'warning';

const CRITICAL_MOISTURE = 20;

export default function AnalysisTab({ selectedField, fields }: AnalysisTabProps) {
  const [activeMode, setActiveMode] = useState<'advisor' | 'water' | 'climate'>('climate');
  const [activeFieldId, setActiveFieldId] = useState(selectedField.id);
  const [simStage, setSimStage] = useState<SimStage>('idle');

  useEffect(() => {
    setActiveFieldId(selectedField.id);
    setSimStage('idle');
  }, [selectedField.id]);

  const activeField = fields.find(f => f.id === activeFieldId) || selectedField;
  const isCrisis = simStage === 'crisis' || simStage === 'warning';
  const isWarning = simStage === 'warning';

  const fieldEvents = mockWaterSavingEvents.filter(e => e.field === activeField.name);
  const realSavedLiters = fieldEvents.reduce((sum, e) => sum + e.savedLiters, 0);
  
  const displaySavedLiters = realSavedLiters > 0 ? realSavedLiters : Math.floor(activeField.ndvi * 500);
  const currentMoisture = isCrisis ? CRITICAL_MOISTURE : activeField.sensors?.moisture?.value || 42;

  const COST_PER_LITER_TL = 0.15; 
  const monthlyProjectedSavings = (displaySavedLiters * 15 * COST_PER_LITER_TL).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
  const expectedYieldIncrease = Math.max(0, ((activeField.ndvi - 0.4) * 35)).toFixed(1);

  const runSimulation = () => {
    if (simStage !== 'idle') return;
    setSimStage('crisis');
  };
  const resetSimulation = () => setSimStage('idle');
  const handleManualOverride = () => {
    if (simStage === 'crisis') {
      setSimStage('warning');
    }
  };

  // --- SESLİ ASİSTAN FONKSİYONU ---
  const playSummaryAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Önceki sesi durdur

      // Duruma göre metni dinamik olarak oluştur
      let statusText = 'Tarlada her şey yolunda, ideal koşullar korunuyor.';
      if (isWarning) {
        statusText = 'Mantar ve kök çürümesi riski tespit edildi. Külleme hastalığına karşı koruyucu ilaçlama şiddetle önerilir.';
      } else if (isCrisis) {
        statusText = 'Bölgenizde fırtına bekleniyor. Sulama iptal edilerek otonom tasarruf moduna geçildi.';
      }

      const summaryText = `${activeField.name} için güncel analiz raporu. Toprak nemi yüzde ${currentMoisture} seviyesindedir. ${statusText} Beklenen rekolte artışı yüzde ${expectedYieldIncrease}.`;

      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0; // Okuma hızı
      utterance.pitch = 1.1; // Ses tonu (biraz daha enerjik)

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
    }
  };

  return (
    <div className="flex-1 px-6 pt-6 pb-12 font-sans animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-[#1B331B] tracking-tight">Otonom Danışman</h2>
          <p className="text-sm font-medium text-[#597360] mt-1">Seçili tarla için detaylı AI analizi</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={simStage === 'idle' ? runSimulation : resetSimulation}
            className="flex items-center space-x-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800 transition-colors"
          >
            {simStage === 'idle' ? <Zap className="h-4 w-4 text-emerald-500" /> : <RotateCcw className="h-4 w-4" />}
            <span className="hidden md:inline">{simStage === 'idle' ? 'Krizi Simüle Et' : 'Sıfırla'}</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {fields.map(field => {
          const isActive = activeFieldId === field.id;
          return (
            <button
              key={field.id}
              onClick={() => {
                setActiveFieldId(field.id);
                setSimStage('idle'); 
              }}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#1B331B] text-white shadow-md scale-105'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin size={16} className={`mr-2 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {field.name}
            </button>
          );
        })}
      </div>

      <div className="flex space-x-6 mb-6 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveMode('advisor')}
          className={`pb-3 font-black text-lg transition-colors border-b-4 whitespace-nowrap ${activeMode === 'advisor' ? 'border-emerald-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Otonom Danışman
        </button>
        <button 
          onClick={() => setActiveMode('water')}
          className={`pb-3 font-black text-lg transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'water' ? 'border-blue-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Droplets size={20} className={activeMode === 'water' ? 'text-blue-500' : ''} />
          Su & Nem Analizi
        </button>
        <button 
          onClick={() => setActiveMode('climate')}
          className={`pb-3 font-black text-lg transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'climate' ? 'border-orange-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Sprout size={20} className={activeMode === 'climate' ? 'text-orange-500' : ''} />
          Sıcaklık & Güneş
        </button>
      </div>

      {activeMode === 'advisor' ? (
        <div className="space-y-6">
        
        <div className={`rounded-3xl p-6 shadow-sm border-2 transition-all duration-500 ${isWarning ? 'bg-red-50 border-red-300' : isCrisis ? 'bg-[#0F2A1B] border-emerald-800' : 'bg-white border-slate-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className={`font-black text-xl flex items-center ${isWarning ? 'text-red-700' : isCrisis ? 'text-emerald-400' : 'text-[#1B331B]'}`}>
                {isWarning ? <ShieldAlert className="mr-2" size={24}/> : <Zap className="mr-2" size={24}/>}
                TerraMind DSS (Karar Destek)
              </h3>
              <p className={`text-sm font-medium mt-1 ${isWarning ? 'text-red-600' : isCrisis ? 'text-emerald-500/70' : 'text-slate-500'}`}>
                {isWarning ? 'Tehlikeli Müdahale Tespit Edildi' : 'Otonom Karar Mekanizması Devrede'}
              </p>
            </div>
            {!isWarning && (
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center ${isCrisis ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 animate-ping ${isCrisis ? 'bg-emerald-400' : 'bg-blue-600'}`}></span>
                Sistem Aktif
              </span>
            )}
          </div>

          {!isCrisis && !isWarning && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Sprout size={48} className="mb-4 text-emerald-100" />
              <p className="font-bold text-lg text-slate-600">Her şey yolunda.</p>
              <p className="text-sm">Yapay zeka <strong className="text-slate-500">{activeField.name}</strong> alanını izlemeye devam ediyor. Güncel Nem: %{currentMoisture}</p>
            </div>
          )}

          {isCrisis && !isWarning && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Güncel Tespit</p>
                  <p className="text-white text-xl font-medium leading-relaxed">
                    <strong className="text-emerald-300">{activeField.name}</strong> bölgesinde toprak nemi <span className="text-red-400 font-black">%{currentMoisture}'ye (Kritik Eşik)</span> düştü. Ancak 18 saat sonra bölgenizde şiddetli fırtına kütlesi bekleniyor.
                  </p>
                  <div className="mt-4 bg-emerald-900/50 border border-emerald-700/50 p-4 rounded-2xl flex items-start">
                    <CloudRain className="text-emerald-400 mt-0.5 mr-3 shrink-0" size={20}/>
                    <p className="text-sm font-semibold text-emerald-100">
                      <span className="font-black text-emerald-400">AI Kararı: </span> 
                      Bugünkü sulama programı tamamen iptal edildi. Su pompaları yağış geçene kadar elektronik olarak kilitlendi.
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-950 rounded-2xl border border-emerald-800 p-5 flex flex-col justify-center items-center text-center">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Kazanılan Su</p>
                  <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{displaySavedLiters}<span className="text-xl text-emerald-400 ml-1">Litre</span></span>
                  <p className="text-[11px] text-emerald-500/70 mt-2 font-bold">1 saatte tasarruf edildi</p>
                </div>
              </div>
              
              <button onClick={handleManualOverride} className="w-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white hover:text-red-400 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                <RotateCcw size={16} className="mr-2" />
                Sistemi Ez (Manuel Sulamayı Başlat)
              </button>
            </div>
          )}

          {isWarning && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="bg-red-100 border border-red-300 rounded-2xl p-5 mb-4 flex items-start shadow-inner">
                <AlertTriangle className="text-red-600 mt-0.5 mr-4 shrink-0" size={28}/>
                <div>
                  <h4 className="text-lg font-black text-red-800 mb-1">Mantar ve Kök Çürümesi Riski!</h4>
                  <p className="text-sm font-medium text-red-700 leading-relaxed">
                    Eğer şu an <strong className="font-bold underline">{activeField.name}</strong> için manuel sulama yaparsanız, fırtınayla birleştiğinde Külleme Hastalığı (Powdery Mildew) riski %78'e fırlayacaktır. {displaySavedLiters}L su da israf olacaktır.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={resetSimulation} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  İptal Et (AI Kararına Uy)
                </button>
                <button className="flex-1 bg-red-100 text-red-400 opacity-50 py-3 rounded-xl font-bold text-sm cursor-not-allowed">
                  Yine de Sula (Önerilmez)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center mb-4">
                <CircleDollarSign className="text-blue-600 mr-2" size={22}/>
                <h3 className="font-black text-[#1B331B]">Finansal & Rekolte Etkisi</h3>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-6">
                TerraMind'ın <strong className="text-slate-700">{activeField.name}</strong> üzerindeki otonom kararlarının doğrudan cüzdanınıza yansıması.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Aylık Enerji Tasarrufu</span>
                <span className="text-lg font-black text-blue-600">₺{monthlyProjectedSavings}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Beklenen Hasat Artışı</span>
                <span className="text-lg font-black text-emerald-600">%{expectedYieldIncrease}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center mb-4">
                <Bug className="text-orange-500 mr-2" size={22}/>
                <h3 className="font-black text-[#1B331B]">Zirai Hastalık Radarı</h3>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-4">Toprak nemi (%{currentMoisture}) ve lokal sıcaklık verileri çaprazlanarak hesaplanır.</p>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-orange-800">Külleme (Powdery Mildew)</span>
                <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-lg text-xs font-black">RİSKLİ YÜKSEK</span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-2.5 mb-3 overflow-hidden">
                <div className="bg-orange-500 h-2.5 rounded-full w-[78%]"></div>
              </div>
              <p className="text-xs font-semibold text-orange-700/80 leading-relaxed">
                <strong className="text-orange-900">{activeField.name}</strong> alanındaki yüksek nem ve hava sıcaklığı sebebiyle koruyucu ilaçlama önerilir.
              </p>
            </div>
          </div>

        </div>

        <div className="bg-gradient-to-r from-[#1B331B] to-[#2D5A27] rounded-3xl p-6 shadow-md border border-[#3A7033] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-white/10 p-3 rounded-full mr-4 shrink-0">
              <Fingerprint className="text-emerald-400" size={28} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg mb-1">{activeField.name} Özetini Dinle</h3>
              <p className="text-emerald-100/70 text-sm font-medium">Bütün analizleri tek tuşla, çiftçi dostu sesli asistandan dinleyin.</p>
            </div>
          </div>
          <button 
            onClick={playSummaryAudio}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#0F2A1B] px-6 py-3 rounded-xl font-black text-sm transition-colors shadow-lg active:scale-95"
          >
            ▶ Durumu Dinle (Canlı)
          </button>
        </div>

        </div>
      ) : activeMode === 'water' ? (
        <WaterSoilAnalysisPanel fieldName={activeField.name} />
      ) : (
        <ClimateAnalysisPanel fieldName={activeField.name} />
      )}
    </div>
  );
}