import React, { useState, useEffect, useRef } from 'react';
import { Leaf, CloudSun, Bell, User, MapPin, ChevronDown, RefreshCw, CheckCircle2, Maximize, Navigation, Sparkles, Droplets, ArrowUpRight, ThermometerSun, ArrowDownRight, Sprout, Zap, AlertTriangle, Compass, Target, Clock, AlertCircle, CheckSquare, Activity } from 'lucide-react';
import { Field } from '../types';
import { mapOverlays, mockFields, mockTasks, mapLegends, mockWeather } from '../mockData';

interface HomeTabProps {
  selectedField: Field;
  onSelectField: (id: string) => void;
  onOpenDetail: (title: string) => void;
  onSwitchToAi: (context?: string) => void;
  onSwitchToProfile: () => void;
  onSwitchToFields: () => void;
}

export default function HomeTab({ selectedField, onSelectField, onOpenDetail, onSwitchToAi, onSwitchToProfile, onSwitchToFields }: HomeTabProps) {
  const [activeLayer, setActiveLayer] = useState('Toprak Nemi');
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const [selectedRegionInfo, setSelectedRegionInfo] = useState<{ x: number, y: number, name: string, value: string, status: string } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const overlays = mapOverlays[activeLayer] || mapOverlays['Toprak Nemi'];

  const handleRegionInteract = (e: React.MouseEvent | React.TouchEvent, regionName: string, value: string, status: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Quick timeout to distinguish from scrolling
    timerRef.current = setTimeout(() => {
      setSelectedRegionInfo({ x: clientX, y: clientY, name: regionName, value, status });
    }, 400); // 400ms long press simulation
  };

  const handleRegionRelease = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Close popup if clicking elsewhere
  useEffect(() => {
    const closePopup = () => setSelectedRegionInfo(null);
    window.addEventListener('click', closePopup);
    window.addEventListener('touchend', handleRegionRelease);
    return () => {
      window.removeEventListener('click', closePopup);
      window.removeEventListener('touchend', handleRegionRelease);
    };
  }, []);

  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#F4FAF5]/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {/* TerraMind Logo Minimized */}
          <div className="flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="#1B331B"/>
              <path d="M16 8C13.2 8 11.5 9.5 11 12H13.2C13.6 10.6 14.6 10 16 10C17.7 10 18.8 11.2 18.8 13C18.8 15 16 15 16 18V19H18V18.2C18 16.5 21 16 21 13C21 10.2 18.8 8 16 8Z" fill="#A5D6A7"/>
              <circle cx="17" cy="22" r="1.5" fill="#A5D6A7"/>
              <path d="M8 24C10.5 24 13 22.5 14 20H11.5C10.8 21.5 9.5 22 8 22V24Z" fill="#4CAF50"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-bold tracking-tight text-[#1B331B]">TerraMind</h1>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CAF50] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4CAF50]"></span>
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#597360]">Canlı Veri Akışı</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => onOpenDetail('weather')} className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95">
            <CloudSun className="h-4 w-4 text-[#597360]" />
            <span className="text-sm font-semibold text-[#1B331B]">{mockWeather.currentTemp}°</span>
          </button>
          <button onClick={() => onOpenDetail('notifications')} className="relative text-[#1B331B] transition-transform hover:scale-110 active:scale-95">
            <Bell className="h-6 w-6" strokeWidth={1.5} />
            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full border-2 border-[#F4FAF5] bg-[#E53935]"></span>
          </button>
          <button onClick={onSwitchToProfile} className="h-9 w-9 overflow-hidden rounded-full border border-[#D2E6D7] bg-white transition-transform hover:scale-110 active:scale-95">
            <User className="h-full w-full p-1.5 text-[#8EA694]" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-6 pt-2 pb-6">
        {/* Active Field Card & Status */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 relative">
          <div className="flex-1 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1B331B]">{selectedField.name}</h2>
                <div className="mt-1 flex items-center space-x-1.5 text-sm text-[#597360]">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedField.location} • {selectedField.area}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsFieldSelectorOpen(!isFieldSelectorOpen)}
                className="flex items-center space-x-1 rounded-full bg-[#F4FAF5] px-3 py-1.5 text-sm font-medium text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]"
              >
                <span>Değiştir</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFieldSelectorOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#8EA694]">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Son senkronizasyon: {selectedField.lastSync}</span>
            </div>
            
            {/* Field Selector Dropdown */}
            {isFieldSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-10 bg-white rounded-[16px] shadow-lg border border-[#E8F1EA] overflow-hidden">
                {mockFields.map(field => (
                  <button 
                    key={field.id}
                    onClick={() => { onSelectField(field.id); setIsFieldSelectorOpen(false); }}
                    className={`w-full text-left px-4 py-3 border-b border-[#E8F1EA] last:border-b-0 hover:bg-[#F4FAF5] transition-colors ${field.id === selectedField.id ? 'bg-[#F4FAF5]' : ''}`}
                  >
                    <div className="font-semibold text-[#1B331B]">{field.name}</div>
                    <div className="text-xs text-[#597360]">{field.location} • {field.area}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Overall Status Expanded Card */}
          <div className="grid grid-cols-2 gap-4 rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Genel Sağlık</span>
              <div className="mt-1 flex items-center space-x-2">
                {selectedField.status === 'Sağlıklı' ? <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" /> : 
                 selectedField.status === 'Dikkat' ? <AlertTriangle className="h-5 w-5 text-[#FF9800]" /> : 
                 <AlertTriangle className="h-5 w-5 text-[#F44336]" />}
                <span className={`font-bold ${
                  selectedField.status === 'Sağlıklı' ? 'text-[#1B331B]' : 
                  selectedField.status === 'Dikkat' ? 'text-[#E65100]' : 'text-[#C62828]'
                }`}>{selectedField.status}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Hava Etkisi</span>
              <div className="mt-1 flex items-center space-x-2">
                <CloudSun className={`h-5 w-5 ${selectedField.weatherImpact === 'Olumlu' ? 'text-[#4CAF50]' : 'text-[#FF9800]'}`} />
                <span className="font-bold text-[#1B331B]">{selectedField.weatherImpact}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">AI Güveni</span>
              <div className="mt-1 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-[#2196F3]" />
                <span className="font-bold text-[#1B331B]">%{selectedField.aiConfidence}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Sonraki Aksiyon</span>
              <div className="mt-1 flex items-center space-x-2">
                <Target className="h-5 w-5 text-[#7B1FA2]" />
                <span className="font-bold text-[#1B331B] truncate">{selectedField.nextAction}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Kritik Uyarılar</span>
              <div className="mt-1 flex items-center space-x-2">
                <AlertCircle className={`h-5 w-5 ${selectedField.criticalAlerts > 0 ? 'text-[#F44336]' : 'text-[#4CAF50]'}`} />
                <span className="font-bold text-[#1B331B]">{selectedField.criticalAlerts}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Aktif Sensörler</span>
              <div className="mt-1 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-[#00BCD4]" />
                <span className="font-bold text-[#1B331B]">{selectedField.activeSensors}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Bugünkü Görevler</span>
              <div className="mt-1 flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-[#FF9800]" />
                <span className="font-bold text-[#1B331B]">{selectedField.tasksCount}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-[#8EA694]">Son Güncelleme</span>
              <div className="mt-1 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#8EA694]" />
                <span className="font-bold text-[#1B331B]">{selectedField.lastSync}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Satellite Field Map */}
        <div className="rounded-[24px] bg-white p-2 shadow-[0_4px_24px_rgb(0,0,0,0.04)] relative">
          <div className="absolute right-4 top-4 z-10 flex items-center space-x-2 bg-black/40 px-2 py-1 rounded text-white text-[10px] backdrop-blur-sm">
            <RefreshCw className="h-3 w-3" />
            <span>Senkronize: {selectedField.lastSync}</span>
          </div>

          {/* Map Layers (Chips) */}
          <div className="no-scrollbar mb-3 flex overflow-x-auto px-2 pb-2 pt-2 space-x-2">
            {Object.keys(mapOverlays).map((layer) => (
              <button 
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${activeLayer === layer ? 'bg-[#1B331B] text-white shadow-md' : 'bg-[#F4FAF5] text-[#597360] hover:bg-[#E8F1EA]'}`}
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Map View */}
          <div className="group relative h-[320px] w-full overflow-hidden rounded-[16px] bg-[#122619] sm:h-[400px]">
            {/* North Compass */}
            <div className="absolute top-4 left-4 z-10 flex flex-col items-center bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm">
              <span className="text-[10px] font-bold text-[#1B331B] leading-none mb-0.5">K</span>
              <Compass className="h-4 w-4 text-[#F44336]" />
            </div>

            {/* Base Satellite Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-300"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586772658825-97b77ce46dc2?q=80&w=1000&auto=format&fit=crop')" }}
            ></div>
            
            {/* Field Overlay SVG */}
            <svg className="absolute inset-0 h-full w-full drop-shadow-lg transition-colors duration-500" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon 
                points="10,20 80,10 90,80 20,90" 
                fill="transparent" 
                stroke="#FFFFFF" 
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              {/* Zone Overlays */}
              <polygon 
                points="10,20 40,15 45,50 20,40" 
                fill={overlays[0]} 
                className="transition-all duration-500 cursor-pointer hover:opacity-90" 
                onMouseDown={(e) => handleRegionInteract(e, 'Kuzeybatı Bölgesi', '42%', 'Sağlıklı')}
                onTouchStart={(e) => handleRegionInteract(e, 'Kuzeybatı Bölgesi', '42%', 'Sağlıklı')}
                onMouseUp={handleRegionRelease}
                onMouseLeave={handleRegionRelease}
              />
              <polygon 
                points="40,15 80,10 75,60 45,50" 
                fill={overlays[1]} 
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
                onMouseDown={(e) => handleRegionInteract(e, 'Kuzeydoğu Bölgesi', '28%', 'Dikkat')}
                onTouchStart={(e) => handleRegionInteract(e, 'Kuzeydoğu Bölgesi', '28%', 'Dikkat')}
                onMouseUp={handleRegionRelease}
                onMouseLeave={handleRegionRelease}
              />
              <polygon 
                points="45,50 75,60 90,80 60,85" 
                fill={overlays[2]} 
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
                onMouseDown={(e) => handleRegionInteract(e, 'Güneydoğu Bölgesi', '55%', 'Sağlıklı')}
                onTouchStart={(e) => handleRegionInteract(e, 'Güneydoğu Bölgesi', '55%', 'Sağlıklı')}
                onMouseUp={handleRegionRelease}
                onMouseLeave={handleRegionRelease}
              />
              <polygon 
                points="20,40 45,50 60,85 20,90" 
                fill={overlays[3]} 
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
                onMouseDown={(e) => handleRegionInteract(e, 'Güneybatı Bölgesi', '60%', 'Sağlıklı')}
                onTouchStart={(e) => handleRegionInteract(e, 'Güneybatı Bölgesi', '60%', 'Sağlıklı')}
                onMouseUp={handleRegionRelease}
                onMouseLeave={handleRegionRelease}
              />
            </svg>

            {/* Sensor Markers */}
            <div className="absolute" style={{ top: '30%', left: '30%' }}>
              <div className="h-3 w-3 bg-white rounded-full shadow-md border-2 border-[#1B331B] animate-pulse"></div>
            </div>
            <div className="absolute" style={{ top: '60%', left: '70%' }}>
              <div className="h-3 w-3 bg-white rounded-full shadow-md border-2 border-[#1B331B]"></div>
            </div>

            {/* Scale Indicator */}
            <div className="absolute bottom-4 right-16 z-10 flex flex-col items-center">
              <div className="w-16 border-b-2 border-white/80 h-1 mb-0.5 relative">
                <div className="absolute left-0 -top-1 h-2 w-0.5 bg-white/80"></div>
                <div className="absolute right-0 -top-1 h-2 w-0.5 bg-white/80"></div>
              </div>
              <span className="text-[9px] font-bold text-white drop-shadow-md">50m</span>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
              <button onClick={() => onOpenDetail('fullscreen-map')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1B331B] shadow-md backdrop-blur-sm transition-transform hover:scale-105">
                <Maximize className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1B331B] shadow-md backdrop-blur-sm transition-transform hover:scale-105">
                <Navigation className="h-5 w-5" />
              </button>
            </div>

            {/* Dynamic Legend */}
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 p-3 shadow-md backdrop-blur-sm z-10 pointer-events-none">
              <div className="space-y-1.5 text-[10px] font-bold text-[#1B331B]">
                {(mapLegends[activeLayer] || mapLegends['Toprak Nemi']).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color.replace('0.6', '1').replace('0.4', '1') }}></span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Popover info window when long pressing */}
          {selectedRegionInfo && (
            <div 
              className="fixed z-[100] bg-white rounded-xl shadow-xl p-4 w-48 border border-[#E8F1EA] pointer-events-none transition-opacity animate-in fade-in zoom-in-95 duration-200"
              style={{
                left: Math.min(selectedRegionInfo.x, window.innerWidth - 200),
                top: Math.max(selectedRegionInfo.y - 120, 80)
              }}
            >
              <h4 className="font-bold text-[#1B331B] text-sm mb-2">{selectedRegionInfo.name}</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#597360]">{activeLayer}</span>
                  <span className="font-bold text-[#1B331B]">{selectedRegionInfo.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#597360]">Durum</span>
                  <span className={`font-bold ${
                    selectedRegionInfo.status === 'Sağlıklı' ? 'text-[#4CAF50]' : 
                    selectedRegionInfo.status === 'Dikkat' ? 'text-[#FF9800]' : 'text-[#F44336]'
                  }`}>{selectedRegionInfo.status}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-[#E8F1EA]">
                  <span className="text-[#8EA694] text-[10px]">Son Güncelleme</span>
                  <span className="text-[#8EA694] text-[10px] font-medium">12 dk önce</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Card */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#1B331B] p-6 text-white shadow-xl">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white opacity-5 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex items-start space-x-4">
            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2D5A27]">
              <Sparkles className="h-5 w-5 text-[#A5D6A7]" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-white">Yapay Zekâ Analizi</h3>
              <p className="mb-5 text-[15px] leading-relaxed text-[#D2E6D7]">
                {selectedField.aiSummary}
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenDetail('ai-analysis'); }}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1B331B] shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Detaylı Analiz
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onSwitchToAi(`Bana ${selectedField.name} tarlamın genel durumu hakkında daha fazla bilgi verebilir misin?`); }}
                  className="rounded-full bg-[#2D5A27] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d7037]"
                >
                  Yapay Zekaya Sor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1B331B]">Bugünkü Görevler</h3>
            <span className="text-sm font-semibold text-[#597360]">{mockTasks.length} Görev</span>
          </div>
          <div className="space-y-3">
            {mockTasks.map(task => (
              <div key={task.id} className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 h-3 w-3 rounded-full ${task.priority === 'High' ? 'bg-[#F44336]' : task.priority === 'Medium' ? 'bg-[#FF9800]' : 'bg-[#4CAF50]'}`}></div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B331B]">{task.title}</h4>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-[#8EA694]">
                      <MapPin className="h-3 w-3" />
                      <span>{task.field}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>Tahmini: {task.duration}</span>
                    </div>
                  </div>
                </div>
                <button className="self-start sm:self-auto rounded-full bg-[#F4FAF5] px-4 py-2 text-xs font-bold text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]">
                  {task.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Summary */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-[#1B331B]">Sensör Özeti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Moisture */}
            <div className="relative rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="cursor-pointer active:scale-[0.98]" onClick={() => onOpenDetail('sensor-moisture')}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1976D2]">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-bold ${selectedField.sensors.moisture.status === 'up' ? 'text-[#4CAF50]' : selectedField.sensors.moisture.status === 'down' ? 'text-[#E53935]' : 'text-[#8EA694]'}`}>
                    {selectedField.sensors.moisture.status === 'up' ? <ArrowUpRight className="h-3 w-3" /> : selectedField.sensors.moisture.status === 'down' ? <ArrowDownRight className="h-3 w-3" /> : null}
                    <span>{Math.abs(selectedField.sensors.moisture.change)}%</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#597360]">Toprak Nemi</p>
                <p className="mt-1 text-2xl font-bold text-[#1B331B]">%{selectedField.sensors.moisture.value}</p>
                <p className="mt-2 text-[11px] text-[#597360] flex items-start space-x-1">
                  <Sparkles className="h-3 w-3 mt-0.5 text-[#2196F3]" />
                  <span>{selectedField.sensors.moisture.recommendation}</span>
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onSwitchToAi(`Toprak nemi %${selectedField.sensors.moisture.value} seviyesinde. Ne yapmalıyım?`); }} className="mt-3 w-full rounded-lg bg-[#F4FAF5] py-2 text-xs font-semibold text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]">
                AI'ya Sor
              </button>
            </div>
            
            {/* Temperature */}
            <div className="relative rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="cursor-pointer active:scale-[0.98]" onClick={() => onOpenDetail('sensor-temperature')}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF3E0] text-[#F57C00]">
                    <ThermometerSun className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-bold ${selectedField.sensors.temperature.status === 'up' ? 'text-[#E53935]' : selectedField.sensors.temperature.status === 'down' ? 'text-[#4CAF50]' : 'text-[#8EA694]'}`}>
                    {selectedField.sensors.temperature.status === 'up' ? <ArrowUpRight className="h-3 w-3" /> : selectedField.sensors.temperature.status === 'down' ? <ArrowDownRight className="h-3 w-3" /> : null}
                    <span>{Math.abs(selectedField.sensors.temperature.change)}°</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#597360]">Sıcaklık</p>
                <p className="mt-1 text-2xl font-bold text-[#1B331B]">{selectedField.sensors.temperature.value}°C</p>
                <p className="mt-2 text-[11px] text-[#597360] flex items-start space-x-1">
                  <Sparkles className="h-3 w-3 mt-0.5 text-[#2196F3]" />
                  <span>{selectedField.sensors.temperature.recommendation}</span>
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onSwitchToAi(`Sıcaklık ${selectedField.sensors.temperature.value}°C. Bitkiler için risk oluşturur mu?`); }} className="mt-3 w-full rounded-lg bg-[#F4FAF5] py-2 text-xs font-semibold text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]">
                AI'ya Sor
              </button>
            </div>

            {/* Nitrogen */}
            <div className="relative rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="cursor-pointer active:scale-[0.98]" onClick={() => onOpenDetail('sensor-nitrogen')}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5E9] text-[#388E3C]">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-bold ${selectedField.sensors.nitrogen.status === 'up' ? 'text-[#4CAF50]' : selectedField.sensors.nitrogen.status === 'down' ? 'text-[#E53935]' : 'text-[#8EA694]'}`}>
                    {selectedField.sensors.nitrogen.status === 'up' ? <ArrowUpRight className="h-3 w-3" /> : selectedField.sensors.nitrogen.status === 'down' ? <ArrowDownRight className="h-3 w-3" /> : null}
                    <span>{Math.abs(selectedField.sensors.nitrogen.change)}</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#597360]">Azot (N)</p>
                <p className="mt-1 flex items-baseline space-x-1 text-2xl font-bold text-[#1B331B]">
                  <span>{selectedField.sensors.nitrogen.value}</span>
                  <span className="text-sm font-medium text-[#8EA694]">ppm</span>
                </p>
                <p className="mt-2 text-[11px] text-[#597360] flex items-start space-x-1">
                  <Sparkles className="h-3 w-3 mt-0.5 text-[#2196F3]" />
                  <span>{selectedField.sensors.nitrogen.recommendation}</span>
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onSwitchToAi(`Azot seviyesi ${selectedField.sensors.nitrogen.value} ppm. Gübreleme yapmalı mıyım?`); }} className="mt-3 w-full rounded-lg bg-[#F4FAF5] py-2 text-xs font-semibold text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]">
                AI'ya Sor
              </button>
            </div>

            {/* pH */}
            <div className="relative rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
              <div className="cursor-pointer active:scale-[0.98]" onClick={() => onOpenDetail('sensor-ph')}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3E5F5] text-[#7B1FA2]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-bold ${selectedField.sensors.ph.status === 'up' ? 'text-[#4CAF50]' : selectedField.sensors.ph.status === 'down' ? 'text-[#E53935]' : 'text-[#8EA694]'}`}>
                    {selectedField.sensors.ph.status === 'up' ? <ArrowUpRight className="h-3 w-3" /> : selectedField.sensors.ph.status === 'down' ? <ArrowDownRight className="h-3 w-3" /> : <span>-</span>}
                    {selectedField.sensors.ph.status !== 'stable' && <span>{Math.abs(selectedField.sensors.ph.change)}</span>}
                  </div>
                </div>
                <p className="text-xs font-medium text-[#597360]">Toprak pH</p>
                <p className="mt-1 text-2xl font-bold text-[#1B331B]">{selectedField.sensors.ph.value}</p>
                <p className="mt-2 text-[11px] text-[#597360] flex items-start space-x-1">
                  <Sparkles className="h-3 w-3 mt-0.5 text-[#2196F3]" />
                  <span>{selectedField.sensors.ph.recommendation}</span>
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onSwitchToAi(`pH değeri ${selectedField.sensors.ph.value}. Kireçleme gibi bir önlem almalı mıyım?`); }} className="mt-3 w-full rounded-lg bg-[#F4FAF5] py-2 text-xs font-semibold text-[#2D5A27] transition-colors hover:bg-[#E8F1EA]">
                AI'ya Sor
              </button>
            </div>
          </div>
        </div>

        {/* Irrigation Status */}
        <div 
          onClick={() => onOpenDetail('irrigation')}
          className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="flex-1 rounded-[20px] bg-[#E3F2FD] p-5 shadow-sm">
            <div className="mb-2 flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-[#1976D2]" />
              <h3 className="font-bold text-[#1B331B]">Sulama Durumu</h3>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-[#597360]">Şu an</p>
                <p className={`font-semibold ${selectedField.irrigation.current === 'Açık' ? 'text-[#1976D2]' : 'text-[#1B331B]'}`}>{selectedField.irrigation.current}</p>
              </div>
              <div>
                <p className="text-[#597360]">Sıradaki</p>
                <p className="font-semibold text-[#1B331B]">{selectedField.irrigation.next}</p>
              </div>
              <div>
                <p className="text-[#597360]">Kapsam</p>
                <p className="font-semibold text-[#1B331B]">%{selectedField.irrigation.coverage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div onClick={onSwitchToFields} className="rounded-[16px] bg-white p-3 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow active:scale-95">
            <p className="text-[11px] font-medium text-[#597360]">Toplam Tarla</p>
            <p className="mt-1 text-lg font-bold text-[#1B331B]">3</p>
          </div>
          <div onClick={() => onOpenDetail('sensors-list')} className="rounded-[16px] bg-white p-3 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer hover:shadow-md transition-shadow active:scale-95">
            <p className="text-[11px] font-medium text-[#597360]">Aktif Sensör</p>
            <p className="mt-1 text-lg font-bold text-[#1B331B]">24</p>
          </div>
          <div onClick={() => onOpenDetail('alerts-list')} className="rounded-[16px] bg-[#FFF3E0] p-3 text-center cursor-pointer hover:shadow-md transition-shadow active:scale-95">
            <p className="text-[11px] font-medium text-[#E65100]">Uyarılar</p>
            <p className="mt-1 text-lg font-bold text-[#E65100]">{selectedField.status === 'Kritik' ? '3' : selectedField.status === 'Dikkat' ? '1' : '0'}</p>
          </div>
        </div>
      </main>
    </>
  );
}

