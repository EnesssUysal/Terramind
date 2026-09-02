import React, { useState } from 'react';
import { Cloud, Sun, Droplets, Wind, Save } from 'lucide-react';

export const WeatherControl = ({ state, triggerOverride }: { state: any, triggerOverride: (p: string, v: number|null) => void }) => {
  const [temp, setTemp] = useState<number | ''>(state?.overrides?.temperature ?? '');
  const [hum, setHum] = useState<number | ''>(state?.overrides?.humidity ?? '');
  const [rain, setRain] = useState<number | ''>(state?.overrides?.rainfall ?? '');
  const [wind, setWind] = useState<number | ''>(state?.overrides?.windSpeed ?? '');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center text-zinc-400 mb-6">
        <Cloud className="mr-3 text-brand-blue"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Hava Durumu Kontrolü</h2>
          <p className="text-sm">Tüm tarımsal analizleri etkileyen atmosferik verileri manuel olarak değiştirin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Sun size={18} className="mr-2 text-yellow-500"/> Sıcaklık (°C)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={temp} 
              onChange={e => setTemp(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Gerçek veriyi kullan..."
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('temperature', temp === '' ? null : temp)} className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.temperature !== null ? <span className="text-brand-blue font-bold">{state?.overrides?.temperature} °C (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Droplets size={18} className="mr-2 text-brand-blue"/> Bağıl Nem (%)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={hum} 
              onChange={e => setHum(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Gerçek veriyi kullan..."
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('humidity', hum === '' ? null : hum)} className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.humidity !== null ? <span className="text-brand-blue font-bold">{state?.overrides?.humidity} % (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Cloud size={18} className="mr-2 text-blue-400"/> Yağış (mm)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={rain} 
              onChange={e => setRain(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Gerçek veriyi kullan..."
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('rainfall', rain === '' ? null : rain)} className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.rainfall !== null ? <span className="text-brand-blue font-bold">{state?.overrides?.rainfall} mm (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Wind size={18} className="mr-2 text-slate-400"/> Rüzgar Hızı (m/s)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={wind} 
              onChange={e => setWind(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Gerçek veriyi kullan..."
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('windSpeed', wind === '' ? null : wind)} className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.windSpeed !== null ? <span className="text-brand-blue font-bold">{state?.overrides?.windSpeed} m/s (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>
      </div>
      
      <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6">
        <h4 className="font-bold text-brand-blue mb-2">Simülasyon Notu</h4>
        <p className="text-sm text-zinc-300">
          Hava durumu parametrelerini değiştirdiğinizde arka plandaki TerraMind motoru ET₀ (Referans Evapotranspirasyon), VPD (Buhar Basıncı Açığı) ve Hastalık/Zararlı risk analizlerini <strong>anında</strong> yeniden hesaplayacaktır. Değişikliklerin etkilerini ana platformdan canlı izleyebilirsiniz.
        </p>
      </div>
    </div>
  );
};
