import React, { useState } from 'react';
import { Play, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

export const DemoMode = ({ triggerScenario, triggerReset }: { triggerScenario: any, triggerReset: any }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, title: 'Tarla Seçildi', desc: 'Sistem başlatıldı, Manisa Tarlası 01 yüklendi.' },
    { id: 2, title: 'Gerçek Hava Durumu', desc: 'Open-Meteo API üzerinden gerçek hava durumu verileri çekildi.' },
    { id: 3, title: 'Toprak Verileri', desc: 'ESP32 sensör ağından güncel toprak nemi (%32) ve sıcaklığı alındı.' },
    { id: 4, title: 'Kuraklık Senaryosu', desc: 'Jüri simülasyonu tetiklendi: Sıcaklık artışı ve nem düşüşü başlatılıyor.' },
    { id: 5, title: 'Toprak Nemi Düştü', desc: 'Kuraklık etkisiyle toprak nemi %14 seviyesine indirildi.' },
    { id: 6, title: 'ET₀ Yeniden Hesaplandı', art: 'ETo = 7.1 mm/gün' },
    { id: 7, title: 'Su Stresi Tespit Edildi', desc: 'Kök bölgesi su dengesi kritik eşiğin altına indi.' },
    { id: 8, title: 'Sulama İhtiyacı Oluştu', desc: 'TerraMind otonom sulama kararı için sinyal üretti.' },
    { id: 9, title: 'TerraMind Önerisi', desc: 'Çiftçiye "Derhal Sulama Yapın" önerisi gösterildi.' },
    { id: 10, title: 'Senkronizasyon', desc: 'Tüm sistemler ana platforma başarıyla senkronize edildi.' }
  ];

  const startStoryboard = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    await triggerReset(); // Start fresh

    const runStep = (index: number) => {
      if (index > steps.length) {
        setIsRunning(false);
        return;
      }
      setCurrentStep(index);
      
      // Trigger actions at specific steps
      if (index === 4) {
        triggerScenario('drought', 'Şiddetli Kuraklık', { temperature: 42, humidity: 15, rainfall: 0 });
      } else if (index === 5) {
        triggerScenario('drought', 'Şiddetli Kuraklık', { temperature: 42, humidity: 15, rainfall: 0, soilMoisture: 14 });
      }

      setTimeout(() => runStep(index + 1), 2500); // 2.5s per step
    };

    runStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-zinc-400 mb-6">
        <Play className="mr-3 text-brand-blue"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Jüri Sunumu (Demo Modu)</h2>
          <p className="text-sm">TerraMind'ın uçtan uca özelliklerini göstermek için otomatik senaryo akışı.</p>
        </div>
      </div>

      <div className="bg-admin-card border border-brand-blue/30 rounded-xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mb-6 text-brand-blue border border-brand-blue/50">
          <Play size={32} className="ml-1"/>
        </div>
        <h3 className="text-3xl font-black text-white mb-4">Otomatik Demo Akışı</h3>
        <p className="text-zinc-400 max-w-xl mx-auto mb-8">
          Bu butona tıkladığınızda TerraMind sistemi arka arkaya 10 adımlık bir hikaye oynatacaktır. Gerçek verilerin yüklenmesinden kuraklık şokuna ve otonom karar mekanizmasına kadar tüm süreçler sırayla çalıştırılıp ana ekrana yansıtılacaktır. Lütfen sunum ekranını (Ana Platform) yan tarafta açık tutun.
        </p>

        <button 
          disabled={isRunning}
          onClick={startStoryboard} 
          className={`px-8 py-4 rounded-full font-black text-lg transition-all shadow-lg flex items-center
            ${isRunning ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-600 hover:scale-105 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}
        >
          {isRunning ? <RefreshCw size={24} className="mr-3 animate-spin"/> : <Play size={24} className="mr-3"/>}
          {isRunning ? 'DEMO ÇALIŞIYOR...' : 'DEMOYU BAŞLAT'}
        </button>
      </div>

      {isRunning && (
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
          <h4 className="font-bold text-zinc-300 mb-6 uppercase text-sm tracking-wider">Canlı İlerleme Durumu</h4>
          <div className="space-y-4">
            {steps.map(step => (
              <div key={step.id} className={`flex items-center transition-all ${currentStep >= step.id ? 'opacity-100' : 'opacity-20'}`}>
                {currentStep > step.id ? (
                  <CheckCircle2 size={24} className="text-emerald-500 mr-4"/>
                ) : currentStep === step.id ? (
                  <RefreshCw size={24} className="text-brand-blue mr-4 animate-spin"/>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-700 mr-4"/>
                )}
                
                <div className={`flex-1 ${currentStep === step.id ? 'bg-brand-blue/10 border-brand-blue/30 border p-3 rounded-lg' : ''}`}>
                  <h5 className={`font-bold ${currentStep === step.id ? 'text-brand-blue' : 'text-zinc-300'}`}>{step.title}</h5>
                  {step.desc && <p className="text-xs text-zinc-500">{step.desc}</p>}
                  {step.art && <p className="text-sm font-mono text-emerald-400 mt-1">{step.art}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
