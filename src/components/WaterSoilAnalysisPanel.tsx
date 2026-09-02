import React, { useState, useEffect } from 'react';
import { WaterAnalysisResult } from '../types';
import { Droplets, ThermometerSun, AlertTriangle, Info, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { SoilMoistureChart, WaterBalanceChart, WaterStressChart, PrecipitationIrrigationChart } from './charts/WaterCharts';
import InfoTooltip from './InfoTooltip';

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

  const fetchData = async () => {
    setLoading(true);
    try {
      // Backend API'ye istek
      const response = await fetch('http://localhost:3001/api/analysis/water-soil', {
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
  }, []);

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
      
      {/* BAŞLIK VE HESAPLAMA BUTONU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B331B] flex items-center">
            <Droplets className="mr-2 text-blue-500" />
            Tarla Su ve Kuraklık Analizi
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{fieldName} alanı için toprağın su durumu ve bitki stresi.</p>
        </div>
        <button 
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center space-x-1.5 rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <Info size={16} className="text-blue-500"/>
          <span>Bilimsel Detayları Göster</span>
        </button>
      </div>

      {/* NASIL HESAPLANDI BİLGİ KUTUSU */}
      {showFormulaInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-blue-900 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-3 flex items-center"><Activity size={18} className="mr-2"/> Kullanılan Parametreler</h4>
            <ul className="space-y-2 font-medium">
              <li><strong>θFC (Tarla Kapasitesi):</strong> {parameters.thetaFC} (Volumetrik)</li>
              <li><strong>θWP (Solma Noktası):</strong> {parameters.thetaWP} (Volumetrik)</li>
              <li><strong>θ (Mevcut Nem):</strong> {parameters.currentTheta} (Volumetrik)</li>
              <li><strong>Zr (Kök Derinliği):</strong> {parameters.Zr} m</li>
              <li><strong>Kc (Bitki Katsayısı):</strong> {parameters.Kc}</li>
              <li><strong>ETo (Ref. Evapotranspirasyon):</strong> {parameters.ETo} mm/gün</li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold mb-3 flex items-center"><BarChart2 size={18} className="mr-2"/> FAO-56 Formülleri</h4>
             <ul className="space-y-2 font-mono text-xs bg-white/50 p-4 rounded-xl border border-blue-100">
               <li>Dr = 1000 × (θFC - θ) × Zr</li>
               <li>TAW = 1000 × (θFC - θWP) × Zr</li>
               <li>RAW = p × TAW</li>
               <li>Ks = (TAW - Dr) / (TAW - RAW)</li>
               <li>ETc = Ks × Kc × ETo</li>
             </ul>
          </div>
        </div>
      )}

      {/* JÜRİ SİMÜLASYON PANELİ (TEST İÇİN) */}
      <div className="bg-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-lg">
        <div className="flex items-center mb-4 text-emerald-400">
          <RefreshCw size={18} className="mr-2" />
          <h3 className="font-bold text-sm tracking-wide uppercase">Canlı Simülasyon Kontrol Paneli (Jüri Demosu)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Mevcut Nem (θ)">Anlık Toprak Nemi (%)</label>
            <input type="number" step="0.01" name="currentTheta" value={simParams.currentTheta} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Kök Derinliği (Zr)">Bitki Kök Derinliği (m)</label>
            <input type="number" step="0.1" name="Zr" value={simParams.Zr} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Tarla Kapasitesi (θFC)">Doygunluk Sınırı (%)</label>
            <input type="number" step="0.01" name="thetaFC" value={simParams.thetaFC} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Solma Noktası (θWP)">Kuruma Sınırı (%)</label>
            <input type="number" step="0.01" name="thetaWP" value={simParams.thetaWP} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Bitki Çarpanı (Kc)">Bitki Katsayısı</label>
            <input type="number" step="0.1" name="Kc" value={simParams.Kc} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Ref. Buharlaşma (ETo)">Günlük Su Kaybı</label>
            <input type="number" step="0.1" name="ETo" value={simParams.ETo} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div className="flex items-end">
            <button onClick={fetchData} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-1.5 px-3 rounded-lg text-sm transition-colors flex items-center justify-center">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Analiz Et'}
            </button>
          </div>
        </div>
      </div>

      {/* AI ÖZET METNİ */}
      <div className={`p-5 rounded-2xl border-l-4 ${results.Ks < 0.5 ? 'border-l-red-500 bg-red-50 text-red-900' : 'border-l-emerald-500 bg-emerald-50 text-emerald-900'}`}>
        <p className="font-semibold flex items-start">
          <span className="bg-white p-1 rounded-md shadow-sm mr-3 mt-0.5">🤖</span>
          {aiSummary}
        </p>
      </div>

      {/* ÖZET KARTLARI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center">
            Toprak Nemi
            <InfoTooltip content="Toprağın içinde bitkinin kullanabileceği su miktarını gösterir. Çok düşük olması susuz kalmaya, çok yüksek olması köklerin havasız kalmasına neden olabilir." />
          </span>
          <span className="text-2xl font-black text-[#1B331B]">{(parameters.currentTheta * 100).toFixed(1)}%</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center">
            Eksik Su Miktarı
            <InfoTooltip content="Kök bölgesinde ne kadar su eksildiğini gösterir. Bu değer yükseldikçe bitkinin su ihtiyacı artar." />
          </span>
          <span className="text-2xl font-black text-red-500">{results.Dr} <span className="text-sm font-bold">mm</span></span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center">
            Su Tutma Kapasitesi
            <InfoTooltip content="Toprakta bulunan ve bitkinin kullanabileceği toplam su miktarını (TAW) gösterir. Toprak yapısı ve kök derinliğine göre değişir." />
          </span>
          <span className="text-2xl font-black text-blue-500">{results.TAW} <span className="text-sm font-bold">mm</span></span>
        </div>
        <div className={`p-4 rounded-2xl shadow-sm border flex flex-col justify-center items-center text-center ${getStatusColor(results.Ks)}`}>
          <span className="text-xs font-bold uppercase mb-1 opacity-80 flex items-center justify-center">
            Bitki Stres Durumu
            <InfoTooltip content="Topraktaki suyun bitkiyi ne kadar etkilediğini gösterir. İdeale (1'e) yaklaştıkça bitki rahattır, düştükçe su stresi çeker." />
          </span>
          <span className="text-xl font-black leading-tight mt-1">{results.stressStatus.split(' ')[0]}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center">
            Günlük Tüketim
            <InfoTooltip content="Bitkinin hava koşullarına (ETo) ve gelişim dönemine bağlı olarak tahmini günlük su tüketimini (ETc) gösterir." />
          </span>
          <span className="text-2xl font-black text-emerald-600">{results.ETc} <span className="text-xs font-bold">mm</span></span>
        </div>
        <div className="bg-slate-800 text-white p-4 rounded-2xl shadow-sm border border-slate-700 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center">
            Sulama Durumu
            <InfoTooltip content={`Sonuç: ${results.irrigationStatus}. Toprak nemi ve su tüketimine göre hesaplanan güncel sulama tavsiyesidir.`} />
          </span>
          <span className="text-lg font-black">{results.irrigationStatus}</span>
        </div>
      </div>

      {/* GRAFİKLER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <Droplets size={18} className="mr-2 text-blue-500"/> Haftalık Toprak Nemi
            <InfoTooltip content="Toprak neminin zaman içinde nasıl değiştiğini gösterir. Düşüşler toprağın kuruduğunu, yükselişler ise su miktarının arttığını ifade eder." />
          </h3>
          <div className="h-6 mb-2"></div>
          <SoilMoistureChart data={history} />
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <Activity size={18} className="mr-2 text-red-500"/> Su İhtiyacı & Kapasite
            <InfoTooltip content="Bitkinin kök bölgesinde ne kadar kullanılabilir su kaldığını gösterir. Su seviyesi kritik bölgeye yaklaşırsa sulama ihtiyacı doğar." />
          </h3>
          <div className="h-6 mb-2"></div>
          <WaterBalanceChart data={history} />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <AlertTriangle size={18} className="mr-2 text-orange-500"/> Bitki Stres Endeksi
            <InfoTooltip content="Bitkinin geçmişte su sıkıntısı yaşadığı dönemleri görmenizi sağlar. Düşük değerler bitkinin su açısından zorlandığını gösterir." />
          </h3>
          <div className="h-6 mb-2"></div>
          <WaterStressChart data={history} />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <ThermometerSun size={18} className="mr-2 text-yellow-500"/> Günlük Tüketim & Sulama
            <InfoTooltip content="ETo: Hava koşullarına göre su kaybı tahminidir. Günlük yağış ve sulama ile bitki tüketiminin karşılaştırmasını içerir." />
          </h3>
          <div className="h-6 mb-2"></div>
          <PrecipitationIrrigationChart data={history} />
        </div>
      </div>

    </div>
  );
}
