import React, { useState } from 'react';
import { ArrowLeft, Moon, Globe, Bell, Map, Cpu, Activity, User, ChevronRight, Check, X } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

interface SettingsScreenProps {
  onBack: () => void;
}

type SettingKey = 'theme' | 'language' | 'mapType' | 'aiPref' | 'sensorPref' | null;

// Dil Çeviri Sözlüğü (Anlık dil değişimi için)
const translations = {
  'Türkçe': {
    title: 'Ayarlar', general: 'Genel', themeTitle: 'Uygulama Teması', langTitle: 'Dil', notifTitle: 'Bildirimler',
    mapAi: 'Harita & Yapay Zeka', mapSetting: 'Harita Ayarları', aiSetting: 'AI Tercihleri', sensorSetting: 'Sensör Tercihleri',
    account: 'Hesap', accountSetting: 'Hesap Ayarları', guest: 'Misafir', on: 'Açık', off: 'Kapalı'
  },
  'English': {
    title: 'Settings', general: 'General', themeTitle: 'App Theme', langTitle: 'Language', notifTitle: 'Notifications',
    mapAi: 'Map & AI', mapSetting: 'Map Settings', aiSetting: 'AI Preferences', sensorSetting: 'Sensor Preferences',
    account: 'Account', accountSetting: 'Account Settings', guest: 'Guest', on: 'On', off: 'Off'
  }
};

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  // Zustand Global Store Bağlantısı
  const { theme, language, notifications, mapType, aiPref, sensorPref, setTheme, setLanguage, setNotifications, setMapType, setAiPref, setSensorPref } = useSettingsStore();
  const [activeModal, setActiveModal] = useState<SettingKey>(null);

  // Seçili dile göre metinleri çek (Desteklenmeyen bir dilse Türkçe varsay)
  const t = translations[language as keyof typeof translations] || translations['Türkçe'];

  const modalOptions = {
    theme: { title: t.themeTitle, options: ['Açık', 'Koyu', 'Sistem (Açık)'], current: theme, set: setTheme },
    language: { title: t.langTitle, options: ['Türkçe', 'English'], current: language, set: setLanguage },
    mapType: { title: t.mapSetting, options: ['Uydu', 'Sokak', 'Arazi'], current: mapType, set: setMapType },
    aiPref: { title: t.aiSetting, options: ['Detaylı', 'Özet', 'Acil Uyarılar'], current: aiPref, set: setAiPref },
    sensorPref: { title: t.sensorSetting, options: ['Optimize', 'Gerçek Zamanlı', 'Güç Tasarrufu'], current: sensorPref, set: setSensorPref },
  };

  return (
    // dark: sınıfları Koyu tema seçildiğinde otomatik devreye girer
    <div className="flex-1 bg-[#F4FAF5] dark:bg-slate-900 min-h-screen font-sans animate-in fade-in duration-300 pb-12 relative transition-colors">
      
      <div className="bg-white dark:bg-slate-800 px-6 py-4 flex items-center shadow-sm sticky top-0 z-20 transition-colors">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-3">
          <ArrowLeft size={24} className="text-slate-700 dark:text-slate-200" />
        </button>
        <h1 className="text-xl font-black text-[#1B331B] dark:text-white">{t.title}</h1>
      </div>

      <div className="px-6 py-6 space-y-8">
        
        <section>
          <h3 className="text-[13px] font-black text-[#597360] dark:text-emerald-400 mb-3 ml-1">{t.general}</h3>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
            
            <button onClick={() => setActiveModal('theme')} className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Moon size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.themeTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-400">{theme}</span>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </div>
            </button>

            <button onClick={() => setActiveModal('language')} className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Globe size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.langTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-400">{language}</span>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </div>
            </button>

            <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Bell size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.notifTitle}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-400">{notifications ? t.on : t.off}</span>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-black text-[#597360] dark:text-emerald-400 mb-3 ml-1">{t.mapAi}</h3>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
            
            <button onClick={() => setActiveModal('mapType')} className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Map size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.mapSetting}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{mapType}</span>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </div>
            </button>

            <button onClick={() => setActiveModal('aiPref')} className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Cpu size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.aiSetting}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{aiPref}</span>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </div>
            </button>

            <button onClick={() => setActiveModal('sensorPref')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 dark:bg-slate-700 p-2.5 rounded-xl">
                  <Activity size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.sensorSetting}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{sensorPref}</span>
                <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
              </div>
            </button>

          </div>
        </section>

      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-black text-[#1B331B] dark:text-white text-lg">{modalOptions[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-colors">
                <X size={20} className="text-slate-500 dark:text-slate-300" />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {modalOptions[activeModal].options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    modalOptions[activeModal].set(option);
                    setActiveModal(null);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    modalOptions[activeModal].current === option 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium'
                  }`}
                >
                  {option}
                  {modalOptions[activeModal].current === option && <Check size={20} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}