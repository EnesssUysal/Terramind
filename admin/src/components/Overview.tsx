import React from 'react';
import { Activity, Database, Cloud, Radio, Cpu, Network, Zap } from 'lucide-react';

export const Overview = ({ state }: { state: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-zinc-400 mb-6">
        <Activity className="mr-3 text-brand-green"/>
        <h2 className="text-2xl font-bold text-white">Sistem Genel Bakış</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* System Status Cards */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-300">Backend API</h3>
            <Database size={20} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mb-1">Bağlı</div>
          <div className="text-sm text-emerald-400 font-mono">Uptime: 99.9%</div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-300">Meteoroloji (Open-Meteo)</h3>
            <Cloud size={20} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mb-1">Aktif</div>
          <div className="text-sm text-emerald-400 font-mono">Gecikme: 42ms</div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-300">IoT Sensör Ağı</h3>
            <Radio size={20} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mb-1">Senkronize</div>
          <div className="text-sm text-emerald-400 font-mono">12 Cihaz Aktif</div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-300">TerraMind AI</h3>
            <Cpu size={20} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mb-1">Hazır</div>
          <div className="text-sm text-emerald-400 font-mono">Model: v2.1.4</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center">
            <Network className="mr-2 text-brand-green" size={20}/>
            Aktif Simülasyon Durumu
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-zinc-400">Mod</span>
              <span className={`font-bold ${state?.isSimulationActive ? 'text-red-400' : 'text-emerald-400'}`}>
                {state?.isSimulationActive ? 'SİMÜLASYON (OVERRIDE)' : 'GERÇEK VERİ'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-zinc-400">Aktif Senaryo</span>
              <span className="font-bold text-white uppercase">{state?.scenario || 'YOK'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-zinc-400">Uygulanan Manuel Değişiklikler</span>
              <span className="font-bold text-brand-green">
                {state?.overrides ? Object.values(state.overrides).filter(v => v !== null).length : 0} Parametre
              </span>
            </div>
          </div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-500" size={20}/>
            Hızlı Eylemler
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            Admin kontrol merkezinden ana platformdaki tüm verileri ve bilimsel hesaplamaları canlı olarak manipüle edebilirsiniz. Tüm işlemler anında ana platforma yansır.
          </p>
          <div className="mt-auto grid grid-cols-2 gap-4">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold text-sm transition-colors">
              Tarlaları Yönet
            </button>
            <button className="bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/50 py-3 rounded-lg font-bold text-sm transition-colors">
              Senaryo Başlat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
