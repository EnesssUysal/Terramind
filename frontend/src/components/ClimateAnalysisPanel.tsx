import React, { useState, useEffect } from 'react';
import { ClimateAnalysisResult } from '../types';
import { Thermometer, Sun, Sprout, Info, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { TemperatureHistoryChart, GDDChart, RadiationChart } from './charts/ClimateCharts';
import InfoTooltip from './InfoTooltip';

export default function ClimateAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<ClimateAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Backend verisi için
  const [fetchParams, setFetchParams] = useState({
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
        body: JSON.stringify(fetchParams)
      });
      if (!response.ok) throw new Error("API yanıt vermedi");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.warn("Backend API bağlantısı başarısız, simülasyon verisi kullanılıyor:", error);
      const mockResult = {
        parameters: { ...fetchParams, Tavg: (fetchParams.Tmax + fetchParams.Tmin) / 2 },
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
  }, [fieldName]);



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
      
      {/* BAŞLIK VE HESAPLAMA BUTONU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B331B] flex items-center">
            <Thermometer className="mr-2 text-orange-500" />
            Sıcaklık & Güneş Analizi
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{fieldName} alanı için GDD (Gelişim Puanı) ve iklim değerlendirmesi.</p>
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
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-sm text-orange-900 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-3 flex items-center"><Activity size={18} className="mr-2"/> Kullanılan Parametreler</h4>
            <ul className="space-y-2 font-medium">
              <li><strong>Tmax (Günün En Yüksek Sıcaklığı):</strong> {parameters.Tmax} °C</li>
              <li><strong>Tmin (Günün En Düşük Sıcaklığı):</strong> {parameters.Tmin} °C</li>
              <li><strong>Tbase (Bitki Taban Sıcaklığı):</strong> {parameters.Tbase} °C</li>
              <li><strong>Güneş Radyasyonu:</strong> {parameters.hasRadiationData ? `${parameters.radiation} MJ/m²` : 'Sensör Verisi Yok'}</li>
              <li><strong>RUE (Radiation Use Efficiency):</strong> {parameters.RUE} g/MJ</li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold mb-3 flex items-center"><BarChart2 size={18} className="mr-2"/> İklim & GDD Formülleri</h4>
             <ul className="space-y-2 font-mono text-xs bg-white/50 p-4 rounded-xl border border-orange-100">
               <li>Tavg = (Tmax + Tmin) / 2</li>
               <li>GDD = max(0, Tavg - Tbase)</li>
               <li>Toplam GDD = Günlük GDD'lerin toplamı</li>
               <li>Tahmini Biyokütle = (Radyasyon × 0.8) × RUE</li>
             </ul>
          </div>
        </div>
      )}



      {/* 3 BÜYÜK DURUM KARTI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sıcaklık Kartı */}
        <div className={`rounded-3xl p-6 shadow-sm border flex flex-col justify-between ${getStatusColor(results.tempStatus)}`}>
          <div>
            <div className="flex items-center mb-4">
              <Thermometer className="mr-2" size={24} />
              <h3 className="font-black text-lg flex items-center">
                Sıcaklık Durumu
                <InfoTooltip content="Ölçülen sıcaklıkların seçilen bitki için gelişim açısından ne kadar uygun olduğunu gösterir." />
              </h3>
            </div>
            <span className="text-3xl font-black block mb-2">{results.tempStatus}</span>
            <p className="text-sm font-medium opacity-90 mb-4">{results.tempMessage}</p>
          </div>
          <div className="bg-white/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-sm font-bold border border-white/20">
            <div>
              <span className="flex items-center justify-center opacity-70 text-[10px] uppercase mb-1">
                Günün En Düşük
                <InfoTooltip content="Gün içinde ölçülen en düşük sıcaklıktır. Özellikle soğuk hassasiyeti olan bitkiler için önemlidir." />
              </span>
              {parameters.Tmin}°C
            </div>
            <div>
              <span className="flex items-center justify-center opacity-70 text-[10px] uppercase mb-1">
                Günün En Yüksek
                <InfoTooltip content="Gün içinde ölçülen en yüksek sıcaklıktır. Çok yüksek sıcaklıklar bazı bitkilerde strese yol açabilir." />
              </span>
              {parameters.Tmax}°C
            </div>
          </div>
        </div>

        {/* Güneş Kartı */}
        <div className={`rounded-3xl p-6 shadow-sm border flex flex-col justify-between ${getStatusColor(results.radStatus)}`}>
          <div>
            <div className="flex items-center mb-4">
              <Sun className="mr-2" size={24} />
              <h3 className="font-black text-lg flex items-center">
                Güneş Enerjisi Durumu
                <InfoTooltip content="Mevcut güneşlenme koşullarının bitkinin gelişimi açısından genel durumunu gösterir." />
              </h3>
            </div>
            <span className="text-3xl font-black block mb-2">{results.radStatus}</span>
            <p className="text-sm font-medium opacity-90 mb-4">{results.radMessage}</p>
          </div>
          <div className="bg-white/40 rounded-xl p-3 flex justify-between items-center text-sm font-bold border border-white/20">
            <span className="flex items-center opacity-80">
              Günlük Radyasyon:
              <InfoTooltip content="Bitkiye ulaşan toplam güneş enerjisini gösterir. Büyüme ve su tüketimi üzerinde doğrudan etkisi vardır." />
            </span>
            <span>{parameters.hasRadiationData ? `${parameters.radiation} MJ/m²` : '---'}</span>
          </div>
        </div>

        {/* Gelişim Kartı */}
        <div className={`rounded-3xl p-6 shadow-sm border flex flex-col justify-between ${getStatusColor(results.growthStatus)}`}>
          <div>
            <div className="flex items-center mb-4">
              <Sprout className="mr-2" size={24} />
              <h3 className="font-black text-lg flex items-center">
                Bitki Gelişim Koşulları
                <InfoTooltip content="Sıcaklık ve güneş ışığı birlikte değerlendirilerek bitkinin mevcut gelişim koşulları hakkında genel bir fikir verir." />
              </h3>
            </div>
            <span className="text-3xl font-black block mb-2">{results.growthStatus}</span>
            <p className="text-sm font-medium opacity-90 mb-4">{results.growthMessage}</p>
          </div>
          <div className="bg-white/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-sm font-bold border border-white/20">
            <div>
              <span className="flex items-center justify-center opacity-70 text-[10px] uppercase mb-1">
                Bugünkü GDD
                <InfoTooltip content="GDD (Biriken Isı): Bitkinin gün içinde aldığı faydalı ısı miktarını (gelişim puanını) ifade eder." />
              </span>
              +{results.dailyGDD} Puan
            </div>
            <div>
              <span className="flex items-center justify-center opacity-70 text-[10px] uppercase mb-1">
                Toplam GDD
                <InfoTooltip content="Sezon başından beri bitkinin biriktirdiği toplam ısı miktarıdır. Gelişim aşamasını tahmin etmek için kullanılır." />
              </span>
              {results.totalGDD} Puan
            </div>
          </div>
        </div>

      </div>

      {/* GRAFİKLER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <Thermometer size={18} className="mr-2 text-red-500"/> Geçmiş Sıcaklık Değişimi
            <InfoTooltip content="Bitkinin gün boyunca karşılaştığı ortalama, minimum ve maksimum sıcaklıkları gösterir." />
          </h3>
          <div className="h-6 mb-2"></div>
          <TemperatureHistoryChart data={history} />
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <Sprout size={18} className="mr-2 text-emerald-500"/> Günlük Gelişim Puanı (GDD)
            <InfoTooltip content="GDD (Büyüme Derece Günleri): Bitkinin gelişimini sadece gün sayısına göre değil, aldığı sıcaklık miktarına göre takip etmeye yardımcı olur." />
          </h3>
          <div className="h-6 mb-2"></div>
          <GDDChart data={history} />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 md:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-[#1B331B] mb-1 flex items-center">
            <Sun size={18} className="mr-2 text-yellow-500"/> Güneş Radyasyon Eğilimi
            <InfoTooltip content="Bitkiye ulaşan güneş enerjisini gösterir. Bitkiler bu enerjiyi fotosentez ve büyüme için kullanır." />
          </h3>
          <div className="h-6 mb-2"></div>
          <RadiationChart data={history} />
        </div>
      </div>

    </div>
  );
}
