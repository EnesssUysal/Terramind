import React from 'react';
import { Activity, Database, Cloud, Droplets, FlaskConical, LayoutDashboard, Leaf, Map, Radio, Settings, Terminal, Play } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors border-l-2 ${isActive ? 'bg-admin-card border-brand-green text-white' : 'border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
  >
    <span className={`mr-3 ${isActive ? 'text-brand-green' : 'text-zinc-500'}`}>{icon}</span>
    {label}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-72 shrink-0 border-r border-admin-border bg-black flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-admin-border shrink-0">
        <div className="text-xl font-black tracking-tighter text-white">
          TERRA<span className="text-brand-green">MIND</span><span className="text-xs ml-2 text-zinc-500 font-mono font-normal">KONTROL MERKEZİ</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1">
          <div className="mb-2 px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ana Platform</div>
          <NavItem icon={<LayoutDashboard size={18}/>} label="Genel Bakış" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Map size={18}/>} label="Tarlalar & Canlı Durum" isActive={activeTab === 'fields'} onClick={() => setActiveTab('fields')} />
          
          <div className="mt-6 mb-2 px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Parametre Kontrolü</div>
          <NavItem icon={<Radio size={18}/>} label="Sensör Bağlantıları" isActive={activeTab === 'sensors'} onClick={() => setActiveTab('sensors')} />
          <NavItem icon={<Cloud size={18}/>} label="Hava Durumu Kontrolü" isActive={activeTab === 'weather'} onClick={() => setActiveTab('weather')} />
          <NavItem icon={<Leaf size={18}/>} label="Toprak & NPK Kontrolü" isActive={activeTab === 'soil'} onClick={() => setActiveTab('soil')} />
          <NavItem icon={<Droplets size={18}/>} label="Sulama Kontrolü" isActive={activeTab === 'irrigation'} onClick={() => setActiveTab('irrigation')} />

          <div className="mt-6 mb-2 px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Simülasyon & Yapay Zeka</div>
          <NavItem icon={<Activity size={18}/>} label="Bilimsel Hesaplama Motoru" isActive={activeTab === 'engine'} onClick={() => setActiveTab('engine')} />
          <NavItem icon={<FlaskConical size={18}/>} label="Senaryo Laboratuvarı" isActive={activeTab === 'scenario'} onClick={() => setActiveTab('scenario')} />
          <NavItem icon={<Play size={18}/>} label="Jüri Demo Modu" isActive={activeTab === 'demo'} onClick={() => setActiveTab('demo')} />
          
          <div className="mt-6 mb-2 px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Sistem Yöneticisi</div>
          <NavItem icon={<Terminal size={18}/>} label="Veri Zaman Çizelgesi" isActive={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
          <NavItem icon={<Database size={18}/>} label="API İzleme (Monitor)" isActive={activeTab === 'api'} onClick={() => setActiveTab('api')} />
          <NavItem icon={<Settings size={18}/>} label="Sistem Ayarları" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </div>

      <div className="p-4 border-t border-admin-border bg-black/20 text-xs font-mono space-y-2">
        <div className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Backend Bağlı</div>
        <div className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Veritabanı Aktif</div>
        <div className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Simülasyon Motoru Hazır</div>
      </div>
    </div>
  );
};
