import React, { useState } from 'react';
import { ArrowLeft, Maximize2, Layers, AlertCircle, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mapOverlays, mockFields } from '../mockData';

interface FullscreenMapScreenProps {
  onBack: () => void;
  selectedFieldId: string;
}

export default function FullscreenMapScreen({ onBack, selectedFieldId }: FullscreenMapScreenProps) {
  const [activeLayer, setActiveLayer] = useState('Toprak Nemi');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const field = mockFields.find(f => f.id === selectedFieldId) || mockFields[0];
  const overlays = mapOverlays[activeLayer] || mapOverlays['Toprak Nemi'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="fixed inset-0 z-[100] bg-[#122619] flex flex-col"
    >
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 md:py-6 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={onBack}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-center">
          <h1 className="text-sm font-bold">{field.name}</h1>
          <p className="text-[10px] text-white/70">{activeLayer} Haritası</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
          <Layers className="h-5 w-5" />
        </button>
      </header>

      {/* Map Layers (Chips) Overlay */}
      <div className="absolute top-24 left-0 right-0 z-10 no-scrollbar flex overflow-x-auto px-4 pb-2 space-x-2">
        {Object.keys(mapOverlays).map((layer) => (
          <button 
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors backdrop-blur-md shadow-md ${
              activeLayer === layer ? 'bg-[#4CAF50] text-white border border-[#4CAF50]' : 'bg-black/40 text-white border border-white/10 hover:bg-black/60'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Base Satellite Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586772658825-97b77ce46dc2?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        
        {/* Field Overlay SVG */}
        <svg className="absolute inset-0 h-full w-full drop-shadow-2xl transition-colors duration-500" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <polygon 
            points="5,15 90,5 95,85 10,95" 
            fill="transparent" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />
          {/* Zone Overlays */}
          <polygon 
            points="5,15 45,10 50,45 15,35" 
            fill={overlays[0]} 
            className={`transition-all duration-300 cursor-pointer ${selectedRegion === 'Kuzeybatı' ? 'stroke-white stroke-[0.5]' : 'hover:opacity-80'}`} 
            onClick={() => setSelectedRegion('Kuzeybatı')}
          />
          <polygon 
            points="45,10 90,5 85,55 50,45" 
            fill={overlays[1]} 
            className={`transition-all duration-300 cursor-pointer ${selectedRegion === 'Kuzeydoğu' ? 'stroke-white stroke-[0.5]' : 'hover:opacity-80'}`} 
            onClick={() => setSelectedRegion('Kuzeydoğu')}
          />
          <polygon 
            points="50,45 85,55 95,85 55,90" 
            fill={overlays[2]} 
            className={`transition-all duration-300 cursor-pointer ${selectedRegion === 'Güneydoğu' ? 'stroke-white stroke-[0.5]' : 'hover:opacity-80'}`} 
            onClick={() => setSelectedRegion('Güneydoğu')}
          />
          <polygon 
            points="15,35 50,45 55,90 10,95" 
            fill={overlays[3]} 
            className={`transition-all duration-300 cursor-pointer ${selectedRegion === 'Güneybatı' ? 'stroke-white stroke-[0.5]' : 'hover:opacity-80'}`} 
            onClick={() => setSelectedRegion('Güneybatı')}
          />
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-6 pb-safe"
          >
            <div className="w-12 h-1.5 bg-[#E8F1EA] rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1B331B]">{selectedRegion} Bölgesi</h2>
                <p className="text-sm text-[#597360]">Analiz Katmanı: {activeLayer}</p>
              </div>
              <button onClick={() => setSelectedRegion(null)} className="h-8 w-8 bg-[#F4FAF5] text-[#1B331B] rounded-full flex items-center justify-center font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F4FAF5] rounded-[16px] p-4">
                <p className="text-xs font-medium text-[#597360] mb-1">Mevcut Durum</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-[#1B331B]">{
                    selectedRegion === 'Kuzeybatı' ? '42%' : 
                    selectedRegion === 'Kuzeydoğu' ? '28%' : 
                    selectedRegion === 'Güneydoğu' ? '55%' : '60%'
                  }</span>
                  <span className="text-sm font-semibold text-[#FF9800] mb-1 flex items-center">
                    Dikkat
                  </span>
                </div>
              </div>
              <div className="bg-[#F4FAF5] rounded-[16px] p-4">
                <p className="text-xs font-medium text-[#597360] mb-1">Tarihsel Ortalama</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-[#1B331B]">45%</span>
                  <span className="text-xs font-medium text-[#8EA694] mb-1">Geçen Yıl</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1B331B] text-white rounded-[20px] p-5 relative overflow-hidden shadow-lg">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white opacity-5 blur-xl"></div>
              <div className="flex gap-3 relative z-10">
                <Sparkles className="h-6 w-6 text-[#A5D6A7] shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-sm">Yapay Zeka Yorumu</h4>
                  <p className="text-sm text-[#D2E6D7] leading-relaxed">
                    Bu bölgede {activeLayer.toLowerCase()} seviyesi optimum değerin altında. Diğer bölgelere göre %15 daha fazla kayıp tespit edildi. Acil aksiyon önerilir.
                  </p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-[#4CAF50] text-white font-bold rounded-full py-4 shadow-md transition-transform active:scale-[0.98]">
              Aksiyon Planı Oluştur
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
