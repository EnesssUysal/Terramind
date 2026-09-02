import React, { useState, useEffect } from 'react';
import { WaterAnalysisResult } from '../types';
import { Droplets, ThermometerSun, AlertTriangle, Info, RefreshCw, BarChart2, Activity, Play } from 'lucide-react';
import { SoilMoistureChart, WaterBalanceChart, WaterStressChart, PrecipitationIrrigationChart } from './charts/WaterCharts';
import InfoTooltip from './InfoTooltip';
import { useSimulationSync } from '../hooks/useSimulationSync';

export default function WaterSoilAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<WaterAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Jüri Simülasyon Paneli için State'ler
  const [simParams, setSimParams] = useState({
    thetaFC: 0.35,
    thetaWP: 0.15,
    currentTheta: 0.28,
    Zr: 0.6,
    p: 0.5,
    Kc: 1.1,
    ETo: 5.2
  });

  const simState = useSimulationSync();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Backend API'ye istek
      const response = await fetch('http://localhost:5000/api/analysis/water-soil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simParams)
      });
      if (!response.ok) throw new Error("API yanıt vermedi");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.warn("Backend API bağlantısı başarısız, simülasyon verisi kullanılıyor:", error);
      // Demo ve frontend-only mod için mock veri
      const mockResult = {
        parameters: { ...simParams },
        results: {
          TAW: 120,
          RAW: 60,
          Dr: 45,
          Ks: 0.85,
          ETc: 5.7,
          stressStatus: 'İyi Durumda',
          irrigationStatus: 'Gerekmiyor'
        },
        aiSummary: 'Bağlantı hatası: Backend sunucusuna ulaşılamadı. Şu an çevrimdışı simülasyon verisi görüntülenmektedir. Sunucuyu başlatmayı unutmayın.',
        history: [
          { date: 'Pzt', Dr: 30, TAW: 120, RAW: 60, Ks: 1.0, ETc: 4.5, P: 0, I: 10, moisture: 0.32 },
          { date: 'Sal', Dr: 35, TAW: 120, RAW: 60, Ks: 0.95, ETc: 5.0, P: 0, I: 0, moisture: 0.30 },
          { date: 'Çar', Dr: 45, TAW: 120, RAW: 60, Ks: 0.85, ETc: 5.7, P: 0, I: 0, moisture: 0.28 }
        ]
      };
      setData(mockResult as WaterAnalysisResult);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simState]);

  const handleSimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSimParams(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  if (!data) return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center"><RefreshCw className="animate-spin mb-2" /> Yükleniyor...</div>;

  const { results, aiSummary, parameters, history } = data;

  const getStatusColor = (ks: number) => {
    if (ks >= 0.8) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (ks >= 0.5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* SENSÖR KOPTU UYARISI */}
      {simState?.sensorStatus?.soilMoisture === 'offline' && (
        <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6 text-red-500 flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)]">
           <div className="flex items-center">
             <AlertTriangle size={32} className="mr-4 animate-pulse" />
             <div>
               <h3 className="font-black text-xl mb-1">SENSÖR BAĞLANTISI KOPTU (OFFLINE)</h3>
               <p className="font-medium text-red-400">Tarladaki toprak nemi sensöründen sinyal alınamıyor. Gösterilen veriler son ölçülen tahminlerdir.</p>
             </div>
           </div>
        </div>
      )}

      {/* KATMAN 1: ÇİFTÇİ GÖRÜNÜMÜ */}
      <div className={`bg-white p-6 rounded-3xl shadow-sm border ${simState?.sensorStatus?.soilMoisture === 'offline' ? 'border-red-200 bg-red-50/50' : 'border-slate-100'} relative overflow-hidden`}>
        <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-6">
          <span className="mr-2 text-3xl">💧</span>
          Tarla Su Durumu
          {(data as any).isSimulated && (
            <span className="ml-4 bg-orange-100 text-orange-700 border border-orange-200 text-[10px] px-3 py-1 rounded-full flex items-center shadow-sm uppercase font-black tracking-widest animate-pulse">
              <Play className="w-3 h-3 mr-1" /> SİMÜLASYON (OVERRIDE)
            </span>
          )}
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           <div className={`p-6 rounded-2xl border flex-1 w-full ${results.Ks < 0.5 ? 'border-red-200 bg-red-50 text-red-900' : results.Ks < 0.8 ? 'border-yellow-200 bg-yellow-50 text-yellow-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
             <h3 className="text-xl font-black mb-3 flex items-center">
                {results.Ks < 0.5 ? '🔴 Kritik Durum' : results.Ks < 0.8 ? '🟡 Dikkat Gerekiyor' : '🟢 İyi Durumda'}
             </h3>
             <p className="font-medium text-lg leading-relaxed mb-6">
               {results.Ks < 0.5 
                  ? 'Toprağınızdaki nem çok düşük seviyede. Bitkiniz şu anda su stresi yaşıyor.' 
                  : results.Ks < 0.8 
                  ? 'Toprak nemi azalmaya başlamış durumda. Yakında sulama gerekebilir.' 
                  : 'Toprağınızın mevcut nemi bitkinizin ihtiyacını karşılamak için yeterli görünüyor.'}
             </p>
             <div className="bg-white/60 p-4 rounded-xl border border-white">
                <h4 className="font-bold flex items-center mb-2"><Droplets size={16} className="mr-2"/> Ne yapabilirsiniz?</h4>
                <p className="text-sm font-medium">
                  {results.Ks < 0.5 
                    ? 'En kısa sürede sulama yapmanız önerilir. Aksi takdirde verim kaybı yaşanabilir.' 
                    : results.Ks < 0.8 
                    ? 'Sulama sisteminizi hazırlayın, hava durumunu kontrol ederek önümüzdeki günlerde sulama planlayın.' 
                    : 'Şimdilik ekstra sulama ihtiyacı görünmüyor. Sonraki sulama için koşulları takip ediyoruz.'}
                </p>
             </div>
           </div>

           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Mevcut Toprak Nemi <span title="Toprağın içerdiği su yüzdesi" className="cursor-help">ⓘ</span></p>
                  <p className="text-3xl font-black text-[#1B331B]">{(parameters.currentTheta * 100).toFixed(1)}%</p>
                </div>
                <Droplets className="text-blue-400" size={32}/>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Günlük Su Tüketimi (ETc) <span title="Bitkinin havaya verdiği ve topraktan buharlaşan tahmini günlük su miktarı" className="cursor-help">ⓘ</span></p>
                  <p className="text-2xl font-black text-emerald-600">{results.ETc} <span className="text-sm">mm/gün</span></p>
                </div>
                <ThermometerSun className="text-orange-400" size={32}/>
              </div>
              
              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
                className="mt-2 w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-50 px-4 py-4 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <BarChart2 size={18} />
                <span>{showFormulaInfo ? 'Gizle' : '📊 Detaylı Analiz & Hesaplamalar'}</span>
              </button>
           </div>
        </div>
      </div>

      {/* BASİT GRAFİK */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-4 flex items-center">
            <BarChart2 size={18} className="mr-2 text-blue-500"/> Haftalık Nem Trendi
          </h3>
          <div className="h-64">
             <SoilMoistureChart data={history} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
             <strong>Grafik Özeti:</strong> {history[history.length-1].moisture < history[0].moisture ? 'Toprak nemi son günlerde düşüş eğiliminde. Eğilim devam ederse sulama gerekebilir.' : 'Nem seviyesi genel olarak dengeli seyrediyor.'}
          </p>
      </div>

      {/* KATMAN 2: DETAYLI ANALİZ (Gizlenebilir) */}
      {showFormulaInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-blue-500"/> Detaylı Bilimsel Analiz</h3>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Eksik Su Miktarı (Dr)</span>
                <span className="text-xl font-black text-red-500">{results.Dr} <span className="text-xs">mm</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Toplam Su Kapasitesi (TAW)</span>
                <span className="text-xl font-black text-blue-500">{results.TAW} <span className="text-xs">mm</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Kullanılabilir Su (RAW)</span>
                <span className="text-xl font-black text-blue-400">{results.RAW} <span className="text-xs">mm</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Bitki Su Stresi Katsayısı (Ks)</span>
                <span className="text-xl font-black text-emerald-600">{results.Ks}</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="bg-white p-5 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2">Su İhtiyacı & Kapasite Modeli</h4>
               <div className="h-48 mt-4"><WaterBalanceChart data={history} /></div>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2">Stres İndeksi Eğrisi</h4>
               <div className="h-48 mt-4"><WaterStressChart data={history} /></div>
             </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center text-slate-700"><Activity size={18} className="mr-2 text-indigo-500"/> Kullanılan Parametreler</h4>
                <ul className="space-y-2 font-medium text-slate-600">
                  <li><strong>θFC (Tarla Kapasitesi):</strong> {parameters.thetaFC} (Hacimsel)</li>
                  <li><strong>θWP (Solma Noktası):</strong> {parameters.thetaWP} (Hacimsel)</li>
                  <li><strong>θ (Mevcut Nem):</strong> {parameters.currentTheta} (Hacimsel)</li>
                  <li><strong>Zr (Kök Derinliği):</strong> {parameters.Zr} m</li>
                  <li><strong>Kc (Bitki Katsayısı):</strong> {parameters.Kc}</li>
                  <li><strong>ETo (Ref. Evapotranspirasyon):</strong> {parameters.ETo} mm/gün</li>
                </ul>
              </div>
              <div>
                 <h4 className="font-bold mb-3 flex items-center text-slate-700"><Info size={18} className="mr-2 text-indigo-500"/> Bilimsel Yöntem ve Kaynaklar</h4>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 font-mono text-[10px] space-y-1 mb-4">
                   <p>Dr = 1000 × (θFC - θ) × Zr</p>
                   <p>TAW = 1000 × (θFC - θWP) × Zr</p>
                   <p>RAW = p × TAW</p>
                   <p>Ks = (TAW - Dr) / (TAW - RAW)</p>
                   <p>ETc = Ks × Kc × ETo</p>
                 </div>
                 <p className="text-xs text-slate-500"><strong>Kaynak:</strong> Allen, R. G., Pereira, L. S., Raes, D., & Smith, M. (1998). Crop evapotranspiration-Guidelines for computing crop water requirements-FAO Irrigation and drainage paper 56. FAO, Rome.</p>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
