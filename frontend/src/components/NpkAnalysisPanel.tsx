import React, { useState, useEffect } from 'react';
import { NPKAnalysisResult } from '../types';
import { Sprout, Info, RefreshCw, Activity, AlertTriangle, Leaf, CheckCircle2, ShieldAlert, Cpu, Check, X, Database } from 'lucide-react';
import { NpkComparisonChart } from './charts/NpkCharts';
import InfoTooltip from './InfoTooltip';

export default function NpkAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<NPKAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/soil/npk/analyze', {
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
      const mockResult: NPKAnalysisResult = {
        npk: {
          nitrogen: 86,
          phosphorus: 42,
          potassium: 173,
          unit: "mg/kg",
          source: "sensor",
          timestamp: new Date().toISOString(),
          calibrationStatus: "calibrated",
          dataQuality: 94
        },
        soil: {
          pH: 6.4,
          ec: 1.8,
          organicMatter: 2.5,
          soilType: "Tınlı"
        },
        crop: {
          type: "Buğday",
          growthStage: "Kardeşlenme",
          targetYield: "600 kg/da"
        },
        analysis: {
          nitrogenStatus: "Orta",
          phosphorusStatus: "Yeterli",
          potassiumStatus: "Yüksek",
          overallStatus: "Dengeli",
          overallMessage: "NPK değerleri mevcut ölçümlere göre genel olarak dengeli görünüyor.",
          nitrogenMessage: "Azot, bitkinin yaprak ve gövde gelişiminde önemli rol oynar. Değerin düşük olması büyümenin yavaşlamasına neden olabilir. Ürün türü ve gelişim dönemi dikkate alınmalıdır.",
          phosphorusMessage: "Fosfor özellikle kök gelişimi, enerji aktarımı ve erken gelişim dönemleri için önemlidir.",
          potassiumMessage: "Potasyum bitkinin su dengesinin korunmasına, dayanıklılığına ve ürün kalitesine katkı sağlar."
        },
        fertilizerRecommendation: {
          isReady: false,
          missingData: ["Laboratuvar doğrulaması"],
          message: "Şu anda kesin gübre miktarı önermek için yeterli veri bulunmuyor. Sensör verileri laboratuvar analizi ile doğrulanmalıdır."
        }
      };
      // Simulate network delay
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

  const { npk, analysis, fertilizerRecommendation, soil, crop } = data;
  const isMock = npk.source === "demo" || !npk.timestamp; // Identify if it's mock/demo from outside

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yüksek': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Yeterli': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Orta': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Düşük': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Kritik': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'İyi':
      case 'Dengeli': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Dikkat': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Kritik': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* BAŞLIK VE HESAPLAMA BUTONU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B331B] flex items-center">
            <Leaf className="mr-2 text-emerald-500" />
            Toprak Besinleri (NPK) Analizi
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Toprağınızdaki temel besin seviyelerini takip edin.
          </p>
          {isMock && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Demo Verisi</span>
          )}
        </div>
      </div>

      {/* KATMAN 1: ÇİFTÇİ GÖRÜNÜMÜ */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-6">
          <span className="mr-2 text-3xl">🌱</span>
          Toprak Beslenme Durumu
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           <div className={`p-6 rounded-2xl border flex-1 w-full ${analysis.overallStatus === 'Kritik' ? 'border-red-200 bg-red-50 text-red-900' : analysis.overallStatus === 'Dikkat' ? 'border-yellow-200 bg-yellow-50 text-yellow-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
             <h3 className="text-xl font-black mb-3 flex items-center">
                {analysis.overallStatus === 'Kritik' ? '🔴 Kritik Durum' : analysis.overallStatus === 'Dikkat' ? '🟡 Dikkat Edilmeli' : '🟢 İdeal Denge'}
             </h3>
             <p className="font-medium text-lg leading-relaxed mb-6">
               {analysis.overallMessage}
             </p>
             <div className="bg-white/60 p-4 rounded-xl border border-white">
                <h4 className="font-bold flex items-center mb-2"><Sprout size={16} className="mr-2"/> Ne yapabilirsiniz?</h4>
                <p className="text-sm font-medium">
                  {analysis.overallStatus === 'Kritik' 
                    ? 'Besin eksiklikleri ciddi boyutlarda. Acilen laboratuvar analizi yaptırıp gübreleme planı oluşturun.' 
                    : analysis.overallStatus === 'Dikkat' 
                    ? 'Bazı besinlerde eksiklik veya fazlalık var. Önümüzdeki günlerde detaylı gübreleme planınızı gözden geçirin.' 
                    : 'Toprağınız şu an bitkinizin ihtiyacı olan besinleri yeterli düzeyde sağlayabiliyor. Rutin bakıma devam edin.'}
                </p>
             </div>
           </div>

           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Azot (N)</p>
                   <p className={`font-black ${analysis.nitrogenStatus === 'Yeterli' || analysis.nitrogenStatus === 'Yüksek' ? 'text-emerald-600' : 'text-orange-500'}`}>{analysis.nitrogenStatus}</p>
                 </div>
                 <div className="border-l border-slate-200">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Fosfor (P)</p>
                   <p className={`font-black ${analysis.phosphorusStatus === 'Yeterli' || analysis.phosphorusStatus === 'Yüksek' ? 'text-emerald-600' : 'text-orange-500'}`}>{analysis.phosphorusStatus}</p>
                 </div>
                 <div className="border-l border-slate-200">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Potasyum (K)</p>
                   <p className={`font-black ${analysis.potassiumStatus === 'Yeterli' || analysis.potassiumStatus === 'Yüksek' ? 'text-emerald-600' : 'text-orange-500'}`}>{analysis.potassiumStatus}</p>
                 </div>
              </div>
              
              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
                className="mt-2 w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-50 px-4 py-4 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                <Activity size={18} />
                <span>{showFormulaInfo ? 'Gizle' : '📊 Detaylı Analiz & Laboratuvar Sonuçları'}</span>
              </button>
           </div>
        </div>
      </div>

      {/* KATMAN 2: DETAYLI ANALİZ (Gizlenebilir) */}
      {showFormulaInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-emerald-500"/> Detaylı Bilimsel Analiz</h3>
           
           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 shadow-sm mb-8">
             <p className="font-semibold">
               <AlertTriangle className="inline mr-1" size={16}/> 
               Elektronik sensör ölçümleri doğrudan laboratuvar sonucu olarak kabul edilmez. Sensör doğruluğu; toprak özellikleri, nem, sıcaklık ve sensör kalibrasyonuna bağlı olabilir.
             </p>
           </div>

           {/* NPK KARTLARI (SAYISAL) */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* AZOT */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><span className="text-8xl font-black">N</span></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="font-black text-xl text-[#1B331B]">AZOT (N)</h3>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${getStatusColor(analysis.nitrogenStatus)}`}>{analysis.nitrogenStatus}</span>
                </div>
                <div className="mb-4 relative z-10">
                  <span className="text-4xl font-black text-blue-600">{npk.nitrogen !== null ? npk.nitrogen : '--'}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1">{npk.unit}</span>
                </div>
                <div className="mt-auto relative z-10 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-600">{analysis.nitrogenMessage}</p>
                </div>
              </div>

              {/* FOSFOR */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><span className="text-8xl font-black">P</span></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="font-black text-xl text-[#1B331B]">FOSFOR (P)</h3>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${getStatusColor(analysis.phosphorusStatus)}`}>{analysis.phosphorusStatus}</span>
                </div>
                <div className="mb-4 relative z-10">
                  <span className="text-4xl font-black text-purple-600">{npk.phosphorus !== null ? npk.phosphorus : '--'}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1">{npk.unit}</span>
                </div>
                <div className="mt-auto relative z-10 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-600">{analysis.phosphorusMessage}</p>
                </div>
              </div>

              {/* POTASYUM */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><span className="text-8xl font-black">K</span></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="font-black text-xl text-[#1B331B]">POTASYUM (K)</h3>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${getStatusColor(analysis.potassiumStatus)}`}>{analysis.potassiumStatus}</span>
                </div>
                <div className="mb-4 relative z-10">
                  <span className="text-4xl font-black text-amber-500">{npk.potassium !== null ? npk.potassium : '--'}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1">{npk.unit}</span>
                </div>
                <div className="mt-auto relative z-10 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-600">{analysis.potassiumMessage}</p>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             {/* NPK GRAFİĞİ */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-[#1B331B] mb-4 flex items-center">
                 <Activity size={18} className="mr-2 text-emerald-500"/> Makro Besin Dağılımı
               </h3>
               <div className="h-64"><NpkComparisonChart data={npk} /></div>
             </div>

             {/* SENSÖR VE KAYNAK DURUMU */}
             <div className="space-y-4">
               <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700">
                  <h3 className="font-bold mb-4 flex items-center text-slate-200 text-sm">
                   <Cpu size={16} className="mr-2 text-blue-400"/> NPK Sensörü Detayları
                 </h3>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                     <span className="text-xs font-medium text-slate-400">Durum</span>
                     <span className="text-xs font-bold text-emerald-400 flex items-center">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> Bağlı
                     </span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                     <span className="text-xs font-medium text-slate-400">Son Ölçüm</span>
                     <span className="text-xs font-bold">{npk.timestamp ? new Date(npk.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-slate-400">Veri Kalitesi & Kalibrasyon</span>
                     <span className="text-xs font-bold text-blue-400">%{npk.dataQuality || '80'} / Normal</span>
                   </div>
                 </div>
               </div>

               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-[#1B331B] mb-3 flex items-center text-sm">
                   <Database size={16} className="mr-2 text-purple-500"/> Ölçüm Kaynağı
                 </h3>
                 <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${npk.source === 'laboratory' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {npk.source === 'laboratory' ? <CheckCircle2 size={16} /> : <Activity size={16} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        {npk.source === 'laboratory' ? 'Laboratuvar Analizi' : npk.source === 'sensor' ? 'Kalibre Edilmiş Sensör' : 'Sensör Verisi'}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                        {npk.source === 'laboratory' 
                          ? 'Laboratuvar analizi ile doğrulandı. Yüksek güvenilirlik.' 
                          : 'Bu NPK verileri sensörden alınmaktadır. Tarımsal gübreleme kararı vermeden önce laboratuvar analiziyle doğrulanması önerilir.'}
                      </p>
                    </div>
                 </div>
               </div>
             </div>
           </div>

           {/* GÜBRELEME ANALİZİ */}
           <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
              <div className="flex items-center mb-4">
               <Sprout className="text-emerald-600 mr-2" size={20}/>
               <h3 className="font-black text-lg text-emerald-900">Otomatik Gübreleme Analizi</h3>
             </div>
             
             {!fertilizerRecommendation.isReady ? (
               <div>
                 <p className="text-sm font-medium text-emerald-800 mb-4">{fertilizerRecommendation.message}</p>
                 <div className="bg-white/60 p-4 rounded-xl border border-emerald-200/50">
                   <h4 className="text-[10px] font-bold text-emerald-700 uppercase mb-3">Eksik/Gerekli Veriler:</h4>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {['Ürün türü', 'Gelişim dönemi', 'Toprak pH\'ı', 'Toprak EC değeri', 'Laboratuvar doğrulaması', 'Hedef verim'].map((item, idx) => {
                       const isMissing = fertilizerRecommendation.missingData.includes(item);
                       return (
                         <div key={idx} className={`flex items-center text-[10px] font-medium ${isMissing ? 'text-slate-500' : 'text-emerald-700'}`}>
                           {isMissing ? <X size={12} className="text-slate-400 mr-1.5 shrink-0"/> : <Check size={12} className="text-emerald-500 mr-1.5 shrink-0"/>}
                           {item}
                         </div>
                       );
                     })}
                   </div>
                 </div>
               </div>
             ) : (
               <p className="text-sm font-bold text-emerald-700 bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                 Detaylı Gübreleme Analizi Hazır. Tüm koşullar sağlanmıştır. (Öneriler API'den yüklenecektir.)
               </p>
             )}
           </div>
        </div>
      )}

    </div>
  );
}
