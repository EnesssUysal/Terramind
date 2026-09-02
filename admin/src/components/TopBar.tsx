import React from 'react';
import { CheckCircle } from 'lucide-react';

interface TopBarProps {
  toast: string | null;
  triggerReset: () => void;
  startDemo: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toast, triggerReset, startDemo }) => {
  return (
    <header className="h-16 border-b border-admin-border bg-admin-card flex items-center justify-between px-6 shrink-0 relative">
      {toast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-4 z-50 flex items-center">
          <CheckCircle size={16} className="mr-2"/> {toast}
        </div>
      )}

      <div className="flex items-center">
        <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 flex items-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          YÖNETİCİ MODU
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={triggerReset} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-md text-sm font-bold transition-colors border border-zinc-700">
          Gerçek Verilere Dön
        </button>
        <button onClick={startDemo} className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">
          Demoyu Başlat
        </button>
      </div>
    </header>
  );
};
