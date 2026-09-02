import React, { useState, useEffect } from 'react';
import { SoilECData, SoilSalinityAnalysis } from '../types';
import { Leaf, Info, RefreshCw, Activity, AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Database, ChevronDown, Sprout, TrendingUp, Thermometer, FlaskConical, Droplets, Droplet, LineChart as LineChartIcon, BookOpen, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const cropTolerances: Record<string, { a: number, b: number }> = {
  'Buğday': { a: 6.0, b: 7.1 },
  'Mısır': { a: 1.7, b: 12.0 },
  'Domates': { a: 2.5, b: 9.9 },
  'Biber': { a: 1.5, b: 14.0 },
  'Pamuk': { a: 7.7, b: 5.2 },
  'Ayçiçeği': { a: 4.8, b: 5.0 },
  'Üzüm': { a: 1.5, b: 9.6 },
  'Zeytin': { a: 2.7, b: 12.0 }, // Genel bir tahmin, literatüre göre değişebilir
};

export default function EcAnalysisPanel({ fieldName }: { fieldName: string }) {
  const [data, setData] = useState<{ ec: SoilECData, analysis: SoilSalinityAnalysis } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/soil/ec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldName })
      });
      if (!response.ok) throw new Error("API yanıt vermedi");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.warn("Backend API bağlantısı başarısız, simülasyon verisi kullanılıyor:", error);
      // Demo veri
      const mockEC: SoilECData = {
        value: 2.35,
        unit: "dS/m",
        source: "demo",
        temperature: 24.6,
        moisture: 31,
        temperatureCompensation: "applied",
        calibrationStatus: "calibrated",
        timestamp: new Date().toISOString()
      };
      
      const mockAnalysis: SoilSalinityAnalysis = {
        eca: 2.35,
        ece: 2.80, // Demo model applied
        eceSource: "calibrated_model",
        salinityClass: "Hafif tuzluluk",
      };

      setTimeout(() => {
        setData({ ec: mockEC, analysis: mockAnalysis });
        
        // Mock Time Series
        const now = new Date();
        const history = Array.from({length: 7}).map((_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
            value: 2.1 + Math.random() * 0.5
          };
        });
        setHistoryData(history);
        
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

  const { ec, analysis } = data;
  const isMock = ec.source === "demo";
  
  const calculateMaasHoffman = (cropName: string) => {
    if (!analysis.ece || analysis.eceSource === 'unavailable') return null;
    const tolerance = cropTolerances[cropName];
    if (!tolerance) return null;
    
    const { a, b } = tolerance;
    if (analysis.ece <= a) return "100"; // No yield loss
    
    const relativeYield = 100 - b * (analysis.ece - a);
    return Math.max(0, relativeYield).toFixed(1);
  };

  const getSalinityClassColor = (className?: string) => {
    if (!className) return 'text-slate-500 bg-slate-50';
    if (className.includes('Düşük') || className.includes('tuzsuz')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (className.includes('Hafif')) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    if (className.includes('Orta')) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const relativeYield = selectedCrop ? calculateMaasHoffman(selectedCrop) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1B331B] flex items-center">
            <span className="mr-2 text-3xl">🧂</span>
            Toprak Tuzluluğu (EC) Analizi
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Toprağınızdaki tuzluluk durumunu takip edin.
          </p>
          {isMock && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded shadow-sm">Demo Verisi</span>
          )}
        </div>
      </div>

      {/* KATMAN 1: ÇİFTÇİ GÖRÜNÜMÜ */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-6">
          <span className="mr-2 text-3xl">🌍</span>
          Toprak Tuzluluk Durumu
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           <div className={`p-6 rounded-2xl border flex-1 w-full ${analysis.salinityClass?.includes('Orta') || analysis.salinityClass?.includes('Yüksek') ? 'border-orange-200 bg-orange-50 text-orange-900' : analysis.salinityClass?.includes('Hafif') ? 'border-yellow-200 bg-yellow-50 text-yellow-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
             <h3 className="text-xl font-black mb-3 flex items-center">
                {analysis.salinityClass?.includes('Orta') || analysis.salinityClass?.includes('Yüksek') ? '🔴 Riskli Seviye' : analysis.salinityClass?.includes('Hafif') ? '🟡 Dikkat Edilmeli' : '🟢 Normal Seviye'}
             </h3>
             <p className="font-medium text-lg leading-relaxed mb-6">
               Mevcut tuzluluk değeriniz {analysis.ece} dS/m ({analysis.salinityClass || 'Bilinmiyor'}).
             </p>
             <div className="bg-white/60 p-4 rounded-xl border border-white">
                <h4 className="font-bold flex items-center mb-2"><Sprout size={16} className="mr-2"/> Ne yapabilirsiniz?</h4>
                <p className="text-sm font-medium">
                  {analysis.salinityClass?.includes('Orta') || analysis.salinityClass?.includes('Yüksek')
                    ? 'Toprak tuzluluğu verimi düşürecek seviyede. Uygun drenaj ve yıkama (leaching) işlemleri ile tuzluluğu azaltmanız önerilir.'
                    : analysis.salinityClass?.includes('Hafif')
                    ? 'Tuzluluk birikimi başlamış olabilir. Sulama suyu kalitenizi kontrol edin ve tuzluluğa hassas bitkilerde dikkatli olun.'
                    : 'Tuzluluk seviyesi ideal durumda. Rutin sulama ve bakım işlemlerinize devam edebilirsiniz.'}
                </p>
             </div>
           </div>

           <div className="flex-1 w-full flex flex-col gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                 <div>
                   <p className="text-sm font-bold text-slate-500 uppercase">Tahmini Tuzluluk (ECe)</p>
                   <p className="text-xs font-medium text-slate-400 mt-1">Laboratuvar referanslı değer</p>
                 </div>
                 <div className="text-right">
                   <p className="text-4xl font-black text-indigo-600">{analysis.ece ?? '--'}</p>
                   <p className="text-sm font-bold text-slate-500">dS/m</p>
                 </div>
              </div>
              
              {/* ÜRÜN SEÇİMİ (Basit) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                 <div className="flex flex-col sm:flex-row items-center gap-3">
                   <div className="w-full sm:flex-1">
                     <label className="block text-xs font-bold text-slate-500 mb-1">Ürününüz İçin Verim Kaybı Riski</label>
                     <select 
                       value={selectedCrop}
                       onChange={(e) => setSelectedCrop(e.target.value)}
                       className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-3 rounded-lg focus:outline-none focus:border-indigo-400"
                     >
                       <option value="">Ürün Seçin...</option>
                       {Object.keys(cropTolerances).map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   {selectedCrop && analysis.ece !== null && (
                     <div className={`w-full sm:flex-1 p-3 bg-white rounded-lg border text-sm font-bold flex items-center justify-center text-center h-full ${relativeYield && parseFloat(relativeYield) >= 100 ? 'border-emerald-200 text-emerald-700' : 'border-orange-200 text-orange-700'}`}>
                       {relativeYield && parseFloat(relativeYield) >= 100 ? 'Risk Yok' : `Verim Riski Var`}
                     </div>
                   )}
                 </div>
              </div>

              <button 
                onClick={() => setShowFormulaInfo(!showFormulaInfo)} 
                className="mt-1 w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
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
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-indigo-500"/> Detaylı Bilimsel Analiz</h3>
           
           {/* EC KARTLARI */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-1">Toprak EC (ECa)</h3>
               <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wide">Sensör Elektriksel İletkenliği</p>
               <div className="flex items-baseline mb-4">
                 <span className="text-4xl font-black text-indigo-600 tracking-tighter">{ec.value !== null ? ec.value : '--'}</span>
                 <span className="text-sm font-bold text-slate-400 ml-1">dS/m</span>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <strong>ECa:</strong> Sensörün doğrudan ölçtüğü elektriksel iletkenliktir. Topraktaki çözünmüş iyonların elektrik akımını iletme düzeyini gösterir.
               </p>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-1">Toprak Tuzluluğu (ECe)</h3>
               <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wide">Doygun Toprak Çamuru Ekstraktı</p>
               <div className="flex items-baseline mb-4">
                 <span className="text-4xl font-black text-slate-700 tracking-tighter">{analysis.ece !== null ? analysis.ece : '--'}</span>
                 <span className="text-sm font-bold text-slate-400 ml-1">dS/m</span>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <strong>ECe:</strong> ECa değerinden kalibrasyon modelleriyle türetilir veya laboratuvarda ölçülür. Tarımsal tuzluluk referansı olarak kullanılır.
               </p>
             </div>
           </div>

           {/* MAAS-HOFFMAN MODELİ */}
           {selectedCrop && cropTolerances[selectedCrop] && analysis.ece !== null && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
               <h3 className="font-black text-lg text-[#1B331B] mb-4">Ürüne Özel Maas-Hoffman Verim Modeli</h3>
               <div className="flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full text-sm">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Seçilen Ürün ({selectedCrop}) Tolerans Eşikleri</h4>
                   <div className="flex justify-between font-bold text-slate-700 mb-2">
                     <span>Eşik Değeri (a):</span>
                     <span>{cropTolerances[selectedCrop].a} dS/m</span>
                   </div>
                   <div className="flex justify-between font-bold text-slate-700">
                     <span>Verim Kaybı Hızı (b):</span>
                     <span>%{cropTolerances[selectedCrop].b} / dS/m artış</span>
                   </div>
                 </div>
                 
                 <div className={`flex-1 p-6 border rounded-xl text-center w-full ${relativeYield && parseFloat(relativeYield) >= 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                    <h4 className="font-bold text-slate-700 mb-2">Tahmini Nispi Verim</h4>
                    <div className={`text-4xl font-black mb-2 ${relativeYield && parseFloat(relativeYield) >= 100 ? 'text-emerald-600' : 'text-orange-600'}`}>
                      %{relativeYield}
                    </div>
                    <p className="text-xs font-bold text-slate-600">
                      {relativeYield && parseFloat(relativeYield) >= 100 
                        ? 'Tuzluluğa bağlı verim kaybı beklenmiyor.' 
                        : `Mevcut ECe (${analysis.ece} dS/m), ürün eşiğini aştığı için verim kaybı öngörülüyor.`}
                    </p>
                 </div>
               </div>
             </div>
           )}

           {/* VERİ AKIŞI & BİLGİ */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <h4 className="font-bold mb-4 flex items-center text-slate-700"><Cpu size={18} className="mr-2 text-indigo-500"/> ESP32 Veri Akışı ve Analiz Adımları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <strong className="block text-indigo-600 mb-1">Adım 1: Sensör (ECa)</strong>
                   Sensörden {ec.value} dS/m okundu.
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <strong className="block text-indigo-600 mb-1">Adım 2: Kompanzasyon</strong>
                   {ec.temperatureCompensation === 'applied' ? `Sıcaklığa (${ec.temperature}°C) göre düzeltildi.` : 'Kompanzasyon uygulanmadı.'}
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <strong className="block text-indigo-600 mb-1">Adım 3: ECe Dönüşümü</strong>
                   {analysis.eceSource === 'calibrated_model' ? `ECe (${analysis.ece} dS/m) tahmini yapıldı.` : analysis.eceSource === 'laboratory' ? 'Laboratuvar sonucu kullanıldı.' : 'Tahmin yapılamadı.'}
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <strong className="block text-indigo-600 mb-1">Adım 4: Tolerans</strong>
                   Ürüne özel verim modeli uygulandı.
                 </div>
              </div>
           </div>

           {/* ALT PANEL: SENSÖR BİLGİLERİ VE GRAFİK */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* ZAMAN SERİSİ GRAFİĞİ */}
             <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-4 flex items-center">
                 <LineChartIcon className="mr-2 text-indigo-500"/> EC Değişim Trendi
               </h3>
               {historyData.length > 0 ? (
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} domain={['auto', 'auto']} />
                       <RechartsTooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                         labelStyle={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}
                       />
                       <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="ECa (dS/m)" />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               ) : (
                 <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-sm font-medium text-slate-500">Henüz yeterli geçmiş ölçüm bulunmuyor.</p>
                 </div>
               )}
             </div>

             {/* SENSÖR VE KALİBRASYON DURUMU */}
             <div className="space-y-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-[#1B331B] mb-4 flex items-center text-sm">
                   <Database size={16} className="mr-2 text-indigo-500"/> Ölçüm Detayları
                 </h3>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                     <span className="text-xs font-bold text-slate-500 flex items-center"><Thermometer size={14} className="mr-1"/> Sıcaklık (T)</span>
                     <span className="text-sm font-bold text-slate-700">{ec.temperature ? `${ec.temperature} °C` : '--'}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                     <span className="text-xs font-bold text-slate-500 flex items-center"><Droplets size={14} className="mr-1"/> Toprak Nemi</span>
                     <span className="text-sm font-bold text-slate-700">{ec.moisture ? `%${ec.moisture}` : '--'}</span>
                   </div>
                   <div className="flex justify-between items-center pt-1">
                     <span className="text-xs font-bold text-slate-500">Kompanzasyon</span>
                     <span className="text-xs font-bold text-slate-700">
                       {ec.temperatureCompensation === 'applied' || ec.temperatureCompensation === 'sensor_applied' ? 'Uygulandı' : 'Uygulanmadı'}
                     </span>
                   </div>
                 </div>
               </div>

               <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 text-white">
                  <h3 className="font-bold mb-4 flex items-center text-sm text-slate-200">
                   <Activity size={16} className="mr-2 text-indigo-400"/> Sensör Kalibrasyonu
                 </h3>
                 <div className="mb-3">
                   {ec.calibrationStatus === 'calibrated' ? (
                     <span className="flex items-center text-emerald-400 font-bold text-xs bg-emerald-400/10 px-2 py-1 rounded w-max">
                       <CheckCircle2 size={14} className="mr-1"/> Kalibre edildi
                     </span>
                   ) : ec.calibrationStatus === 'needs_calibration' ? (
                     <span className="flex items-center text-yellow-400 font-bold text-xs bg-yellow-400/10 px-2 py-1 rounded w-max">
                       <AlertTriangle size={14} className="mr-1"/> Kalibrasyon gerekli
                     </span>
                   ) : (
                     <span className="text-slate-400 text-xs font-medium">Kalibrasyon bilgisi bulunmuyor.</span>
                   )}
                 </div>
                 <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-3">
                   Güvenilir ölçüm için sensörün belirli aralıklarla standart çözeltiler ile kalibre edilmesi önerilir.
                 </p>
               </div>
             </div>
           </div>

        </div>
      )}

    </div>
  );
}
