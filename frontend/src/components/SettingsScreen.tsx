import React from 'react';
import { ArrowLeft, ChevronRight, Moon, Globe, Bell, Map, Cpu, Activity, User } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout?: () => void;
}

export default function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const settingsGroups = [
    {
      title: 'Genel',
      items: [
        { icon: Moon, label: 'Uygulama Teması', value: 'Sistem (Açık)' },
        { icon: Globe, label: 'Dil', value: 'Türkçe' },
        { icon: Bell, label: 'Bildirimler', value: 'Açık' },
      ]
    },
    {
      title: 'Harita & Yapay Zeka',
      items: [
        { icon: Map, label: 'Harita Ayarları', value: 'Uydu' },
        { icon: Cpu, label: 'AI Tercihleri', value: 'Detaylı' },
        { icon: Activity, label: 'Sensör Tercihleri', value: 'Optimize' },
      ]
    },
    {
      title: 'Hesap',
      items: [
        { icon: User, label: 'Hesap Ayarları', value: 'Misafir' },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="flex min-h-screen flex-col bg-[#F4FAF5]"
    >
      <header className="sticky top-0 z-50 flex items-center bg-[#F4FAF5]/80 px-4 py-4 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-4 text-lg font-bold text-[#1B331B]">Ayarlar</h1>
      </header>

      <main className="flex-1 px-4 py-4 space-y-6">
        {settingsGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-[#597360] ml-4 mb-3">{group.title}</h3>
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-[#F4FAF5] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#E8F1EA] h-10 w-10 rounded-full flex items-center justify-center text-[#4CAF50]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-[#1B331B]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#8EA694]">{item.value}</span>
                      <ChevronRight className="h-5 w-5 text-[#8EA694]" />
                    </div>
                  </button>
                  {itemIdx !== group.items.length - 1 && <div className="h-[1px] w-full bg-[#E8F1EA] ml-16" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </motion.div>
  );
}
