import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, Zap, RotateCcw, Sprout, Bug, ShieldAlert, CircleDollarSign, Fingerprint, MapPin, Droplets, Scan, Activity, Server, Target, Layers, Wifi, Cpu, BatteryCharging, Power, ThermometerSun, Wind, Beaker, Leaf, ListChecks, HeartPulse, CheckCircle2 } from 'lucide-react';

import { Field } from '../types';
import { mockWaterSavingEvents } from '../mockData';
import WaterSoilAnalysisPanel from './WaterSoilAnalysisPanel';
import ClimateAnalysisPanel from './ClimateAnalysisPanel';
import FactorCard from './FactorCard';
import InfoTooltip from './InfoTooltip';

interface AnalysisTabProps {
  selectedField: Field;
  fields: Field[];
}

type SimStage = 'idle' | 'crisis' | 'warning';

const CRITICAL_MOISTURE = 20;

export default function AnalysisTab({ selectedField, fields }: AnalysisTabProps) {
  const [activeMode, setActiveMode] = useState<'dashboard' | 'spectral' | 'advisor' | 'water' | 'climate'>('dashboard');
  const [activeFieldId, setActiveFieldId] = useState(selectedField?.id || fields[0]?.id);
  const [simStage, setSimStage] = useState<SimStage>('idle');

  // Canlı Topoloji Verileri İçin State'ler
  const [node1Rssi, setNode1Rssi] = useState(-42);
  const [node2Rssi, setNode2Rssi] = useState(-78);
  const [pdr, setPdr] = useState(99.8);
  const [isNode2Sleeping, setIsNode2Sleeping] = useState(false);

  useEffect(() => {
    if (selectedField) {
      setActiveFieldId(selectedField.id);
      setSimStage('idle');
    }
  }, [selectedField]);

  // Mesh Ağı Sinyal ve Uyku Modu Simülasyonu
  useEffect(() => {
    if (activeMode !== 'spectral') return;
    
    // RSSI ve PDR Dalgalanmaları
    const signalInterval = setInterval(() => {
      setNode1Rssi(prev => -40 - Math.floor(Math.random() * 5));
      if (!isNode2Sleeping) {
        setNode2Rssi(prev => -75 - Math.floor(Math.random() * 10));
      }
      setPdr(prev => 99.5 + (Math.random() * 0.4));
    }, 2000);

    // AI Pil Optimizasyonu (Uyku Modu Döngüsü)
    const sleepInterval = setInterval(() => {
      setIsNode2Sleeping(prev => !prev);
    }, 8000); // Demoda hızlı göstermek için 8 saniyede bir uyuyup uyanıyor

    return () => {
      clearInterval(signalInterval);
      clearInterval(sleepInterval);
    };
  }, [activeMode, isNode2Sleeping]);

  const activeField = fields.find(f => f.id === activeFieldId) || selectedField || fields[0];
  const isCrisis = simStage === 'crisis' || simStage === 'warning';
  const isWarning = simStage === 'warning';

  const fieldEvents = mockWaterSavingEvents.filter(e => e.field === activeField.name);
  const realSavedLiters = fieldEvents.reduce((sum, e) => sum + e.savedLiters, 0);
  const displaySavedLiters = realSavedLiters > 0 ? realSavedLiters : Math.floor((activeField.ndvi || 0.6) * 500);
  const currentMoisture = isCrisis ? CRITICAL_MOISTURE : activeField.sensors?.moisture?.value || 42;
  const expectedYieldIncrease = Math.max(0, (((activeField.ndvi || 0.6) - 0.4) * 35)).toFixed(1);
  const monthlyProjectedSavings = (displaySavedLiters * 15 * 0.15).toLocaleString('tr-TR', { maximumFractionDigits: 0 });

  const runSimulation = () => { if (simStage === 'idle') setSimStage('crisis'); };
  const resetSimulation = () => setSimStage('idle');
  const handleManualOverride = () => { if (simStage === 'crisis') setSimStage('warning'); };

  const playSummaryAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      let statusText = 'Tarlada her şey yolunda, ideal koşullar korunuyor.';
      if (isWarning) statusText = 'Mantar ve kök çürümesi riski tespit edildi. Külleme hastalığına karşı koruyucu ilaçlama şiddetle önerilir.';
      else if (isCrisis) statusText = 'Bölgenizde fırtına bekleniyor. Sulama iptal edilerek otonom tasarruf moduna geçildi.';
      const summaryText = `${activeField.name} için güncel analiz raporu. Toprak nemi yüzde ${currentMoisture} seviyesindedir. ${statusText} Beklenen rekolte artışı yüzde ${expectedYieldIncrease}.`;
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
    }
  };

  return (
    <div className="flex-1 px-4 md:px-6 pt-6 pb-24 font-sans animate-in fade-in duration-500 bg-[#F4FAF5]">
      
      {/* ŞOV İÇİN CSS ANİMASYONLARI */}
      <style>{`
        @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); } 70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
        .pulse-box { animation: pulse-red 2s infinite; }
        @keyframes dash { to { stroke-dashoffset: -20; } }
        .data-flow { animation: dash 1s linear infinite; }
        .data-flow-slow { animation: dash 3s linear infinite; }
      `}</style>

      {/* ÜST BAŞLIK */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-[#1B331B] tracking-tight">Akıllı Analiz Merkezi</h2>
          <p className="text-sm font-medium text-[#597360] mt-1">Donanım destekli yapay zeka ve telemetri analizleri</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={simStage === 'idle' ? runSimulation : resetSimulation} className="flex items-center space-x-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-400 shadow-sm border border-slate-100 hover:text-slate-800 transition-colors">
            {simStage === 'idle' ? <Zap className="h-4 w-4 text-emerald-500" /> : <RotateCcw className="h-4 w-4" />}
            <span className="hidden md:inline">{simStage === 'idle' ? 'Krizi Simüle Et' : 'Sıfırla'}</span>
          </button>
        </div>
      </div>

      {/* TARLA SEÇİCİ */}
      <div className="flex space-x-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {fields.map(field => {
          const isActive = activeFieldId === field.id;
          return (
            <button key={field.id} onClick={() => { setActiveFieldId(field.id); setSimStage('idle'); }} className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${isActive ? 'bg-[#1B331B] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
              <MapPin size={16} className={`mr-2 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {field.name}
            </button>
          );
        })}
      </div>

      {/* NAVİGASYON SEKMELERİ */}
      <div className="flex space-x-6 mb-6 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveMode('dashboard')} className={`pb-3 font-black text-[15px] transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'dashboard' ? 'border-purple-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Layers size={20} className={activeMode === 'dashboard' ? 'text-purple-500' : ''} /> Kapsamlı Analiz
        </button>
        <button onClick={() => setActiveMode('spectral')} className={`pb-3 font-black text-[15px] transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'spectral' ? 'border-[#1B331B] text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Scan size={20} className={activeMode === 'spectral' ? 'text-[#1B331B]' : ''} /> Spektral & Derinlik Şovu
        </button>
        <button onClick={() => setActiveMode('advisor')} className={`pb-3 font-black text-[15px] transition-colors border-b-4 whitespace-nowrap ${activeMode === 'advisor' ? 'border-emerald-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          Otonom Danışman
        </button>
        <button onClick={() => setActiveMode('water')} className={`pb-3 font-black text-[15px] transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'water' ? 'border-blue-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Droplets size={20} className={activeMode === 'water' ? 'text-blue-500' : ''} /> Su & Nem Analizi
        </button>
        <button onClick={() => setActiveMode('climate')} className={`pb-3 font-black text-[15px] transition-colors border-b-4 flex items-center gap-2 whitespace-nowrap ${activeMode === 'climate' ? 'border-orange-500 text-[#1B331B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
          <Sprout size={20} className={activeMode === 'climate' ? 'text-orange-500' : ''} /> Sıcaklık & Güneş
        </button>
      </div>

      {/* İÇERİK BÖLGESİ */}
      {activeMode === 'dashboard' ? (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 px-2">Bölümler</h3>
              <a href="#genel-durum" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E8F3EB] text-[#1B331B] font-bold transition-colors"><Sprout size={18}/> Genel Durum</a>
              <a href="#su-sulama" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-blue-800 font-bold transition-colors"><Droplets size={18}/> Su ve Sulama</a>
              <a href="#sicaklik-iklim" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-orange-800 font-bold transition-colors"><ThermometerSun size={18}/> Sıcaklık ve İklim</a>
              <a href="#besin-maddeleri" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-purple-800 font-bold transition-colors"><Beaker size={18}/> Besin Maddeleri</a>
              <a href="#hastalik-zararli" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-800 font-bold transition-colors"><Bug size={18}/> Hastalık & Zararlı</a>
              <a href="#tarimsal-islemler" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-teal-800 font-bold transition-colors"><ListChecks size={18}/> Tarımsal İşlemler</a>
              <a href="#birlesik-risk" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-slate-800 font-bold transition-colors"><ShieldAlert size={18}/> Birleşik Risk</a>
            </div>
          </div>
          <div className="flex-1 space-y-12 pb-12">
            <section id="genel-durum" className="scroll-mt-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#1B331B] mb-2">{activeField.name} — Genel Durum</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center"><Leaf size={14} className="mr-1"/> Mısır (Pioneer)</span>
                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center"><Sprout size={14} className="mr-1"/> Çiçeklenme Dönemi (V12)</span>
                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold flex items-center"><CheckCircle2 size={14} className="mr-1"/> Güncel Sağlık Puanı: 88/100</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 max-w-2xl leading-relaxed">
                      Bitki gelişimi genel olarak sağlıklı ilerliyor. NDVI değeri ({activeField.ndvi}) bölge ortalamasının üzerinde.
                      Ancak yaklaşan sıcak hava dalgası nedeniyle su stresi riski artıyor.
                    </p>
                  </div>
                  <div className="bg-[#1B331B] text-white p-4 rounded-2xl shrink-0 w-full md:w-64">
                     <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Öncelikli Aksiyon</h4>
                     <p className="text-sm font-semibold mb-4">Yarın akşam saatlerinde 25mm koruyucu sulama yapılması önerilir.</p>
                     <button onClick={playSummaryAudio} className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                       <HeartPulse size={14}/> Sesli Raporu Dinle
                     </button>
                  </div>
                </div>
              </div>
            </section>
            
            <section id="su-sulama" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <Droplets className="text-blue-500" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Su ve Sulama Analizi</h3>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <WaterSoilAnalysisPanel fieldName={activeField.name} />
               </div>
            </section>

            <section id="sicaklik-iklim" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <ThermometerSun className="text-orange-500" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Sıcaklık ve İklim Analizi</h3>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <ClimateAnalysisPanel fieldName={activeField.name} />
               </div>
               <div className="mt-6">
                  <FactorCard 
                     title="Buhar Basıncı Açığı (VPD)"
                     currentValue="1.8"
                     unit="kPa"
                     status="Dikkat"
                     referenceRange="0.8 - 1.5 kPa"
                     changeValue="0.4 kPa artış"
                     changeType="up"
                     impactDescription="Hava şu an kuru ve sıcak olduğu için bitkiniz daha fazla su kaybediyor (terliyor). Yüksek VPD, stomaların kapanmasına ve fotosentezin durmasına neden olabilir."
                     suggestion="Planlanan sulamayı akşam serinliğinde veya gece saatlerinde yaparak buharlaşma kaybını azaltın."
                     dataSource="Open-Meteo & Yerel Sensör"
                     lastUpdated="10 dakika önce"
                     detailedAnalysis="VPD, havanın sıcaklığı ve bağıl nemi arasındaki ilişkiyi gösterir. 1.5 kPa üzerindeki değerler mısır gibi bitkilerde fizyolojik strese yol açar."
                     calculationMethod="VPD = e_s(T) - e_a(T, RH) (Tetens formülü ile hesaplanmıştır)"
                     icon={<Wind className="text-blue-500"/>}
                  />
               </div>
            </section>

            <section id="besin-maddeleri" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <Beaker className="text-purple-500" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Toprak Besin Maddeleri (NPK)</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FactorCard 
                    title="Nitrat Azotu (NO3-N)" currentValue="45" unit="ppm" status="İyi" referenceRange="40 - 60 ppm" changeValue="2 ppm düşüş" changeType="down"
                    impactDescription="Azot seviyesi bitkinin mevcut gelişim dönemi için ideal aralıktadır."
                    suggestion="Mevcut gübreleme rejimini koruyun, ek bir müdahaleye gerek yoktur."
                    dataSource="Toprak NPK Sensörü" lastUpdated="1 saat önce" icon={<Beaker className="text-emerald-500"/>}
                 />
                 <FactorCard 
                    title="Alınabilir Fosfor (P2O5)" currentValue="12" unit="ppm" status="Dikkat" referenceRange="15 - 25 ppm" changeValue="1 ppm düşüş" changeType="down"
                    impactDescription="Fosfor seviyesi referansın hemen altındadır. Bu durum kök gelişimini hafif yavaşlatabilir."
                    suggestion="Damla sulama sistemine fosfor içerikli sıvı gübre (örn: MAP) eklenmesi önerilir."
                    dataSource="Laboratuvar & Sensör Tahmini" lastUpdated="Dün 14:30" icon={<Beaker className="text-yellow-500"/>}
                 />
               </div>
            </section>

            <section id="hastalik-zararli" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <Bug className="text-red-500" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Hastalık ve Zararlı Analizi</h3>
               </div>
               <FactorCard 
                  title="Külleme (Powdery Mildew) Riski" currentValue="%78" unit="Risk Skoru" status="Dikkat" referenceRange="<%40" changeValue="%15 artış" changeType="up"
                  impactDescription="Yüksek nem ve sıcaklıklar mantar sporlarının çimlenmesi için çok uygun bir ortam oluşturuyor."
                  suggestion="Önümüzdeki 48 saat içerisinde yaprak hastalıklarına karşı koruyucu fungisit uygulaması yapılması şiddetle tavsiye edilir."
                  dataSource="Yapay Zeka Hastalık Modeli" lastUpdated="30 dakika önce"
                  detailedAnalysis="Model, 'Yaprak Islaklığı Süresi' ve 'VPD' değerlerini kullanarak risk hesaplar."
                  calculationMethod="Risk = f(T_avg, Bağıl_Nem, Yaprak_Islaklık_Süresi)" icon={<Bug className="text-red-500"/>}
               />
            </section>
            
            <section id="tarimsal-islemler" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <ListChecks className="text-teal-600" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Son Tarımsal İşlemler</h3>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Droplets size={20}/></div>
                         <div><h4 className="font-bold text-slate-800">Koruyucu Sulama</h4><p className="text-xs font-medium text-slate-500">25mm su uygulandı</p></div>
                      </div>
                      <div className="text-right"><span className="block text-sm font-black text-slate-700">Dün, 18:30</span><span className="text-[10px] font-bold text-emerald-600">Başarılı</span></div>
                    </div>
                 </div>
               </div>
            </section>

            <section id="birlesik-risk" className="scroll-mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="text-slate-700" size={24}/>
                  <h3 className="text-xl font-black text-slate-800">Birleşik Stres Analizi</h3>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <div className="space-y-4">
                     <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                           <div className="bg-orange-100 p-2 rounded-lg"><ThermometerSun className="text-orange-600"/></div>
                           <span className="font-black text-orange-400 text-lg">+</span>
                           <div className="bg-orange-100 p-2 rounded-lg"><Droplets className="text-orange-600"/></div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                           <h4 className="font-bold text-orange-900">Yüksek Sıcaklık + Düşük Toprak Nemi</h4>
                           <p className="text-xs text-orange-800 mt-1">Bitkinin terleme hızı artarken, topraktan su alamaması hücre ölümlerine yol açar.</p>
                        </div>
                        <div className="text-center md:text-right">
                           <span className="text-[10px] font-bold text-orange-600 uppercase block mb-1">Mevcut Risk</span><span className="text-lg font-black text-orange-700">%45</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
          </div>
        </div>
      ) : activeMode === 'spectral' ? (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. KISIM: BİLGİSAYARLI GÖRME (COMPUTER VISION) KAMERA AKIŞI */}
            <div className="lg:col-span-2 bg-[#0B1121] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden h-[400px]">
              <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1121]/30 to-[#0B1121]/90"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> DRONE CAM</span>
                <span className="bg-[#0F172A]/80 border border-slate-700 text-emerald-400 text-[10px] font-black px-2 py-1 rounded font-mono">VISION_AI: ACTIVE</span>
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-emerald-500/90 text-right bg-black/40 px-2 py-1 rounded border border-emerald-500/20">
                <p>LAT: 37.7543</p>
                <p>LNG: 32.5514</p>
                <p>ALT: 1.8m (HOVER)</p>
              </div>

              <div className="absolute left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_20px_#10b981] animate-scan z-10"></div>

              <div className="absolute top-[30%] left-[20%] w-32 h-40 border-2 border-emerald-500/70 rounded-lg bg-emerald-500/10 flex flex-col justify-end p-1 transition-all">
                <div className="bg-emerald-500/90 text-white text-[9px] font-black px-1 py-0.5 rounded-sm inline-block w-max backdrop-blur-sm">SAĞLIKLI [%98]</div>
              </div>
              <div className="absolute top-[45%] right-[25%] w-28 h-32 border-2 border-red-500 rounded-lg bg-red-500/10 flex flex-col justify-end p-1 pulse-box z-20">
                <div className="bg-red-600 text-white text-[9px] font-black px-1 py-0.5 rounded-sm flex items-center gap-1 backdrop-blur-sm"><Target size={10} /> KÜLLEME RİSKİ [%84]</div>
              </div>
              <div className="absolute bottom-[20%] left-[45%] w-24 h-24 border-2 border-yellow-500/70 rounded-lg bg-yellow-500/10 flex flex-col justify-end p-1">
                <div className="bg-yellow-500/90 text-white text-[9px] font-black px-1 py-0.5 rounded-sm inline-block w-max backdrop-blur-sm">SU STRESİ [%62]</div>
              </div>
            </div>

            {/* 2. KISIM: TOPRAK ALTI DERİNLİK PROFİLİ */}
            <div className="bg-[#0B1121] rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="text-blue-400" size={20} />
                <h3 className="text-white font-black text-sm">3D Toprak Kesiti</h3>
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-slate-700/50 flex flex-col">
                <div className="h-[25%] bg-gradient-to-b from-[#2D5A27] to-[#3E2723] relative border-b border-white/10 p-2 flex justify-between items-start">
                  <span className="text-[10px] font-bold text-emerald-300">Yüzey (0-10cm)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-black/30 px-1.5 py-0.5 rounded">NPK: İDEAL</span>
                </div>
                <div className="h-[45%] bg-gradient-to-b from-[#3E2723] to-[#261612] relative border-b border-white/10 p-2 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-orange-200">Kök Bölgesi (10-40cm)</span>
                  <div className="w-full h-8 bg-black/40 rounded-full mt-2 relative overflow-hidden border border-white/5">
                    <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isCrisis ? 'bg-red-500/80 w-[18%]' : 'bg-blue-500/80 w-[78%]'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white mix-blend-difference">AKTİF KÖK NEMİ: %{currentMoisture}</div>
                  </div>
                </div>
                <div className="h-[30%] bg-[#1A0F0D] relative p-2 flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500">Derin Taban (40-80cm)</span>
                  <span className="text-[10px] font-mono text-blue-500/50">Su Rezervi: Yetersiz</span>
                </div>
                <div className="absolute top-0 right-0 h-full w-6 border-l border-white/10 bg-black/20 flex flex-col justify-between py-2 items-center text-[8px] font-mono text-slate-500">
                  <span>0cm</span><span>-20cm</span><span>-40cm</span><span>-60cm</span><span>-80cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. KISIM: YENİ IOT MESH TOPOLOJİSİ & AI PİL OPTİMİZASYONU */}
          <div className="bg-[#050B14] rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sol: Dinamik Topoloji Haritası */}
              <div className="flex-1 relative h-[300px] border border-slate-800/50 rounded-2xl bg-[#08121F] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
                
                {/* SVG Çizgiler (Veri Akışı) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Gateway - Node 1 Hattı */}
                  <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 6" className="data-flow opacity-70" />
                  {/* Gateway - Node 2 Hattı */}
                  <line x1="50%" y1="50%" x2="80%" y2="75%" stroke={isNode2Sleeping ? "#475569" : "#3b82f6"} strokeWidth="2" strokeDasharray="4 6" className={isNode2Sleeping ? "opacity-30" : "data-flow-slow opacity-70"} />
                </svg>

                {/* DÜĞÜMLER (HTML) */}
                {/* Merkezi Gateway */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Server className="text-emerald-400" size={28} />
                    <div className="absolute -inset-2 border border-emerald-500/30 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <span className="text-xs font-black text-white mt-2 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">MAIN GATEWAY</span>
                </div>

                {/* Node-01 (Kuzey - Sağlıklı Bağlantı) */}
                <div className="absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-800 border border-emerald-500/50 rounded-xl flex items-center justify-center z-10 shadow-lg">
                    <Cpu className="text-emerald-400" size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 mt-2">NODE-01</span>
                  {/* Sinyal Etiketi */}
                  <div className="bg-emerald-950/80 border border-emerald-500/30 px-2 py-1 rounded mt-1 flex flex-col items-center">
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1"><Wifi size={10}/> {node1Rssi} dBm</span>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5">PDR: %{pdr.toFixed(1)}</span>
                  </div>
                </div>

                {/* Node-02 (Güney - Uyku Modunda veya Zayıf Sinyal) */}
                <div className="absolute top-[75%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className={`w-12 h-12 bg-slate-800 border rounded-xl flex items-center justify-center z-10 shadow-lg transition-colors duration-1000 ${isNode2Sleeping ? 'border-slate-600' : 'border-blue-500/50'}`}>
                    <Cpu className={isNode2Sleeping ? "text-slate-500" : "text-blue-400"} size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 mt-2">NODE-02</span>
                  {/* Sinyal Etiketi */}
                  <div className={`px-2 py-1 rounded mt-1 flex flex-col items-center border transition-all duration-1000 ${isNode2Sleeping ? 'bg-slate-900/80 border-slate-700' : 'bg-blue-950/80 border-blue-500/30'}`}>
                    {isNode2Sleeping ? (
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1"><Power size={10}/> DEEP SLEEP</span>
                    ) : (
                      <>
                        <span className="text-[9px] text-blue-400 font-mono flex items-center gap-1"><Wifi size={10}/> {node2Rssi} dBm</span>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5">PDR: %{(pdr - 1.2).toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ: AI Pil & Ağ Yönlendirme Paneli */}
              <div className="lg:w-[350px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                    <Activity className="text-emerald-500" size={20} />
                    <h3 className="text-white font-black text-sm">AI Mesh Optimizasyonu</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Sistem, NODE-02 üzerindeki zayıf sinyal (-78 dBm) nedeniyle yaşanan paket kayıplarını engellemek ve donanım ömrünü uzatmak için <strong>otonom uyku (deep-sleep)</strong> stratejisi uyguluyor.
                  </p>

                  <div className="space-y-3">
                    {/* Pil Durumu */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="text-yellow-500" size={16} />
                        <span className="text-xs font-bold text-slate-300">NODE-02 Pil</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-white">%14</span>
                        <p className="text-[9px] text-yellow-600 font-bold mt-0.5">KRİTİK</p>
                      </div>
                    </div>

                    {/* AI Kararı */}
                    <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 flex justify-between items-center relative overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-500 ${isNode2Sleeping ? 'bg-slate-600' : 'bg-emerald-500'}`}></div>
                      <div className="pl-2">
                        <span className="text-[10px] font-black text-emerald-500/70 uppercase">Aktif Strateji</span>
                        <h4 className="text-xs font-bold text-white mt-1">Uyanış Döngüsü (Wake Interval)</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400 line-through opacity-50 mr-2">15 dk</span>
                        <span className="text-sm font-black text-emerald-400">45 dk</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-[#0B1121] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">NETWORK_UPTIME: 99.9%</span>
                  <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYNC OK
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      ) : activeMode === 'advisor' ? (
        // OTONOM DANIŞMAN (EKSİKSİZ)
        <div className="space-y-6">
          <div className={`rounded-3xl p-6 shadow-sm border-2 transition-all duration-500 ${isWarning ? 'bg-red-50 border-red-300' : isCrisis ? 'bg-[#0F2A1B] border-emerald-800' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className={`font-black text-xl flex items-center ${isWarning ? 'text-red-700' : isCrisis ? 'text-emerald-400' : 'text-[#1B331B]'}`}>
                  {isWarning ? <ShieldAlert className="mr-2" size={24}/> : <Zap className="mr-2" size={24}/>}
                  TerraMind DSS (Karar Destek)
                </h3>
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
                <p className="text-sm">Yapay zeka tarlayı izlemeye devam ediyor. Güncel Nem: %{currentMoisture}</p>
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
                  </div>
                  <div className="bg-emerald-950 rounded-2xl border border-emerald-800 p-5 flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Kazanılan Su</p>
                    <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{displaySavedLiters}<span className="text-xl text-emerald-400 ml-1">Litre</span></span>
                  </div>
                </div>
                <button onClick={handleManualOverride} className="w-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white hover:text-red-400 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                  <RotateCcw size={16} className="mr-2" /> Sistemi Ez (Manuel Sulamayı Başlat)
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
                      Eğer şu an manuel sulama yaparsanız, Külleme Hastalığı riski %78'e fırlayacaktır.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetSimulation} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm transition-colors">İptal Et (AI Kararına Uy)</button>
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
                <p className="text-sm font-medium text-slate-500 mb-6">TerraMind'ın <strong className="text-slate-700">{activeField.name}</strong> üzerindeki otonom kararlarının doğrudan cüzdanınıza yansıması.</p>
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
            <button onClick={playSummaryAudio} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#0F2A1B] px-6 py-3 rounded-xl font-black text-sm transition-colors shadow-lg active:scale-95">
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