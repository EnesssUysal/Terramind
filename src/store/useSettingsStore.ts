import { create } from 'zustand';

interface SettingsState {
  theme: string;
  language: string;
  notifications: boolean;
  mapType: string;
  aiPref: string;
  sensorPref: string;
  setTheme: (theme: string) => void;
  setLanguage: (lang: string) => void;
  setNotifications: (val: boolean) => void;
  setMapType: (type: string) => void;
  setAiPref: (pref: string) => void;
  setSensorPref: (pref: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'Sistem (Açık)',
  language: 'Türkçe',
  notifications: true,
  mapType: 'Uydu',
  aiPref: 'Detaylı',
  sensorPref: 'Optimize',
  
  setTheme: (theme) => {
    set({ theme });
    // Koyu tema seçilirse tüm HTML'e 'dark' sınıfını ekle (Tailwind tetikleyicisi)
    if (theme === 'Koyu') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  setLanguage: (language) => set({ language }),
  setNotifications: (notifications) => set({ notifications }),
  setMapType: (mapType) => set({ mapType }),
  setAiPref: (aiPref) => set({ aiPref }),
  setSensorPref: (sensorPref) => set({ sensorPref }),
}));