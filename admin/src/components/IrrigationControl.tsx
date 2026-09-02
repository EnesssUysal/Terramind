import React, { useState } from 'react';
import { Droplets, Save, Clock, Percent } from 'lucide-react';

export const IrrigationControl = ({ state, triggerOverride }: { state: any, triggerOverride: (p: string, v: number|null) => void }) => {
  const [irrigationAmount, setIrrigationAmount] = useState<number | ''>(state?.overrides?.irrigationAmount ?? '');
  const [irrigationDuration, setIrrigationDuration] = useState<number | ''>(state?.overrides?.irrigationDuration ?? '');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center text-zinc-400 mb-6">
        <Droplets className="mr-3 text-cyan-500"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Sulama Sistemi Kontrolü</h2>
          <p className="text-sm">Akıllı vana ve damlama sulama sensörlerinden gelen verileri simüle edin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Droplets size={18} className="mr-2 text-cyan-500"/> Sulama Miktarı (mm)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={irrigationAmount} 
              onChange={e => setIrrigationAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
            />
            <button onClick={() => triggerOverride('irrigationAmount', irrigationAmount === '' ? null : irrigationAmount)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.irrigationAmount !== null ? <span className="text-cyan-500 font-bold">{state?.overrides?.irrigationAmount} mm (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-zinc-300 flex items-center mb-4"><Clock size={18} className="mr-2 text-amber-500"/> Sulama Süresi (Saat)</label>
          <div className="flex space-x-4">
            <input 
              type="number" 
              value={irrigationDuration} 
              onChange={e => setIrrigationDuration(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
            />
            <button onClick={() => triggerOverride('irrigationDuration', irrigationDuration === '' ? null : irrigationDuration)} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold flex items-center">
              <Save size={16} className="mr-2"/> Uygula
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Mevcut Durum: {state?.overrides?.irrigationDuration !== null ? <span className="text-amber-500 font-bold">{state?.overrides?.irrigationDuration} Saat (Simüle)</span> : 'GERÇEK VERİ'}</p>
        </div>
      </div>
      
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
        <h4 className="font-bold text-cyan-500 mb-2">Simülasyon Notu</h4>
        <p className="text-sm text-zinc-300">
          Uygulanan sulama miktarı, kök bölgesi su dengesi modelindeki (Dr) su açığını kapatacaktır. Toprak nemi simülasyonu çalışıyorsa, sulama sonrası nemin nasıl yükseleceğini ana platformdan görebilirsiniz.
        </p>
      </div>
    </div>
  );
};
