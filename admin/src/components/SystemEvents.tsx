import React from 'react';
import { Terminal, Clock } from 'lucide-react';

export const SystemEvents = ({ logs }: { logs: string[] }) => {
  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center text-zinc-400 mb-2 shrink-0">
        <Terminal className="mr-3 text-brand-green"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Sistem Olayları (Event Logs)</h2>
          <p className="text-sm">TerraMind backend, veritabanı ve AI motoru canlı hareket dökümü.</p>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-4 right-4 flex items-center text-emerald-500 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Canlı İzleme Aktif
        </div>
        
        {logs && logs.length > 0 ? (
          <div className="space-y-2 mt-6">
            {logs.map((log, i) => {
              // Extract timestamp [HH:MM:SS]
              const match = log.match(/^\[(.*?)\] (.*)$/);
              if (match) {
                return (
                  <div key={i} className="flex hover:bg-zinc-900 px-2 py-1 rounded">
                    <span className="text-brand-green mr-4 shrink-0 flex items-center"><Clock size={12} className="mr-1"/>{match[1]}</span>
                    <span className="text-zinc-300">{match[2]}</span>
                  </div>
                );
              }
              return <div key={i} className="text-zinc-300">{log}</div>;
            })}
          </div>
        ) : (
          <div className="text-zinc-600 mt-6 px-2">Sistem logları bekleniyor...</div>
        )}
      </div>
    </div>
  );
};
