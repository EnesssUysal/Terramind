import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Legend, ComposedChart
} from 'recharts';
import { ClimateAnalysisResult } from '../../types';

interface ClimateChartsProps {
  data: ClimateAnalysisResult['history'];
}

export function TemperatureHistoryChart({ data }: ClimateChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit="°C" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="Tmax" name="Maks. Sıcaklık" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Tavg" name="Ortalama Sıcaklık" stroke="#f59e0b" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="Tmin" name="Min. Sıcaklık" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GDDChart({ data }: ClimateChartsProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGdd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="GDD" name="Günlük GDD (Gelişim Puanı)" stroke="#059669" fillOpacity={1} fill="url(#colorGdd)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadiationChart({ data }: ClimateChartsProps) {
  // Radyasyon verisi yoksa boş bir alan döndür
  if (!data[0] || data[0].radiation === null) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">Grafik için radyasyon sensör verisi bekleniyor.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit="MJ" />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="radiation" name="Günlük Güneş Radyasyonu (MJ/m²)" fill="#eab308" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
