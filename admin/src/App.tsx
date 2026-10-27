import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  LayoutDashboard, Droplets, Thermometer, FlaskConical, 
  Wind, Leaf, Activity, ArrowRightLeft, History, RotateCcw, 
  Settings, Zap, AlertTriangle, CheckCircle2, ChevronRight,
  Sun, ShieldAlert, ShieldCheck, MapPin
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import CrisisLab from './components/CrisisLab';
import TerraMindLogo from './components/TerraMindLogo';
import { REALISTIC_FARMS } from './data/seedFarms';

const socket = io('http://localhost:3001');

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('admin');
  const [selectedFarmId, setSelectedFarmId] = useState<string>(REALISTIC_FARMS[0].id);
  const [systemState, setSystemState] = useState<any>(null);
  const [effectiveState, setEffectiveState] = useState<any>(null);
  const [impactEvent, setImpactEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const activeFarm = REALISTIC_FARMS.find(f => f.id === selectedFarmId) || REALISTIC_FARMS[0];

  useEffect(() => {
    socket.on('state:init', (data) => {
      setSystemState(data);
      setLoading(false);
    });

    socket.on('state:update', (data) => {
      setSystemState(data);
    });

    socket.on('state:effective', (data) => {
      setEffectiveState(data);
    });

    socket.on('analysis:updated', (data) => {
      setImpactEvent(data);
      setTimeout(() => setImpactEvent(null), 8000); // clear after 8s
    });

    socket.on('farm:init', (farm) => {
      if (farm?.id) setSelectedFarmId(farm.id);
    });

    socket.on('farm:changed', (farm) => {
      if (farm?.id) setSelectedFarmId(farm.id);
    });

    return () => {
      socket.off('state:init');
      socket.off('state:update');
      socket.off('state:effective');
      socket.off('analysis:updated');
      socket.off('farm:init');
      socket.off('farm:changed');
    };
  }, []);

  const handleOverride = async (parameter: string, value: number) => {
    try {
      await fetch('http://localhost:3001/api/admin/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameter, value })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    try {
      if (window.confirm("Tüm simülasyon ve yönetici müdahalelerini kaldırıp gerçek verilere dönmek istediğinize emin misiniz?")) {
        await fetch('http://localhost:3001/api/admin/reset', { method: 'POST' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunScenario = async (name: string, overrides: any) => {
    try {
      await fetch('http://localhost:3001/api/admin/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, overrides })
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !systemState || !effectiveState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1110] text-white">
        <Activity className="animate-spin text-emerald-500 mb-4" size={32} />
        <h2 className="text-xl font-bold tracking-widest text-emerald-500 uppercase">Yükleniyor...</h2>
        <p className="text-slate-400 mt-2 text-sm">TerraMind Yönetim Merkezi başlatılıyor</p>
      </div>
    );
  }

  const isSimulated = Object.keys(systemState.overrides).length > 0;

  const tabs = [
    { id: 'overview', name: 'Yönetim Merkezi', icon: <LayoutDashboard size={18} /> },
    { id: 'crisis-lab', name: 'Saha Kriz Simülasyon Merkezi', icon: <AlertTriangle size={18} className="text-amber-400" /> },
    { id: 'water', name: 'Su Durumu', icon: <Droplets size={18} /> },
    { id: 'soil', name: 'Toprak Besinleri', icon: <FlaskConical size={18} /> },
    { id: 'climate', name: 'Sıcaklık & Hava', icon: <Wind size={18} /> },
    { id: 'impact', name: 'Etki-Tepki', icon: <ArrowRightLeft size={18} /> },
    { id: 'scenarios', name: 'Senaryolar', icon: <Activity size={18} /> },
    { id: 'history', name: 'Geçmiş', icon: <History size={18} /> },
    { id: 'system', name: 'Sistem', icon: <Settings size={18} /> },
  ];

  const calcResults = systemState.calculatedResults || {};
  const waterRes = calcResults.water?.results || {};
  const climateRes = calcResults.climate?.results || {};

  return (
    <div className="flex h-screen bg-[#090E0D] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0E1614] border-r border-[#1B2926] flex flex-col z-10 shadow-2xl">
        <div className="p-5 border-b border-[#1B2926]">
          <div className="flex items-center gap-2.5">
            <TerraMindLogo size={32} badge={true} />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-black text-lg text-white tracking-tight">
                TerraMind <span className="text-emerald-400 text-[9px] bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-mono">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Saha Kriz & Yönetim</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
                      : 'text-slate-400 hover:bg-[#15201D] hover:text-slate-200'
                  }`}
                >
                  {tab.icon} {tab.name}
                  {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-[#1B2926]">
          <div className="mb-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Veri Modu</span>
            {isSimulated ? (
              <span className="flex items-center gap-1 text-amber-400 font-bold"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div> Simülasyon</span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-bold"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Gerçek Veri</span>
            )}
          </div>
          <button 
            onClick={handleReset}
            disabled={!isSimulated}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              isSimulated 
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 shadow-lg' 
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <RotateCcw size={16} /> GERÇEK VERİLERE DÖN
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0B1110] to-[#090E0D]">
        {/* Topbar */}
        <header className="h-16 bg-[#0E1614]/80 backdrop-blur-md border-b border-[#1B2926] flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            {tabs.find(t => t.id === activeTab)?.name}
            {isSimulated && <span className="text-[10px] uppercase bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full font-bold border border-amber-500/30">Müdahale Edildi</span>}
          </h1>
          <div className="flex items-center gap-4">
            {/* Hızlı Tarla Seçici Dropdown */}
            <div className="flex items-center gap-2 bg-[#15201D] py-1.5 px-3 rounded-full border border-[#1B2926]">
              <MapPin size={14} className="text-emerald-400 shrink-0" />
              <span className="text-slate-500 text-xs font-semibold">Tarla:</span>
              <select
                value={selectedFarmId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedFarmId(newId);
                  fetch('http://localhost:3001/api/admin/select-farm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ farmId: newId })
                  }).catch(console.error);
                }}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-1"
              >
                {REALISTIC_FARMS.map(f => (
                  <option key={f.id} value={f.id} className="bg-[#0E1614] text-white">
                    {f.name} ({f.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher / Simulator Badge */}
            <button
              onClick={() => setUserRole(r => r === 'admin' ? 'user' : 'admin')}
              title="Yetki izolasyonunu test etmek için tıklayın (admin / user)"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                userRole === 'admin'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
              }`}
            >
              {userRole === 'admin' ? <ShieldCheck size={14} className="text-amber-400" /> : <ShieldAlert size={14} className="text-rose-400" />}
              <span>Rol: <span className="uppercase font-mono">{userRole}</span></span>
              <span className="text-[10px] text-slate-400 font-normal underline ml-1">Değiştir</span>
            </button>

            <div className="flex items-center gap-2 text-sm bg-[#15201D] py-1.5 px-3 rounded-full border border-[#1B2926]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Bağlantı Aktif
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          
          {/* Notifications / Impact Event Popup */}
          {impactEvent && (
            <div className="absolute top-4 right-8 bg-[#15201D] border border-emerald-500/30 p-5 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                <CheckCircle2 size={16} /> Hesaplamalar Tamamlandı
              </h4>
              <p className="text-sm text-white font-medium mb-3">"{impactEvent.source}" parametresi değiştiği için sistem yeniden değerlendirildi.</p>
              
              {impactEvent.impacts && impactEvent.impacts.length > 0 && (
                <div className="space-y-1 mt-2 border-t border-emerald-500/20 pt-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Etkilenen Modüller:</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {impactEvent.impacts.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5"><ArrowRightLeft size={12} className="text-emerald-500 shrink-0 mt-0.5" /> {imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Saha Kriz Simülasyon Merkezi (Crisis Lab) */}
          {activeTab === 'crisis-lab' && (
            userRole === 'admin' ? (
              <CrisisLab selectedFarmId={selectedFarmId} onSelectFarm={setSelectedFarmId} />
            ) : (
              <div className="p-10 text-center bg-rose-950/30 border border-rose-500/40 rounded-3xl max-w-lg mx-auto my-16 backdrop-blur-md shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <ShieldAlert size={36} />
                </div>
                <h3 className="text-2xl font-black text-white">Erişim Yetkisi Yetersiz</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  "Saha Kriz Simülasyon Merkezi (Crisis Lab)" modülüne yalnızca <code className="bg-rose-900/50 text-rose-300 px-2 py-0.5 rounded font-mono">role === 'admin'</code> yetkisine sahip kullanıcılar erişebilir. Standart kullanıcı/çiftçi hesapları bu modülü görüntüleyemez.
                </p>
                <button
                  onClick={() => setUserRole('admin')}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/40"
                >
                  Admin Olarak Devam Et (role === 'admin')
                </button>
              </div>
            )
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Vitals Overview */}
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {activeFarm.name} ({activeFarm.crop}) — Temel Telemetri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="Toprak Nemi" value={`${effectiveState.soilMoisture}%`} icon={<Droplets className="text-sky-400" />} override={systemState.overrides.soilMoisture} trend={waterRes.stressStatus} trendUp={waterRes.stressStatus === 'Stres Riski'} />
                  <StatCard title="Hava Sıcaklığı" value={`${effectiveState.temperature}°C`} icon={<Thermometer className="text-rose-400" />} override={systemState.overrides.temperature} trend={climateRes.tempStatus} />
                  <StatCard title="pH Değeri" value={effectiveState.pH} icon={<FlaskConical className="text-purple-400" />} override={systemState.overrides.pH} />
                  <StatCard title="Azot (N)" value={`${effectiveState.nitrogen} kg/ha`} icon={<Leaf className="text-emerald-400" />} override={systemState.overrides.nitrogen} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* AI Danışman & Sonuç Özeti */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#15201D] border border-[#1B2926] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-amber-400" /> Hesaplanan Güncel Analiz</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0B1110] p-4 rounded-2xl border border-[#1B2926]">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Su Stresi (FAO-56)</p>
                        <p className={`text-xl font-black ${waterRes.stressStatus === 'Stres Riski' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {waterRes.stressStatus || 'Hesaplanıyor...'}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">{waterRes.irrigationStatus || 'Veri Bekleniyor'}</p>
                      </div>
                      <div className="bg-[#0B1110] p-4 rounded-2xl border border-[#1B2926]">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Bitki Gelişimi (GDD)</p>
                        <p className={`text-xl font-black ${climateRes.growthStatus === 'Stres Riski' ? 'text-rose-500' : 'text-sky-500'}`}>
                          {climateRes.growthStatus || 'Hesaplanıyor...'}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">Günlük Isı Puanı: +{climateRes.dailyGDD || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#15201D] border border-[#1B2926] rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Gerçek Zamanlı Simülasyon Grafiği (Nem)</h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            {time: 'T-3', val: 32}, 
                            {time: 'T-2', val: 31}, 
                            {time: 'T-1', val: 30}, 
                            {time: 'Şimdi', val: effectiveState.soilMoisture}
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1B2926" vertical={false} />
                            <XAxis dataKey="time" stroke="#475569" tick={{fill: '#475569', fontSize: 12}} axisLine={false} />
                            <YAxis stroke="#475569" tick={{fill: '#475569', fontSize: 12}} axisLine={false} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#0B1110', borderColor: '#1B2926', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="val" stroke="#38bdf8" strokeWidth={4} dot={{r: 6, fill: '#38bdf8', strokeWidth: 2, stroke: '#0B1110'}} activeDot={{r: 8}} />
                          </LineChart>
                       </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Sensör Durumları */}
                <div className="bg-[#15201D] border border-[#1B2926] rounded-3xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Fiziksel Sensör Durumu</h3>
                  <div className="space-y-4">
                    {Object.entries(systemState.sensorStatus).map(([sensor, status]: [string, any]) => (
                      <div key={sensor} className="flex items-center justify-between border-b border-[#1B2926] pb-3 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-slate-200 capitalize">{sensor}</p>
                          <p className="text-[10px] text-slate-500 uppercase mt-0.5">Son Senkronizasyon: Az Önce</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider ${
                          status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          status === 'OFFLINE' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'water' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Su & Nem Yönetimi</h2>
                <p className="text-slate-400 mt-2">Toprak nemi ve sulama parametrelerini değiştirerek FAO-56 su dengesi modelinin tepkilerini ölçün.</p>
              </div>
              
              <div className="grid gap-6">
                <ParameterControl 
                  title="Toprak Nemi"
                  unit="%"
                  realValue={systemState.realData.soilMoisture}
                  currentValue={effectiveState.soilMoisture}
                  min={0} max={100}
                  onChange={(v: number) => handleOverride('soilMoisture', v)}
                  desc="Kök bölgesindeki mevcut su oranı. Düşük değerler su stresi hesaplamasını tetikler."
                />
                
                <div className="bg-[#15201D] border border-[#1B2926] p-6 rounded-3xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Etkilenen Modeller</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ImpactResultBox label="Günlük Tüketim (ETc)" value={`${waterRes.ETc || 0} mm`} />
                    <ImpactResultBox label="Su Stresi" value={waterRes.stressStatus || '-'} isDanger={waterRes.stressStatus === 'Stres Riski'} />
                    <ImpactResultBox label="Kullanılabilir Su" value={`${(waterRes.RAW || 0).toFixed(1)} mm`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soil' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Toprak Besinleri & pH</h2>
                <p className="text-slate-400 mt-2">Makro besin elementlerini (NPK) ve kimyasal durumu (pH, EC) simüle edin.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParameterControl 
                  title="Azot (N)" unit="kg/ha"
                  realValue={systemState.realData.nitrogen} currentValue={effectiveState.nitrogen}
                  min={0} max={250} onChange={(v: number) => handleOverride('nitrogen', v)}
                />
                <ParameterControl 
                  title="Fosfor (P)" unit="kg/ha"
                  realValue={systemState.realData.phosphorus} currentValue={effectiveState.phosphorus}
                  min={0} max={150} onChange={(v: number) => handleOverride('phosphorus', v)}
                />
                <ParameterControl 
                  title="Potasyum (K)" unit="kg/ha"
                  realValue={systemState.realData.potassium} currentValue={effectiveState.potassium}
                  min={0} max={300} onChange={(v: number) => handleOverride('potassium', v)}
                />
                <ParameterControl 
                  title="Toprak pH Değeri" unit=""
                  realValue={systemState.realData.pH} currentValue={effectiveState.pH}
                  min={1} max={14} step={0.1} onChange={(v: number) => handleOverride('pH', v)}
                />
              </div>
            </div>
          )}

          {activeTab === 'climate' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Sıcaklık & Hava Koşulları</h2>
                <p className="text-slate-400 mt-2">Sıcaklık, rüzgar ve radyasyon verilerini değiştirerek bitki gelişim modellerini (GDD) test edin.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <ParameterControl 
                  title="Hava Sıcaklığı" unit="°C"
                  realValue={systemState.realData.temperature} currentValue={effectiveState.temperature}
                  min={-10} max={50} onChange={(v: number) => handleOverride('temperature', v)}
                />
                <ParameterControl 
                  title="Rüzgar Hızı" unit="m/s"
                  realValue={systemState.realData.windSpeed} currentValue={effectiveState.windSpeed}
                  min={0} max={40} onChange={(v: number) => handleOverride('windSpeed', v)}
                />
                <ParameterControl 
                  title="Güneş Radyasyonu" unit="MJ/m²"
                  realValue={systemState.realData.radiation} currentValue={effectiveState.radiation}
                  min={0} max={40} step={0.1} onChange={(v: number) => handleOverride('radiation', v)}
                />
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Etki-Tepki Analizi</h2>
                <p className="text-slate-400 mt-2">Değişikliklerin sistem üzerindeki yayılımı (Dependency Graph)</p>
              </div>
              
              <div className="bg-[#15201D] border border-[#1B2926] p-10 rounded-3xl shadow-2xl relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                  
                  {/* Sol: Girdi */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Girdi (Override)</h3>
                    <div className="bg-[#0B1110] border border-amber-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)] relative">
                      {isSimulated ? (
                        <>
                          <div className="absolute -top-3 -right-3 bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">Aktif</div>
                          <p className="text-amber-400 font-bold mb-2">Yönetici Müdahalesi</p>
                          <p className="text-xs text-slate-400">Şu anda gerçek sensör verileri eziliyor. Sistem hesaplamaları bu değerler üzerinden yapılıyor.</p>
                        </>
                      ) : (
                        <>
                          <div className="absolute -top-3 -right-3 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">Normal</div>
                          <p className="text-emerald-400 font-bold mb-2">Gerçek Sensör Verisi</p>
                          <p className="text-xs text-slate-400">Herhangi bir yönetici müdahalesi bulunmuyor. Sistem olağan akışında çalışıyor.</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Orta: Ok */}
                  <div className="hidden md:flex justify-center text-[#1B2926]">
                    <ArrowRightLeft size={48} />
                  </div>

                  {/* Sağ: Çıktılar */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Tepki (Sonuçlar)</h3>
                    <div className="space-y-3">
                       <ImpactRow 
                         label="Su Stresi Durumu" 
                         value={waterRes.stressStatus || '-'} 
                         isDanger={waterRes.stressStatus === 'Stres Riski'} 
                       />
                       <ImpactRow 
                         label="Sulama Önerisi" 
                         value={waterRes.irrigationStatus || '-'} 
                         isDanger={waterRes.irrigationStatus?.includes('Acil')} 
                       />
                       <ImpactRow 
                         label="İklim Gelişim Durumu" 
                         value={climateRes.growthStatus || '-'} 
                         isDanger={climateRes.growthStatus === 'Stres Riski'} 
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Senaryo Simülasyonları</h2>
                <p className="text-slate-400 mt-2">Önceden tanımlanmış kriz senaryolarını tek tuşla sisteme uygulayın.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ScenarioCard 
                  title="Şiddetli Kuraklık" 
                  icon={<Sun className="text-amber-500" size={24} />}
                  description="Toprak nemini %12'ye düşürür, sıcaklığı 40°C'ye çıkarır. Sulama uyarılarını tetikler."
                  onRun={() => handleRunScenario('Şiddetli Kuraklık', { soilMoisture: 12, temperature: 40 })}
                />
                <ScenarioCard 
                  title="Aşırı Yağış / Sel" 
                  icon={<Droplets className="text-sky-500" size={24} />}
                  description="Toprak nemini %100'e çıkarır, sıcaklığı 18°C'ye düşürür. Mantar risklerini artırır."
                  onRun={() => handleRunScenario('Aşırı Yağış', { soilMoisture: 100, temperature: 18 })}
                />
                <ScenarioCard 
                  title="Aşırı Gübreleme (Tuzluluk)" 
                  icon={<FlaskConical className="text-purple-500" size={24} />}
                  description="Azot seviyesini 300'e, Toprak EC (tuzluluk) değerini 6.5 dS/m'ye çıkarır."
                  onRun={() => handleRunScenario('Gübre Stresi', { nitrogen: 300, ec: 6.5 })}
                />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Değişiklik Geçmişi</h2>
                <p className="text-slate-400 mt-2">Sistemde yapılan tüm simülasyon ve müdahale kayıtları.</p>
              </div>
              <div className="bg-[#15201D] border border-[#1B2926] rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0B1110] border-b border-[#1B2926]">
                    <tr>
                      <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Zaman</th>
                      <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Aksiyon</th>
                      <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Parametre</th>
                      <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Önce</th>
                      <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Sonra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemState.history.map((h: any, i: number) => (
                      <tr key={i} className="border-b border-[#1B2926] last:border-0 hover:bg-[#1A2624] transition-colors">
                        <td className="p-5 text-slate-400 font-mono text-xs">{new Date(h.timestamp).toLocaleTimeString()}</td>
                        <td className="p-5 font-bold text-emerald-400">{h.action}</td>
                        <td className="p-5 text-white font-medium">{h.parameter}</td>
                        <td className="p-5 text-slate-400">{h.oldValue}</td>
                        <td className="p-5 text-amber-400 font-bold">{h.newValue}</td>
                      </tr>
                    ))}
                    {systemState.history.length === 0 && (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-500 font-medium">Henüz bir değişiklik yapılmadı.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Subcomponents
function StatCard({ title, value, icon, override, trend, trendUp }: any) {
  return (
    <div className={`bg-[#15201D] p-5 rounded-3xl border-t-2 shadow-lg relative overflow-hidden group ${override !== undefined ? 'border-t-amber-500' : 'border-t-emerald-500'}`}>
      {override !== undefined && (
        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
          Simülasyon
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-[#0B1110] rounded-xl border border-[#1B2926] group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className={`text-4xl font-black tracking-tighter ${override !== undefined ? 'text-amber-400' : 'text-white'}`}>{value}</div>
      {trend && (
        <div className="mt-3 text-xs font-bold flex items-center gap-1 text-slate-400">
          <ArrowRightLeft size={12} className={trendUp ? 'text-rose-400' : 'text-emerald-400'} /> {trend}
        </div>
      )}
    </div>
  );
}

function ParameterControl({ title, unit, realValue, currentValue, min, max, step = 1, onChange, desc }: any) {
  const [val, setVal] = useState(currentValue);
  const isOverridden = realValue !== currentValue;

  return (
    <div className={`bg-[#15201D] p-6 rounded-3xl shadow-lg border transition-colors ${isOverridden ? 'border-amber-500/30' : 'border-[#1B2926]'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{title} {unit && <span className="text-slate-500 font-medium text-sm">({unit})</span>}</h3>
        {isOverridden && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] uppercase font-black px-2 py-1 rounded">Değiştirildi</span>}
      </div>
      {desc && <p className="text-sm text-slate-400 mb-6">{desc}</p>}
      
      <div className="flex items-center gap-6 mb-6 bg-[#0B1110] p-4 rounded-2xl border border-[#1B2926]">
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Gerçek Sensör Verisi</p>
          <p className="text-2xl font-black text-slate-300">{realValue}</p>
        </div>
        <div className="text-[#1B2926]"><ArrowRightLeft size={24} /></div>
        <div className="flex-1 text-right">
          <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">Hesaplamalardaki Veri</p>
          <p className="text-2xl font-black text-amber-400">{currentValue}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input 
          type="range" 
          min={min} max={max} step={step}
          value={val} 
          onChange={(e) => setVal(parseFloat(e.target.value))}
          className="flex-1 accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <input 
          type="number" 
          min={min} max={max} step={step}
          value={val}
          onChange={(e) => setVal(parseFloat(e.target.value))}
          className="w-24 bg-[#0B1110] border border-[#1B2926] text-white font-bold rounded-xl p-3 text-center focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => onChange(val)}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-xl transition-colors uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          Değişikliği Sisteme Uygula
        </button>
      </div>
    </div>
  );
}

function ImpactResultBox({ label, value, isDanger }: any) {
  return (
    <div className={`p-4 rounded-2xl border ${isDanger ? 'bg-rose-500/10 border-rose-500/20' : 'bg-[#0B1110] border-[#1B2926]'}`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-black ${isDanger ? 'text-rose-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function ImpactRow({ label, value, isDanger }: any) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${isDanger ? 'bg-rose-500/10 border-rose-500/30' : 'bg-[#0B1110] border-[#1B2926]'}`}>
      <span className="font-semibold text-slate-300">{label}</span>
      <span className={`font-black ${isDanger ? 'text-rose-400' : 'text-emerald-400'}`}>
        {value}
      </span>
    </div>
  );
}

function ScenarioCard({ title, description, icon, onRun }: any) {
  return (
    <div className="bg-[#15201D] border border-slate-700 hover:border-emerald-500/50 p-6 rounded-3xl flex flex-col h-full transition-all group shadow-xl">
      <div className="bg-[#0B1110] w-12 h-12 rounded-2xl flex items-center justify-center border border-[#1B2926] mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{description}</p>
      <button 
        onClick={onRun}
        className="bg-slate-800 hover:bg-emerald-500 text-white hover:text-black font-bold w-full py-3 rounded-xl transition-colors uppercase tracking-wider text-xs"
      >
        Senaryoyu Başlat
      </button>
    </div>
  );
}

export default App;
