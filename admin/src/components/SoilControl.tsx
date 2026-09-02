import React, { useState } from 'react';
import { Leaf, Droplets, MapPin, Save, FlaskConical } from 'lucide-react';

export const SoilControl = ({ state, triggerOverride }: { state: any, triggerOverride: (p: string, v: number|null) => void }) => {
  const [soilMoisture, setSoilMoisture] = useState<number | ''>(state?.overrides?.soilMoisture ?? '');
  const [ph, setPh] = useState<number | ''>(state?.overrides?.ph ?? '');
  const [ec, setEc] = useState<number | ''>(state?.overrides?.ec ?? '');
  const [nitrogen, setNitrogen] = useState<number | ''>(state?.overrides?.nitrogen ?? '');
  const [phosphorus, setPhosphorus] = useState<number | ''>(state?.overrides?.phosphorus ?? '');
  const [potassium, setPotassium] = useState<number | ''>(state?.overrides?.potassium ?? '');

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center text-zinc-400 mb-6">
        <MapPin className="mr-3 text-brand-orange"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Toprak ve NPK Kontrolü</h2>
          <p className="text-sm">ESP32 sensör ağından gelen gerçek zamanlı toprak altı sensör verilerini manipüle edin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fiziksel */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-brand-blue flex items-center mb-4"><Droplets size={18} className="mr-2"/> Toprak Nemi (%)</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" value={soilMoisture} onChange={e => setSoilMoisture(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="32.5" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('soilMoisture', soilMoisture === '' ? null : soilMoisture)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.soilMoisture !== null ? <span className="text-brand-blue font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-pink-500 flex items-center mb-4"><FlaskConical size={18} className="mr-2"/> Toprak pH</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="6.5" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('ph', ph === '' ? null : ph)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.ph !== null ? <span className="text-pink-500 font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-purple-400 flex items-center mb-4"><FlaskConical size={18} className="mr-2"/> Elektriksel İlet. (ECa)</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" step="0.1" value={ec} onChange={e => setEc(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="1.2 dS/m" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-brand-blue"
            />
            <button onClick={() => triggerOverride('ec', ec === '' ? null : ec)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.ec !== null ? <span className="text-purple-400 font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

        {/* NPK */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-emerald-400 flex items-center mb-4"><Leaf size={18} className="mr-2"/> Azot (N) (mg/kg)</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" value={nitrogen} onChange={e => setNitrogen(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="45" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-emerald-400"
            />
            <button onClick={() => triggerOverride('nitrogen', nitrogen === '' ? null : nitrogen)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.nitrogen !== null ? <span className="text-emerald-400 font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-teal-400 flex items-center mb-4"><Leaf size={18} className="mr-2"/> Fosfor (P) (mg/kg)</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" value={phosphorus} onChange={e => setPhosphorus(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="15" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-teal-400"
            />
            <button onClick={() => triggerOverride('phosphorus', phosphorus === '' ? null : phosphorus)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.phosphorus !== null ? <span className="text-teal-400 font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <label className="font-bold text-cyan-400 flex items-center mb-4"><Leaf size={18} className="mr-2"/> Potasyum (K) (mg/kg)</label>
          <div className="flex space-x-3 mb-2">
            <input 
              type="number" value={potassium} onChange={e => setPotassium(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="120" className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-white text-sm focus:border-cyan-400"
            />
            <button onClick={() => triggerOverride('potassium', potassium === '' ? null : potassium)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
              <Save size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">Durum: {state?.overrides?.potassium !== null ? <span className="text-cyan-400 font-bold">SİMÜLE</span> : 'GERÇEK'}</p>
        </div>

      </div>
    </div>
  );
};
