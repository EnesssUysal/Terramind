import React, { useState } from 'react';
import { FlaskConical, Play, RefreshCw, AlertTriangle, Droplets, ThermometerSun, Wind, Bug, Skull } from 'lucide-react';

export const ScenarioLab = ({ state, triggerScenario }: { state: any, triggerScenario: (scenario: string, name: string, overrides: any) => void }) => {

  const scenarios = [
    { id: 'drought', name: 'Şiddetli Kuraklık', icon: <ThermometerSun/>, color: 'red', desc: 'Aşırı sıcak, düşük nem ve sıfır yağış ile tam kuraklık stresi.', overrides: { temperature: 42, humidity: 15, rainfall: 0, soilMoisture: 12, windSpeed: 25 } },
    { id: 'heat_wave', name: 'Aşırı Sıcak Hava', icon: <ThermometerSun/>, color: 'orange', desc: 'Sıcaklık 40-45°C arası. Isı stresi ve VPD artışı.', overrides: { temperature: 44, humidity: 20 } },
    { id: 'heavy_rain', name: 'Aşırı Yağış (Su Baskını)', icon: <Droplets/>, color: 'blue', desc: 'Çok yüksek yağış ve doymuş toprak.', overrides: { rainfall: 120, soilMoisture: 95, humidity: 95, temperature: 18 } },
    { id: 'long_drought', name: 'Uzun Süreli Yağışsızlık', icon: <ThermometerSun/>, color: 'amber', desc: 'Günlerce süren kuraklık. Toprak su açığı artışı.', overrides: { rainfall: 0, soilMoisture: 18, humidity: 25 } },
    { id: 'salinity', name: 'Tuzluluk Artışı', icon: <AlertTriangle/>, color: 'purple', desc: 'Kademeli EC artışı. Bitki su alamamaya başlar.', overrides: { ec: 4.5, soilMoisture: 30 } },
    { id: 'salinity_shock', name: 'Tuzluluk Şoku', icon: <Skull/>, color: 'purple', desc: 'Ani ve şiddetli tuzluluk. Kritik stres seviyesi.', overrides: { ec: 8.5, soilMoisture: 25 } },
    { id: 'n_deficiency', name: 'Azot (N) Eksikliği', icon: <Leaf/>, color: 'emerald', desc: 'Kritik azot seviyesi.', overrides: { nitrogen: 12 } },
    { id: 'p_deficiency', name: 'Fosfor (P) Eksikliği', icon: <Leaf/>, color: 'teal', desc: 'Kritik fosfor seviyesi.', overrides: { phosphorus: 5 } },
    { id: 'k_deficiency', name: 'Potasyum (K) Eksikliği', icon: <Leaf/>, color: 'cyan', desc: 'Kritik potasyum seviyesi.', overrides: { potassium: 30 } },
    { id: 'ph_drop', name: 'Ani pH Düşüşü (Asidik)', icon: <FlaskConical/>, color: 'pink', desc: 'pH değeri 5.0 seviyesine düşer.', overrides: { ph: 5.0 } },
    { id: 'ph_rise', name: 'Ani pH Yükselmesi (Alkali)', icon: <FlaskConical/>, color: 'rose', desc: 'pH değeri 8.5 seviyesine çıkar.', overrides: { ph: 8.5 } },
    { id: 'over_irrigation', name: 'Aşırı Sulama', icon: <Droplets/>, color: 'cyan', desc: 'Gereksiz aşırı sulama, kök boğulma riski.', overrides: { irrigationAmount: 50, soilMoisture: 90 } },
    { id: 'under_irrigation', name: 'Yetersiz Sulama', icon: <Droplets/>, color: 'amber', desc: 'Sulamaya rağmen su stresi devam eder.', overrides: { irrigationAmount: 5, soilMoisture: 22 } },
    { id: 'sensor_offline', name: 'Sensör Arızası (OFFLINE)', icon: <Bug/>, color: 'zinc', desc: 'Toprak nem sensörü çevrimdışı kalır.', overrides: {}, sensorStatus: { soilMoisture: 'offline' } },
    { id: 'sensor_noise', name: 'Sensör Gürültüsü', icon: <Bug/>, color: 'zinc', desc: 'Değerler sürekli dalgalanır.', overrides: {}, sensorStatus: { temperature: 'noise' } },
    { id: 'sensor_jump', name: 'Ani Sensör Sıçraması', icon: <AlertTriangle/>, color: 'yellow', desc: 'Nem %32 -> %91 -> %31 atlar.', overrides: { soilMoisture: 91 } },
    { id: 'combined_heat_drought', name: 'Sıcaklık + Kuraklık', icon: <Skull/>, color: 'red', desc: 'Sıcaklık, düşük nem ve sıfır yağış bir arada.', overrides: { temperature: 40, humidity: 15, rainfall: 0, soilMoisture: 10 } },
    { id: 'combined_heat_salinity', name: 'Sıcaklık + Tuzluluk', icon: <Skull/>, color: 'purple', desc: 'Isı stresi ve ozmotik stres birleşik.', overrides: { temperature: 38, ec: 6.0, humidity: 25 } },
    { id: 'rain_no_drainage', name: 'Aşırı Yağış + Düşük Drenaj', icon: <Droplets/>, color: 'blue', desc: 'Su birikmesi ve bataklıklaşma riski.', overrides: { rainfall: 80, soilMoisture: 98, sand: 10, clay: 60 } },
    { id: 'npk_water_stress', name: 'Besin + Su Stresi', icon: <Leaf/>, color: 'amber', desc: 'Düşük NPK ve düşük nem.', overrides: { nitrogen: 10, phosphorus: 8, potassium: 40, soilMoisture: 18 } },
    { id: 'ideal', name: 'İdeal Koşullar', icon: <Leaf/>, color: 'emerald', desc: 'Tüm parametreler optimum seviyede.', overrides: { temperature: 24, humidity: 55, soilMoisture: 65, ph: 6.5, ec: 1.2, nitrogen: 50, phosphorus: 20, potassium: 150 } },
    { id: 'frost', name: 'Ani Don (Zirai Don)', icon: <Wind/>, color: 'cyan', desc: 'Sıcaklık sıfırın altına düşer.', overrides: { temperature: -2, humidity: 85 } },
    { id: 'night_frost', name: 'Gece Donu', icon: <Wind/>, color: 'blue', desc: 'Gece vakti sıcaklık düşüşü.', overrides: { temperature: 1, humidity: 90, radiation: 0 } },
    { id: 'temp_fluctuation', name: 'Sıcaklık Dalgalanması', icon: <ThermometerSun/>, color: 'orange', desc: 'Gündüz/gece arası uçurum.', overrides: { temperature: 38 } },
    { id: 'high_wind', name: 'Yoğun Rüzgâr', icon: <Wind/>, color: 'slate', desc: 'ET0 değerini şiddetle artırır.', overrides: { windSpeed: 45, temperature: 28 } },
    { id: 'dry_wind', name: 'Düşük Nem + Yüksek Rüzgâr', icon: <Wind/>, color: 'amber', desc: 'Atmosferik su talebi (VPD) patlaması.', overrides: { windSpeed: 35, humidity: 15, temperature: 35 } },
    { id: 'fast_dry', name: 'Yağış Sonrası Hızlı Kuruma', icon: <ThermometerSun/>, color: 'orange', desc: 'Islak toprağa ani sıcak rüzgar.', overrides: { soilMoisture: 80, windSpeed: 40, temperature: 36, humidity: 20 } },
    { id: 'long_salinity', name: 'Uzun Süreli Tuzluluk', icon: <AlertTriangle/>, color: 'purple', desc: 'Kalıcı yüksek tuzluluk birikimi.', overrides: { ec: 5.5 } },
    { id: 'npk_shock', name: 'Gübreleme Sonrası Şok', icon: <FlaskConical/>, color: 'emerald', desc: 'NPK aniden aşırı yükselir.', overrides: { nitrogen: 180, phosphorus: 80, potassium: 350, ec: 3.5 } },
    { id: 'total_stress', name: 'Komple Stres (Kıyamet)', icon: <Skull/>, color: 'red', desc: 'Sistemin tüm uyarı mekanizmalarını test et.', overrides: { temperature: 45, humidity: 10, soilMoisture: 8, ec: 8.0, ph: 4.5, nitrogen: 5, rainfall: 0 } }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center text-zinc-400 mb-6">
        <FlaskConical className="mr-3 text-brand-green"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Senaryo Laboratuvarı</h2>
          <p className="text-sm">TerraMind algoritmalarını test etmek için tasarlanmış 30 özel tarımsal senaryo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
        {scenarios.map(s => {
          const isActive = state?.scenario === s.id;
          
          let bgClass = 'bg-admin-card border-admin-border';
          let borderClass = 'border-admin-border';
          let textClass = `text-${s.color}-500`;
          
          if (isActive) {
            bgClass = `bg-${s.color}-500/10`;
            borderClass = `border-${s.color}-500/50 scale-105 z-10`;
          }

          return (
            <div key={s.id} className={`border rounded-xl p-5 shadow-lg transition-all flex flex-col h-full ${bgClass} ${borderClass}`}>
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg bg-${s.color}-500/20 ${textClass}`}>
                  {s.icon}
                </div>
                {isActive && (
                  <span className={`bg-${s.color}-500 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold animate-pulse`}>AKTİF</span>
                )}
              </div>
              
              <h3 className={`font-black text-lg mb-2 ${textClass}`}>{s.name}</h3>
              <p className="text-xs text-zinc-400 mb-4 flex-1">{s.desc}</p>
              
              <div className="text-[10px] font-mono text-zinc-500 bg-black/40 p-2 rounded mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                {Object.keys(s.overrides).length > 0 ? 
                  Object.keys(s.overrides).map(k => `${k}: ${s.overrides[k as keyof typeof s.overrides]}`).join(', ') 
                  : 'Sistem Override Yok'
                }
              </div>

              <button 
                onClick={() => triggerScenario(s.id, s.name, s.overrides)} 
                className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center transition-colors text-xs
                  ${isActive 
                    ? `bg-${s.color}-500/20 hover:bg-${s.color}-500/30 text-${s.color}-400 border border-${s.color}-500/30` 
                    : `bg-zinc-800 hover:bg-zinc-700 text-zinc-300`
                  }`}
              >
                {isActive ? <RefreshCw size={14} className="mr-2 animate-spin"/> : <Play size={14} className="mr-2"/>}
                {isActive ? 'YENİDEN TETİKLE' : 'SENARYOYU BAŞLAT'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
