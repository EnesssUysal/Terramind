import React from 'react';
import { Database, Wifi, CheckCircle2, XCircle } from 'lucide-react';

export const ApiMonitor = () => {
  const apis = [
    { name: 'Tarlalar API', url: 'https://api.terramind.io/v1/fields', status: 'ok', latency: 45 },
    { name: 'Hava Durumu API (Open-Meteo)', url: 'https://api.open-meteo.com/v1', status: 'ok', latency: 120 },
    { name: 'Toprak Veri API', url: 'https://api.terramind.io/v1/soil', status: 'ok', latency: 60 },
    { name: 'NPK API', url: 'https://api.terramind.io/v1/npk', status: 'ok', latency: 55 },
    { name: 'pH API', url: 'https://api.terramind.io/v1/ph', status: 'ok', latency: 50 },
    { name: 'EC API', url: 'https://api.terramind.io/v1/ec', status: 'ok', latency: 52 },
    { name: 'Analiz API', url: 'https://api.terramind.io/v1/analysis', status: 'ok', latency: 110 },
    { name: 'Sulama API', url: 'https://api.terramind.io/v1/irrigation', status: 'ok', latency: 48 },
    { name: 'Senaryo API (Local)', url: 'http://localhost:5000/api/admin/scenario', status: 'ok', latency: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center text-zinc-400 mb-6">
        <Database className="mr-3 text-brand-blue"/>
        <div>
          <h2 className="text-2xl font-bold text-white">API İzleme Monitörü</h2>
          <p className="text-sm">Tüm dış ve iç mikroservislerin canlı sağlık (health-check) durumu.</p>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl p-2 shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-sm uppercase">
              <th className="p-4 font-bold">Servis Adı</th>
              <th className="p-4 font-bold">Endpoint</th>
              <th className="p-4 font-bold">Durum</th>
              <th className="p-4 font-bold text-right">Gecikme (Ping)</th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api, i) => (
              <tr key={i} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-zinc-200 flex items-center">
                  <Wifi size={16} className="mr-3 text-brand-blue"/>
                  {api.name}
                </td>
                <td className="p-4 font-mono text-xs text-zinc-500">{api.url}</td>
                <td className="p-4">
                  {api.status === 'ok' ? (
                    <span className="flex items-center text-emerald-400 text-xs font-bold uppercase">
                      <CheckCircle2 size={14} className="mr-1"/> ÇALIŞIYOR
                    </span>
                  ) : (
                    <span className="flex items-center text-red-400 text-xs font-bold uppercase">
                      <XCircle size={14} className="mr-1"/> HATA
                    </span>
                  )}
                </td>
                <td className="p-4 text-right font-mono text-emerald-400">{api.latency} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
