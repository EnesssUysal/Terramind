import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Legend, ReferenceLine, ComposedChart
} from 'recharts';
import { WaterAnalysisResult } from '../../types';

interface WaterChartsProps {
  data: WaterAnalysisResult['history'];
}

export function SoilMoistureChart({ data }: WaterChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit="%" />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="moisture" name="Toprak Nemi" stroke="#2563eb" fillOpacity={1} fill="url(#colorMoisture)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WaterBalanceChart({ data }: WaterChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit="mm" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line type="stepAfter" dataKey="TAW" name="Maks. Su Kapasitesi" stroke="#94a3b8" strokeDasharray="5 5" />
          <Line type="stepAfter" dataKey="RAW" name="Faydalı Su Sınırı" stroke="#f59e0b" strokeWidth={2} />
          <Area type="monotone" dataKey="Dr" name="Tarladaki Su Açığı" stroke="#ef4444" fill="#fecaca" fillOpacity={0.6} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WaterStressChart({ data }: WaterChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" domain={[0, 1]} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <ReferenceLine y={0.8} label="Düşük Stres" stroke="#10b981" strokeDasharray="3 3" />
          <ReferenceLine y={0.5} label="Orta Stres" stroke="#f59e0b" strokeDasharray="3 3" />
          <ReferenceLine y={0.2} label="Kritik Stres" stroke="#ef4444" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="Ks" name="Stres Durumu" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PrecipitationIrrigationChart({ data }: WaterChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit="mm" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="P" name="Yağış (P)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="I" name="Sulama (I)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ETc" name="Tüketim (ETc)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
