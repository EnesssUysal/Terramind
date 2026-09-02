import React, { useState, useEffect } from 'react';
import { PHAnalysisResult } from '../types';
import { Leaf, Info, RefreshCw, Activity, AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Check, X, Database, FlaskConical, ChevronDown, Sprout, Droplets, ThermometerSun } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const crops = ['Buğday', 'Mısır', 'Domates', 'Biber', 'Pamuk', 'Ayçiçeği', 'Üzüm', 'Zeytin', 'Diğer'];

export default function PhAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<PHAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);
  const [showNutrientInfo, setShowNutrientInfo] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/soil/ph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldName })
      });
      if (!response.ok) throw new Error("API yanıt vermedi");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.warn("Backend API bağlantısı başarısız, simülasyon verisi kullanılıyor:", error);
      // Mock data
      const mockResult: PHAnalysisResult = {
        ph: {
          value: 6.4,
          unit: "pH",
          source: "sensor",
          timestamp: new Date().toISOString(),
          calibrationStatus: "needs_calibration"
        },
        soil: {
          nitrogen: 86,
          phosphorus: 42,
          potassium: 173,
          ec: 1.8,
          moisture: 42,
          temperature: 18,
          organicMatter: 2.5,
          soilType: "Tınlı"
        },
        crop: {
          type: "Domates",
          growthStage: "Erken Gelişim"
        },
        analysis: {
          status: "Hafif asidik",
          message: "Mevcut ölçüm, birçok tarla bitkisi için yaygın olarak kullanılan pH aralığına yakın görünüyor. Ancak ideal değer yetiştirilen ürüne ve toprağın özelliklerine göre değişir.",
          cropSpecificMessage: null // will be calculated dynamically based on selectedCrop
        }
      };
      setTimeout(() => {
        setData(mockResult);
        setLoading(false);
      }, 600);
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center"><RefreshCw className="animate-spin mb-2" /> Yükleniyor...</div>;
  }

  const { ph, analysis, soil } = data;
  const isMock = ph.source === "demo" || !ph.timestamp; 
  const phValue = ph.value || 0;
  
  // Normalize pH for the 0-14 scale (0% to 100%)
  const phPercentage = Math.max(0, Math.min(100, (phValue / 14) * 100));

  const getStatusColor = (status: string) => {
    if (status.includes('asidik')) return 'text-orange-600';
    if (status.includes('alkali')) return 'text-blue-600';
    return 'text-emerald-600';
  };

  // Dummy dynamic evaluation logic
  const getCropEvaluation = (crop: string) => {
    if (!crop) return null;
    if (phValue >= 6.0 && phValue <= 7.0) {
      return "Uygun görünüyor.";
    } else if (phValue < 6.0) {
      return "Bu ürün için düşük olabilir.";
    } else {
      return "Bu ürün için yüksek olabilir.";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B331B] flex items-center">
            <FlaskConical className="mr-2 text-blue-500" />
            Toprak pH Analizi
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Toprağın asitlik veya alkalilik seviyesini takip edin.
          </p>
          {isMock && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Demo Verisi</span>
          )}
        </div>
      </div>

      {/* KATMAN 1: ÇİFTÇİ GÖRÜNÜMÜ */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-6">
          <span className="mr-2 text-3xl">⚗️</span>
          Toprak pH Durumu
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           <div className={`p-6 rounded-2xl border flex-1 w-full ${ph.value < 5.5 || ph.value > 8.0 ? 'border-red-200 bg-red-50 text-red-900' : ph.value < 6.0 || ph.value > 7.5 ? 'border-yellow-200 bg-yellow-50 text-yellow-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
             <h3 className="text-xl font-black mb-3 flex items-center">
                {ph.value < 5.5 || ph.value > 8.0 ? '🔴 Kritik Seviye' : ph.value < 6.0 || ph.value > 7.5 ? '🟡 Dikkat Edilmeli' : '🟢 Uygun Aralık'}
             </h3>
             <p className="font-medium text-lg leading-relaxed mb-6">
               Mevcut pH değeriniz {ph.value} ({analysis.status}). {analysis.message}
             </p>
             <div className="bg-white/60 p-4 rounded-xl border border-white">
                <h4 className="font-bold flex items-center mb-2"><Sprout size={16} className="mr-2"/> Ne yapabilirsiniz?</h4>
                <p className="text-sm font-medium">
                  {ph.value < 5.5 
                    ? 'Toprağınız çok asidik. Kireçleme yaparak pH seviyesini yükseltmeniz bitkinin besin alımını kolaylaştıracaktır.' 
                    : ph.value > 8.0 
                    ? 'Toprağınız çok alkali (kireçli). Kükürt veya asidik gübreler kullanarak pH seviyesini düşürmeniz gerekebilir.' 
                    : 'pH seviyeniz birçok ürün için ideal aralıkta. Rutin gübreleme ve bakım işlemlerinize devam edebilirsiniz.'}
                </p>
             </div>
           </div>

           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                   <p className="text-sm font-bold text-slate-500 uppercase">Sensör Ölçümü</p>
                   <p className="text-4xl font-black text-blue-600">{ph.value}</p>
                 </div>
                 {/* pH ÖLÇEĞİ */}
                 <div className="relative pt-2">
                    <div className="relative w-full h-4 bg-gradient-to-r from-red-500 via-emerald-400 to-indigo-600 rounded-full mb-2 shadow-inner">
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-slate-800 rounded-full shadow-md transition-all duration-1000"
                        style={{ left: `calc(${phPercentage}% - 10px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>0 (Asit)</span>
                      <span>7 (Nötr)</span>
                      <span>14 (Alkali)</span>
                    </div>
                 </div>
              </div>
              
              {/* ÜRÜN SEÇİMİ (Basit) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Ürününüz İçin Değerlendirme</label>
                   <select 
                     value={selectedCrop}
                     onChange={(e) => setSelectedCrop(e.target.value)}
                     className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-3 rounded-lg focus:outline-none focus:border-blue-400"
                   >
                     <option value="">Ürün Seçin...</option>
                     {crops.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 {selectedCrop && (
                   <div className="flex-1 p-3 bg-white rounded-lg border border-slate-100 text-xs font-bold text-emerald-700 flex items-center justify-center text-center h-full">
                     {getCropEvaluation(selectedCrop)}
                   </div>
                 )}
              </div>

              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
                className="mt-1 w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <Activity size={18} />
                <span>{showFormulaInfo ? 'Gizle' : '📊 Detaylı Analiz & Sensör Verileri'}</span>
              </button>
           </div>
        </div>
      </div>

      {/* KATMAN 2: DETAYLI ANALİZ (Gizlenebilir) */}
      {showFormulaInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-blue-500"/> Detaylı Bilimsel Analiz</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             {/* pH + NPK İLİŞKİSİ */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-black text-lg text-[#1B331B] mb-3">pH'ın Besin Alımına Etkisi</h3>
                <p className="text-sm font-medium text-slate-600 mb-4">
                  Toprak pH'ı değiştikçe besin elementlerinin bitki tarafından alınabilirliği değişir.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 leading-relaxed">
                  Çok asidik (pH &lt; 5.5) topraklarda kalsiyum, magnezyum ve fosfor alımı zorlaşırken; çok alkali (pH &gt; 8.0) topraklarda demir, mangan ve çinko noksanlığı sık görülür.
                </div>
             </div>

             {/* SENSÖR VE KALİBRASYON */}
             <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700">
                <h3 className="font-bold mb-4 flex items-center text-slate-200">
                 <Activity size={18} className="mr-2 text-blue-400"/> Sensör Kalibrasyonu
               </h3>
               <div className="mb-4">
                 <div className="flex items-center gap-2 mb-2">
                   {ph.calibrationStatus === 'calibrated' ? (
                     <span className="flex items-center text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded">
                       <CheckCircle2 size={16} className="mr-1"/> Kalibre edildi
                     </span>
                   ) : ph.calibrationStatus === 'needs_calibration' ? (
                     <span className="flex items-center text-yellow-400 font-bold text-sm bg-yellow-400/10 px-2 py-1 rounded">
                       <AlertTriangle size={16} className="mr-1"/> Kalibrasyon öneriliyor
                     </span>
                   ) : (
                     <span className="flex items-center text-red-400 font-bold text-sm bg-red-400/10 px-2 py-1 rounded">
                       <ShieldAlert size={16} className="mr-1"/> Kalibrasyon gerekli
                     </span>
                   )}
                 </div>
                 <p className="text-xs font-medium text-slate-400 leading-relaxed">
                   pH sensörünün doğru ölçüm yapabilmesi için tampon çözeltiler (pH 4.00, pH 7.00) ile kalibrasyon yapılmalıdır.
                 </p>
               </div>
               <div className="text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded">
                  <AlertTriangle className="inline text-orange-500 mr-1" size={12}/> 
                  Sensör ölçümleri, nem ve sıcaklığa bağlı olarak değişebilir. Kesin kararlar için laboratuvar analizi önerilir.
               </div>
             </div>
           </div>

           {/* DASHBOARD */}
           <div>
             <h4 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wide">🌍 Toprak Genel Durumu</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">pH</span>
                 <span className="text-xl font-black text-blue-600">{ph.value}</span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">Azot (N)</span>
                 <span className="text-xl font-black text-[#1B331B]">{soil.nitrogen || '--'}<span className="text-xs ml-1">mg</span></span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">Fosfor (P)</span>
                 <span className="text-xl font-black text-[#1B331B]">{soil.phosphorus || '--'}<span className="text-xs ml-1">mg</span></span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">Potasyum (K)</span>
                 <span className="text-xl font-black text-[#1B331B]">{soil.potassium || '--'}<span className="text-xs ml-1">mg</span></span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">EC (Tuz)</span>
                 <span className="text-xl font-black text-orange-500">{soil.ec || '--'}<span className="text-xs ml-1">dS/m</span></span>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                 <span className="block text-xs font-bold text-slate-400 mb-1">Nem</span>
                 <span className="text-xl font-black text-emerald-500">{soil.moisture || '--'}<span className="text-xs ml-1">%</span></span>
               </div>
             </div>
           </div>

        </div>
      )}

    </div>
  );
}
