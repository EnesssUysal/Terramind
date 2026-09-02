import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { NPKData } from '../../types';

interface NpkChartProps {
  data: NPKData;
}

export function NpkComparisonChart({ data }: NpkChartProps) {
  // Transform NPK data into chart format
  const chartData = [
    {
      name: 'Azot (N)',
      value: data.nitrogen || 0,
      color: '#3b82f6', // blue
    },
    {
      name: 'Fosfor (P)',
      value: data.phosphorus || 0,
      color: '#8b5cf6', // purple
    },
    {
      name: 'Potasyum (K)',
      value: data.potassium || 0,
      color: '#f59e0b', // amber
    }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" unit=" mg" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value} mg/kg`, 'Ölçüm']}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-xs text-slate-500 font-medium">
        Değerler toprak analiz sonuçlarıdır. Bitkinin ihtiyacını değerlendirmek için ürün ve gelişim dönemi dikkate alınır.
      </div>
    </div>
  );
}
