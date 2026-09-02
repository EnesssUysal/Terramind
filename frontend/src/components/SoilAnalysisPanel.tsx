import React, { useState, useEffect } from 'react';
import { Field, SoilAnalysisResult, CropSuitability } from '../types';
import { Leaf, MapPin, Activity, ChevronDown, CheckCircle, AlertTriangle, AlertCircle, Sprout, TestTube, Microscope } from 'lucide-react';

export default function SoilAnalysisPanel({ field }: { field: Field }) {
  const [data, setData] = useState<SoilAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  useEffect(() => {
    const lat = field.latitude || (field as any).lat;
    const lon = field.longitude || (field as any).lng;
    
    if (!lat || !lon) {
      setError("Bu tarla için koordinat bilgisi bulunmuyor.");
      return;
    }
    setError(null);
    fetchSoilData(lat, lon, field.location);
  }, [field]);

  const fetchSoilData = (lat: number, lon: number, defaultLocationName: string) => {
    setLoading(true);

    // Deterministik mock veri üretici (Koordinata özel sabit değer üretir)
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const pseudoRandom = (min: number, max: number, offset = 0) => {
       const v = Math.abs(Math.sin(seed + offset)) * 10000;
       return min + (v - Math.floor(v)) * (max - min);
    };

    setTimeout(() => {
      // 1. Toprak Tekstürü
      const clay = pseudoRandom(15, 45, 1);
      const sand = pseudoRandom(20, 60, 2);
      const silt = 100 - clay - sand;
      
      let textureClass = "Tınlı";
      let drainage = "İyi";
      let waterHolding = "Orta";
      
      if (clay > 35) {
        textureClass = "Killi Tınlı";
        drainage = "Orta";
        waterHolding = "İyi";
      } else if (sand > 50) {
        textureClass = "Kumlu Tınlı";
        drainage = "Çok İyi";
        waterHolding = "Düşük";
      }

      // 2. Özellikler
      const organicMatter = pseudoRandom(1.2, 4.5, 3);
      const ph = pseudoRandom(5.8, 8.2, 4);
      const cec = pseudoRandom(15, 35, 5);
      const bulkDensity = pseudoRandom(1.1, 1.5, 6);
      const salinity = pseudoRandom(0.5, 3.5, 7);

      // 3. Genel Değerlendirme & Güçlü/Zayıf Yanlar
      let evaluation = "";
      const strengths: { title: string; status: 'good' | 'medium' | 'bad'; text: string }[] = [];
      const limitations: { title: string; status: 'medium' | 'bad'; text: string }[] = [];

      if (clay > 35) {
        strengths.push({ title: "Su Tutma", status: "good", text: "Kil oranının yüksekliği sayesinde toprak suyu iyi tutar." });
        strengths.push({ title: "Besin Tutma", status: "good", text: "Yüksek kil oranı, bitki besin elementlerinin yıkanıp gitmesini önler." });
        limitations.push({ title: "Drenaj / Havalanma", status: "medium", text: "Fazla sulamada drenaj problemi yaşanabilir. Kök boğulmalarına dikkat edilmelidir." });
        evaluation = `Bu lokasyondaki ${textureClass} toprak yapısı su ve besin tutma açısından avantaj sağlayabilir. Ancak ağır yapısı nedeniyle drenaj yönetimi verimlilik açısından özellikle önemli görünüyor.`;
      } else if (sand > 50) {
        strengths.push({ title: "Drenaj", status: "good", text: "Kumlu yapı sayesinde su göllenmesi yaşanmaz, kökler iyi havalanır." });
        limitations.push({ title: "Su Tutma", status: "bad", text: "Suyu hızla sızdırdığı için sık ve az miktarda sulama (damlama) gerektirir." });
        limitations.push({ title: "Besin Tutma", status: "medium", text: "Besin elementleri kolay yıkanabilir, gübreleme parçalı yapılmalıdır." });
        evaluation = `Bu lokasyondaki ${textureClass} toprak yapısı mükemmel kök havalanması sunar ancak su ve besinleri hızlı kaybeder. Sık sulama ve organik madde takviyesi çok önemlidir.`;
      } else {
        strengths.push({ title: "Su ve Besin Dengesi", status: "good", text: "Dengeli tekstür sayesinde hem su tutma hem de havalanma uygundur." });
        strengths.push({ title: "Kök Gelişimi", status: "good", text: "Köklerin rahat gelişebilmesi için uygun bir fiziksel ortam sunar." });
        evaluation = `Bu lokasyondaki dengeli ${textureClass} yapı tarımsal üretim için oldukça ideal bir temel sunmaktadır.`;
      }

      if (organicMatter < 2.0) {
        limitations.push({ title: "Düşük Organik Madde", status: "bad", text: "Organik madde seviyesi düşük. Toprak biyolojisini canlandırmak için kompost veya yeşil gübreleme önerilir." });
      } else if (organicMatter > 3.0) {
        strengths.push({ title: "Organik Madde", status: "good", text: "Yüksek organik madde su tutmayı ve mikrobiyal aktiviteyi destekler." });
      }

      if (ph < 6.0) {
        limitations.push({ title: "Asidik pH", status: "medium", text: "Düşük pH nedeniyle kalsiyum ve magnezyum alımı zorlaşabilir. Kireçleme değerlendirilebilir." });
      } else if (ph > 7.5) {
        limitations.push({ title: "Alkalin pH", status: "medium", text: "Yüksek pH nedeniyle demir, çinko ve fosfor alımında güçlük yaşanabilir." });
      }

      if (salinity > 2.0) {
        limitations.push({ title: "Tuzluluk Riski", status: "bad", text: "Tuzluluk eşik değerin üzerinde. Hassas bitkilerde verim kaybı yaşanabilir, yıkama sulaması gerekebilir." });
      }

      // 4. Ürün Uygunluk Modeli
      const crops = [
        { name: "Buğday", icon: "🌾", reqs: { phMin: 6.0, phMax: 7.5, clayTol: true, sandTol: false, salTol: 3.0 } },
        { name: "Mısır", icon: "🌽", reqs: { phMin: 5.8, phMax: 7.0, clayTol: false, sandTol: false, salTol: 1.7 } },
        { name: "Pamuk", icon: "☁️", reqs: { phMin: 6.5, phMax: 8.0, clayTol: true, sandTol: false, salTol: 7.7 } },
        { name: "Domates", icon: "🍅", reqs: { phMin: 6.0, phMax: 6.8, clayTol: false, sandTol: true, salTol: 2.5 } },
        { name: "Ayçiçeği", icon: "🌻", reqs: { phMin: 6.0, phMax: 7.5, clayTol: true, sandTol: true, salTol: 4.8 } }
      ];

      const cropSuitabilities: CropSuitability[] = crops.map(crop => {
        let score = 1; // 1: Çok Uygun, 2: Uygun, 3: Koşullu, 4: Uygun Değil
        const cStrengths: string[] = [];
        const cLimitations: string[] = [];

        // pH Check
        if (ph >= crop.reqs.phMin && ph <= crop.reqs.phMax) {
          cStrengths.push("pH seviyesi bu ürün için ideal aralıkta.");
        } else {
          score = Math.max(score, ph > crop.reqs.phMax + 0.5 || ph < crop.reqs.phMin - 0.5 ? 4 : 3);
          cLimitations.push(`pH seviyesi (${ph.toFixed(1)}) ideal aralığın dışında.`);
        }

        // Salinity Check
        if (salinity <= crop.reqs.salTol) {
          cStrengths.push("Tuzluluk seviyesi ürünün tolerans limitleri içerisinde.");
        } else {
          score = Math.max(score, 4);
          cLimitations.push(`Tuzluluk (${salinity.toFixed(1)} dS/m) tolerans değerinin (${crop.reqs.salTol}) üzerinde.`);
        }

        // Texture Check
        if (clay > 40 && !crop.reqs.clayTol) {
          score = Math.max(score, 3);
          cLimitations.push("Ağır killi yapı kök gelişimini ve drenajı kısıtlayabilir.");
        }
        if (sand > 60 && !crop.reqs.sandTol) {
          score = Math.max(score, 3);
          cLimitations.push("Aşırı kumlu yapı yeterli su ve besin tutmayabilir.");
        }
        
        if (cStrengths.length === 0 && score < 4) cStrengths.push("Genel toprak koşulları elverişli.");

        let label = "Çok Uygun";
        let reasoning = "Bölgenin toprak parametreleri bu ürün için genel olarak oldukça elverişli görünüyor.";
        if (score === 2) { label = "Uygun"; reasoning = "Toprak yapısı uygun; verimli bir yetiştiricilik yapılabilir."; }
        else if (score === 3) { label = "Koşullu Uygun"; reasoning = "Bazı toprak parametreleri verimi sınırlayabilir, özel gübreleme/sulama stratejisi gerekebilir."; }
        else if (score === 4) { label = "Daha Az Uygun"; reasoning = "Mevcut toprak koşullarında ciddi sınırlamalar bulunuyor, yüksek verim almak zor olabilir."; }

        return {
          cropName: crop.name,
          icon: crop.icon,
          suitabilityScore: score as any,
          suitabilityLabel: label,
          reasoning,
          strengths: cStrengths,
          limitations: cLimitations
        };
      });

      // Sort suitabilities
      cropSuitabilities.sort((a, b) => a.suitabilityScore - b.suitabilityScore);

      // Mock Reverse Geocoding string
      const mockReverseGeocoding = (lat: number, lon: number) => {
        if (Math.abs(lat - 38.29) < 0.1) return "Yeşilyurt, Malatya";
        if (Math.abs(lat - 38.09) < 0.1) return "Doğanşehir, Malatya";
        if (Math.abs(lat - 38.41) < 0.1) return "Battalgazi, Malatya";
        if (Math.abs(lat - 38.61) < 0.1) return "Saruhanlı, Manisa";
        return "Tarla Konumu";
      };

      setData({
        location: {
          latitude: lat,
          longitude: lon,
          resolvedName: mockReverseGeocoding(lat, lon)
        },
        texture: {
          clayPercent: Number(clay.toFixed(1)),
          sandPercent: Number(sand.toFixed(1)),
          siltPercent: Number(silt.toFixed(1)),
          textureClass
        },
        properties: {
          organicMatter: Number(organicMatter.toFixed(1)),
          organicCarbon: Number((organicMatter / 1.724).toFixed(1)),
          ph: Number(ph.toFixed(1)),
          cec: Number(cec.toFixed(1)),
          bulkDensity: Number(bulkDensity.toFixed(2)),
          soilDepth: ">90 cm",
          drainage,
          waterHoldingCapacity: waterHolding,
          salinity: Number(salinity.toFixed(2))
        },
        generalEvaluation: evaluation,
        strengths,
        limitations,
        cropSuitabilities,
        source: "Bölgesel Veri Seti Tahmini",
        updatedAt: new Date().toLocaleTimeString('tr-TR')
      });
      setLoading(false);
    }, 800);
  };

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 font-bold justify-center">
        <MapPin className="mr-3" /> {error}
      </div>
    );
  }

  if (!data || loading) {
    return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center"><Sprout className="animate-spin mb-2 text-emerald-600" size={32} /> Bölgesel Toprak Verileri Analiz Ediliyor...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-2">
         <div>
           <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-1">
             <MapPin className="mr-2 text-emerald-600"/> Tarla Toprak Analizi
           </h2>
           <div className="text-slate-500 font-medium">
             {data.location.resolvedName} • <span className="font-mono text-xs">{data.location.latitude.toFixed(6)}°, {data.location.longitude.toFixed(6)}°</span>
           </div>
         </div>
      </div>

      {/* 1. TOPRAĞINI TANI KARTI (KATMAN 1) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-30 -ml-10 -mb-10 pointer-events-none"></div>
        
        <h3 className="font-black text-xl text-[#1B331B] mb-6 flex items-center relative z-10">
          <Leaf className="mr-2 text-emerald-500"/> Toprağını Tanı
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10 mb-6">
           <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-100">
             <div className="text-xs font-bold text-amber-700 mb-1">Toprak Yapısı</div>
             <div className="font-black text-xl text-amber-900">{data.texture.textureClass}</div>
           </div>
           <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
             <div className="text-xs font-bold text-emerald-700 mb-1">Organik Madde</div>
             <div className="font-black text-xl text-emerald-900">%{data.properties.organicMatter}</div>
           </div>
           <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100">
             <div className="text-xs font-bold text-blue-700 mb-1">pH Seviyesi</div>
             <div className="font-black text-xl text-blue-900">{data.properties.ph}</div>
           </div>
           <div className="bg-cyan-50/80 p-4 rounded-2xl border border-cyan-100">
             <div className="text-xs font-bold text-cyan-700 mb-1">Su Tutma</div>
             <div className="font-black text-xl text-cyan-900">{data.properties.waterHoldingCapacity}</div>
           </div>
           <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100">
             <div className="text-xs font-bold text-indigo-700 mb-1">Drenaj</div>
             <div className="font-black text-xl text-indigo-900">{data.properties.drainage}</div>
           </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative z-10">
           <div className="text-sm font-bold text-slate-800 mb-2 flex items-center">
             <Activity className="w-4 h-4 mr-2 text-indigo-500"/> Genel Değerlendirme
           </div>
           <p className="text-slate-600 font-medium leading-relaxed">
             "{data.generalEvaluation}"
           </p>
        </div>
      </div>

      {/* 2. GÜÇLÜ YANLAR VE LİMİTASYONLAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
           <h3 className="font-black text-lg text-emerald-900 mb-4 flex items-center">
             <CheckCircle className="mr-2 text-emerald-500" size={20}/> Bu Toprağın Güçlü Yanları
           </h3>
           <div className="space-y-3">
             {data.strengths.map((s, idx) => (
               <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                 <div className="flex items-center mb-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                   <h4 className="font-bold text-slate-800 text-sm">{s.title}</h4>
                 </div>
                 <p className="text-slate-600 text-xs font-medium pl-4">{s.text}</p>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
           <h3 className="font-black text-lg text-orange-900 mb-4 flex items-center">
             <AlertTriangle className="mr-2 text-orange-500" size={20}/> Dikkat Edilmesi Gerekenler
           </h3>
           <div className="space-y-3">
             {data.limitations.map((l, idx) => (
               <div key={idx} className="bg-white p-4 rounded-xl border border-orange-100/50 shadow-sm">
                 <div className="flex items-center mb-1">
                   <div className={`w-2 h-2 rounded-full ${l.status === 'bad' ? 'bg-red-500' : 'bg-orange-500'} mr-2`}></div>
                   <h4 className="font-bold text-slate-800 text-sm">{l.title}</h4>
                 </div>
                 <p className="text-slate-600 text-xs font-medium pl-4">{l.text}</p>
               </div>
             ))}
             {data.limitations.length === 0 && (
               <div className="text-sm text-slate-500 font-medium">Belirgin bir sınırlama bulunmuyor.</div>
             )}
           </div>
        </div>
      </div>

      {/* 3. ÜRÜN UYGUNLUĞU */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-black text-xl text-[#1B331B] mb-2 flex items-center">
          <Sprout className="mr-2 text-indigo-500"/> Bu Bölge İçin Öne Çıkan Ürünler
        </h3>
        <p className="text-sm text-slate-500 font-medium mb-6">
          Bu lokasyonun tahmini toprak ve iklim özellikleri ile tarımsal ürünlerin genel ekolojik gereksinimleri karşılaştırılarak hesaplanmıştır.
        </p>
        
        <div className="space-y-4">
           {data.cropSuitabilities.map((crop, idx) => {
              const bgColors = {
                1: 'bg-emerald-50 border-emerald-100',
                2: 'bg-blue-50 border-blue-100',
                3: 'bg-amber-50 border-amber-100',
                4: 'bg-red-50 border-red-100'
              };
              const textColors = {
                1: 'text-emerald-700',
                2: 'text-blue-700',
                3: 'text-amber-700',
                4: 'text-red-700'
              };
              const medals = { 1: '🥇', 2: '🥈', 3: '🥉', 4: '⚠️' };
              
              return (
                <div key={idx} className={`p-5 rounded-2xl border ${bgColors[crop.suitabilityScore]}`}>
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                     <div className="flex items-center mb-2 md:mb-0">
                       <span className="text-2xl mr-3">{crop.icon}</span>
                       <h4 className="font-black text-lg text-slate-800">{crop.cropName}</h4>
                     </div>
                     <div className={`font-black flex items-center ${textColors[crop.suitabilityScore]}`}>
                       <span className="mr-2 text-xl">{medals[crop.suitabilityScore]}</span> {crop.suitabilityLabel}
                     </div>
                   </div>
                   <p className="text-sm text-slate-700 font-medium mb-3">"{crop.reasoning}"</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/50">
                      <div>
                        {crop.strengths.map((s, i) => (
                          <div key={i} className="text-xs text-emerald-700 font-medium flex items-start mb-1">
                            <span className="mr-1.5 mt-0.5">•</span> {s}
                          </div>
                        ))}
                      </div>
                      <div>
                        {crop.limitations.map((l, i) => (
                          <div key={i} className="text-xs text-amber-700 font-medium flex items-start mb-1">
                            <span className="mr-1.5 mt-0.5">•</span> {l}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              );
           })}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl text-xs font-medium text-slate-500 border border-slate-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0 mt-0.5"/>
          <p>
            <strong>ÖNEMLİ:</strong> Bu sayfadaki veriler bölgesel veri setleri ve deterministik simülasyon (demo) aracılığıyla üretilmiştir. Gerçek ve kesin sonuçlar (Örn: %X kil) laboratuvar analizleri veya sahada yapılan fiziksel sensör ölçümleriyle elde edilebilir. 
            Buradaki ürün uygunluğu, FAO (Gıda ve Tarım Örgütü) ekolojik adaptasyon kurallarına (pH, tuzluluk, tekstür eşikleri) dayalı olarak çalıştırılmaktadır.
          </p>
        </div>
      </div>

      <button 
        onClick={() => setShowDetailedInfo(!showDetailedInfo)}
        className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
      >
        <Microscope size={18} className="text-indigo-500" />
        <span>{showDetailedInfo ? 'Detaylı Toprak Analizini Kapat' : 'Detaylı Toprak Analizi (Teknik Veriler)'}</span>
        <ChevronDown size={16} className={`transition-transform ${showDetailedInfo ? 'rotate-180' : ''}`} />
      </button>

      {/* KATMAN 2: BİLİMSEL VERİLER */}
      {showDetailedInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><TestTube className="mr-2 text-indigo-500"/> Tarımsal Toprak Analizi (Katman 2)</h3>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-4">Tekstür Dağılımı</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <div className="flex flex-col w-full">
                     <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                       <span>Kil (Clay)</span>
                       <span>%{data.texture.clayPercent}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                       <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${data.texture.clayPercent}%` }}></div>
                     </div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex flex-col w-full">
                     <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                       <span>Kum (Sand)</span>
                       <span>%{data.texture.sandPercent}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                       <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${data.texture.sandPercent}%` }}></div>
                     </div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex flex-col w-full">
                     <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
                       <span>Mil (Silt)</span>
                       <span>%{data.texture.siltPercent}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                       <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.texture.siltPercent}%` }}></div>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-100">
                  <h3 className="font-black text-sm text-slate-800 mb-3">Kimyasal / Fiziksel Özellikler</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Organik Karbon (OC)</span>
                      <span className="font-bold text-slate-800">%{data.properties.organicCarbon}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Bulk Density (Hacim Ağırlığı)</span>
                      <span className="font-bold text-slate-800">{data.properties.bulkDensity} g/cm³</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">CEC (Katyon Değişim)</span>
                      <span className="font-bold text-slate-800">{data.properties.cec} meq/100g</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Tuzluluk (ECe)</span>
                      <span className="font-bold text-slate-800">{data.properties.salinity} dS/m</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Kök Derinliği</span>
                      <span className="font-bold text-slate-800">{data.properties.soilDepth}</span>
                    </div>
                  </div>
               </div>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-4">Metodoloji & Referanslar</h3>
               <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
                 Ürün uygunluk hesaplamaları, toprağın fiziksel (drenaj, tekstür kısıtları) ve kimyasal (pH, tuzluluk toleransı) özellikleri baz alınarak Gıda ve Tarım Örgütü (FAO) AEZ (Agro-Ecological Zones) yönergelerindeki uyarlama kurallarına dayanmaktadır.
               </p>
               <ul className="text-xs text-slate-500 space-y-2 font-medium list-disc pl-4">
                 <li>Organik karbon, Van Bemmelen faktörü (1.724) kullanılarak Organik Madde üzerinden tahminlenmiştir.</li>
                 <li>Tuzluluk kısıtları Mass ve Hoffman (1977) eşik değerleri (threshold) mantığı kullanılarak derecelendirilmiştir.</li>
                 <li>Koordinatlar arası coğrafi konum tespiti lokal olarak çözümlenmektedir (Demo Algoritma).</li>
               </ul>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
