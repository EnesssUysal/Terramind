import { create } from 'zustand';

interface FarmState {
  farmLocation: [number, number];
  setFarmLocation: (location: [number, number]) => void;
}

export const useStore = create<FarmState>((set) => ({
  // Varsayılan açılış konumu (Kayseri / Kocasinan)
  farmLocation: [38.7440, 35.4883], 
  setFarmLocation: (location) => set({ farmLocation: location }),
}));