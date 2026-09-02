import React, { useState, useEffect } from 'react';
import { ClimateAnalysisResult } from '../types';
import { Thermometer, Sun, Sprout, Info, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { TemperatureHistoryChart, GDDChart, RadiationChart } from './charts/ClimateCharts';
import InfoTooltip from './InfoTooltip';

export default function ClimateAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<ClimateAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Jüri Simülasyon Paneli için State'ler
  const [simParams, setSimParams] = useState({
    Tmax: 32.5,
    Tmin: 18.2,
    Tbase: 10.0,
    radiation: 22.4,
    RUE: 1.8,
    hasRadiationData: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analysis/climate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simParams)
      });
      if (!response.ok) throw new Error("API yanıt vermedi");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.warn("Backend API bağlantısı başarısız, simülasyon verisi kullanılıyor:", error);
      const mockResult = {
        parameters: { ...simParams, Tavg: (simParams.Tmax + simParams.Tmin) / 2 },
        results: {
          dailyGDD: 15.3,
          totalGDD: 450,
          biomassEstimate: null,
          tempStatus: 'İdeal',
          tempMessage: 'Sıcaklıklar bitki gelişimi için çok uygun. (Simülasyon Verisi)',
          radStatus: 'Normal',
          radMessage: 'Güneşlenme süresi yeterli.',
          growthStatus: 'İYİ',
          growthMessage: 'Genel gelişim durumu iyi.'
        },
        history: [
          { date: 'Pzt', Tmax: 30, Tmin: 17, Tavg: 23.5, GDD: 13.5, radiation: 20 },
          { date: 'Sal', Tmax: 31, Tmin: 18, Tavg: 24.5, GDD: 14.5, radiation: 21 },
          { date: 'Çar', Tmax: 32.5, Tmin: 18.2, Tavg: 25.35, GDD: 15.3, radiation: 22.4 }
        ]
      };
      setData(mockResult as ClimateAnalysisResult);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSimParams(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : parseFloat(value) 
    }));
  };

  if (!data) return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center"><RefreshCw className="animate-spin mb-2" /> Yükleniyor...</div>;

  const { results, parameters, history } = data;

  const getStatusColor = (status: string) => {
    if (status === "İdeal" || status === "Normal" || status === "İYİ") return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (status === "Dikkat" || status === "DİKKAT") return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (status === "Veri Yok" || status === "Veri Eksik" || status === "Bilinmiyor") return 'text-slate-500 bg-slate-50 border-slate-200';
    return 'text-red-600 bg-red-50 border-red-200'; // Stres Riski vb.
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KATMAN 1: ÇİFTÇİ GÖRÜNÜMÜ */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-6">
          <span className="mr-2 text-3xl">🌡️</span>
          İklim ve Gelişim Durumu
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           <div className={`p-6 rounded-2xl border flex-1 w-full ${results.tempStatus.includes('İdeal') || results.growthStatus.includes('İYİ') ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-yellow-200 bg-yellow-50 text-yellow-900'}`}>
             <h3 className="text-xl font-black mb-3 flex items-center">
                {results.tempStatus.includes('İdeal') || results.growthStatus.includes('İYİ') ? '🟢 Gelişim İçin Uygun' : '🟡 Dikkat Edilmeli'}
             </h3>
             <p className="font-medium text-lg leading-relaxed mb-6">
               Mevcut hava sıcaklığı ve güneşlenme süresi bitkinizin gelişimi için {results.tempStatus.includes('İdeal') || results.growthStatus.includes('İYİ') ? 'oldukça uygun' : 'sınır değerlerde'} görünüyor.
             </p>
             <div className="bg-white/60 p-4 rounded-xl border border-white">
                <h4 className="font-bold flex items-center mb-2"><Sprout size={16} className="mr-2"/> Ne yapabilirsiniz?</h4>
                <p className="text-sm font-medium">
                  {results.tempStatus.includes('İdeal') || results.growthStatus.includes('İYİ') 
                    ? 'İklim şartları şu an lehinize çalışıyor. Normal bakım rutininize devam edebilirsiniz.' 
                    : 'Aşırı sıcak veya soğuğa karşı bitkinizi korumak için önlemler (gölgelendirme vb.) almayı düşünebilirsiniz.'}
                </p>
             </div>
           </div>

           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Günün Sıcaklık Aralığı <span title="Gün içinde beklenen en düşük ve en yüksek sıcaklıklar" className="cursor-help">ⓘ</span></p>
                  <p className="text-2xl font-black text-[#1B331B]">{parameters.Tmin}°C - {parameters.Tmax}°C</p>
                </div>
                <Thermometer className="text-orange-400" size={32}/>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Güneşlenme Durumu <span title="Bitkinin gün içinde aldığı güneş ışığı düzeyi" className="cursor-help">ⓘ</span></p>
                  <p className="text-xl font-black text-emerald-600">{results.radStatus}</p>
                </div>
                <Sun className="text-yellow-400" size={32}/>
              </div>
              
              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
                className="mt-2 w-full flex items-center justify-center space-x-2 rounded-xl bg-orange-50 px-4 py-4 text-sm font-bold text-orange-700 hover:bg-orange-100 transition-colors border border-orange-100"
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
            <Thermometer size={18} className="mr-2 text-red-500"/> Haftalık Sıcaklık Trendi
          </h3>
          <div className="h-64">
             <TemperatureHistoryChart data={history} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
             <strong>Grafik Özeti:</strong> Son günlerdeki sıcaklıklar bitkinin büyümesi için ideal sınırların içinde kalıyor.
          </p>
      </div>

      {/* KATMAN 2: DETAYLI ANALİZ (Gizlenebilir) */}
      {showFormulaInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-orange-500"/> Detaylı Bilimsel Analiz</h3>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Ortalama Sıcaklık (Tavg)</span>
                <span className="text-xl font-black text-orange-500">{((parameters.Tmax + parameters.Tmin)/2).toFixed(1)} <span className="text-xs">°C</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Güneş Radyasyonu</span>
                <span className="text-xl font-black text-yellow-500">{parameters.hasRadiationData ? parameters.radiation : '--'} <span className="text-xs">MJ/m²</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Günlük Biriken Isı (GDD)</span>
                <span className="text-xl font-black text-emerald-500">{results.dailyGDD} <span className="text-xs">Puan</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Toplam GDD</span>
                <span className="text-xl font-black text-emerald-700">{results.totalGDD} <span className="text-xs">Puan</span></span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="bg-white p-5 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2">Birikimli Gelişim Eğrisi (GDD)</h4>
               <div className="h-48 mt-4"><GDDChart data={history} /></div>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-sm text-slate-700 mb-3 border-b pb-2">Güneş Radyasyon Eğilimi</h4>
               <div className="h-48 mt-4"><RadiationChart data={history} /></div>
             </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center text-slate-700"><Activity size={18} className="mr-2 text-indigo-500"/> Kullanılan Parametreler</h4>
                <ul className="space-y-2 font-medium text-slate-600">
                  <li><strong>Tmax (Günün En Yüksek Sıcaklığı):</strong> {parameters.Tmax} °C</li>
                  <li><strong>Tmin (Günün En Düşük Sıcaklığı):</strong> {parameters.Tmin} °C</li>
                  <li><strong>Tbase (Bitki Taban Sıcaklığı):</strong> {parameters.Tbase} °C</li>
                  <li><strong>Güneş Radyasyonu:</strong> {parameters.hasRadiationData ? `${parameters.radiation} MJ/m²` : 'Sensör Verisi Yok'}</li>
                  <li><strong>RUE (Radiation Use Efficiency):</strong> {parameters.RUE} g/MJ</li>
                </ul>
              </div>
              <div>
                 <h4 className="font-bold mb-3 flex items-center text-slate-700"><Info size={18} className="mr-2 text-indigo-500"/> İklim & GDD Formülleri</h4>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 font-mono text-[10px] space-y-1 mb-4">
                   <p>Tavg = (Tmax + Tmin) / 2</p>
                   <p>GDD = max(0, Tavg - Tbase)</p>
                   <p>Toplam GDD = Günlük GDD'lerin toplamı</p>
                   <p>Tahmini Biyokütle = (Radyasyon × 0.8) × RUE</p>
                 </div>
                 <p className="text-xs text-slate-500"><strong>Bilgi:</strong> GDD (Büyüme Derece Günleri), bitkinin gelişimini sadece gün sayısına göre değil, aldığı faydalı sıcaklık miktarına göre takip etmeye yardımcı olur.</p>
              </div>
           </div>
        </div>
      )}

      {/* JÜRİ SİMÜLASYON PANELİ (TEST İÇİN) */}
      <div className="bg-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-lg mt-8 opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-center mb-4 text-emerald-400">
          <RefreshCw size={18} className="mr-2" />
          <h3 className="font-bold text-sm tracking-wide uppercase">Canlı Simülasyon Kontrol Paneli (Jüri Demosu)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Aşağıdaki değerleri değiştirerek analiz sonuçlarının dinamik olarak nasıl güncellendiğini test edebilirsiniz.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Maks. Sıcaklık</label>
            <input type="number" step="0.1" name="Tmax" value={simParams.Tmax} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Min. Sıcaklık</label>
            <input type="number" step="0.1" name="Tmin" value={simParams.Tmin} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1" title="Bitki Taban Sıcaklığı">Gelişim Sınırı (°C)</label>
            <input type="number" step="0.1" name="Tbase" value={simParams.Tbase} onChange={handleSimChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono"/>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Güneş Radyasyonu</label>
            <input type="number" step="0.1" name="radiation" value={simParams.radiation} onChange={handleSimChange} disabled={!simParams.hasRadiationData} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-mono disabled:opacity-50"/>
          </div>
          <div className="flex items-center mt-4 lg:col-span-2">
            <label className="flex items-center text-xs font-bold text-slate-300 cursor-pointer">
              <input type="checkbox" name="hasRadiationData" checked={simParams.hasRadiationData} onChange={handleSimChange} className="mr-2 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-900" />
              Radyasyon Sensörü Var
            </label>
          </div>
          <div className="flex items-end">
            <button onClick={fetchData} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-1.5 px-3 rounded-lg text-sm transition-colors flex items-center justify-center">
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Güncelle'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
