import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { ScenarioLab } from './components/ScenarioLab';
import { ScientificEngine } from './components/ScientificEngine';
import { SystemEvents } from './components/SystemEvents';
import { ApiMonitor } from './components/ApiMonitor';
import { DemoMode } from './components/DemoMode';
import { WeatherControl } from './components/WeatherControl';
import { SoilControl } from './components/SoilControl';
import { IrrigationControl } from './components/IrrigationControl';
// import { FieldControl } from './components/FieldControl'; // To be implemented

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [state, setState] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  useEffect(() => {
    const evtSource = new EventSource('http://localhost:5000/api/live-sync');
    evtSource.onmessage = (event) => {
      setState(JSON.parse(event.data));
    };
    return () => evtSource.close();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const triggerScenario = async (scenario: string, name: string, overrides: any) => {
    await fetch('http://localhost:5000/api/admin/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, name, overrides })
    });
    showToast(`Senaryo tetiklendi: ${name.toUpperCase()}`);
  };

  const triggerOverride = async (param: string, value: number | null) => {
    await fetch('http://localhost:5000/api/admin/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ param, value })
    });
    showToast(`${param} değeri güncellendi: ${value}`);
  };

  const triggerReset = async () => {
    await fetch('http://localhost:5000/api/admin/reset', { method: 'POST' });
    showToast('Sistem gerçek verilere sıfırlandı.');
  };

  const startDemo = async () => {
    showToast('Demo başlatılıyor...');
    // Demo implementation will go here
  };

  return (
    <div className="flex h-screen bg-admin-bg text-zinc-300 font-sans selection:bg-brand-green/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar toast={toast} triggerReset={triggerReset} startDemo={startDemo} />

        <main className="flex-1 overflow-y-auto p-6">
           {activeTab === 'overview' && <Overview state={state} />}
           {activeTab === 'scenario' && <ScenarioLab state={state} triggerScenario={triggerScenario} />}
           {activeTab === 'weather' && <WeatherControl state={state} triggerOverride={triggerOverride} />}
           {activeTab === 'soil' && <SoilControl state={state} triggerOverride={triggerOverride} />}
           {activeTab === 'irrigation' && <IrrigationControl state={state} triggerOverride={triggerOverride} />}
           {activeTab === 'engine' && <ScientificEngine state={state} />}
           {activeTab === 'timeline' && <SystemEvents logs={state?.logs} />}
           {activeTab === 'api' && <ApiMonitor />}
           {activeTab === 'demo' && <DemoMode triggerScenario={triggerScenario} triggerReset={triggerReset} />}
           
           {/* Fallback for under construction tabs */}
           {['fields', 'sensors', 'settings'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center h-[60vh] text-center">
               <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                 <span className="text-2xl animate-spin">⚙️</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Bu modül geliştiriliyor...</h3>
               <p className="text-zinc-500 max-w-md">Kullanıcı istekleri doğrultusunda {activeTab.toUpperCase()} modülü için entegrasyonlar devam etmektedir.</p>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

export default App;
