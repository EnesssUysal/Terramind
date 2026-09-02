import { useState, useEffect } from 'react';

export interface SimulationState {
  isSimulationActive: boolean;
  scenario: string | null;
  sensorStatus?: any;
  overrides: {
    soilMoisture: number | null;
    temperature: number | null;
    humidity: number | null;
    rainfall: number | null;
    windSpeed?: number | null;
    radiation?: number | null;
    irrigationAmount?: number | null;
    irrigationDuration?: number | null;
    nitrogen: number | null;
    phosphorus: number | null;
    potassium: number | null;
    ph: number | null;
    ec: number | null;
  };
}

export function useSimulationSync() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isSimulationActive: false,
    scenario: null,
    overrides: {
      soilMoisture: null,
      temperature: null,
      humidity: null,
      rainfall: null,
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      ph: null,
      ec: null
    }
  });

  useEffect(() => {
    const evtSource = new EventSource('http://localhost:5000/api/live-sync');
    evtSource.onmessage = (event) => {
      try {
        const state = JSON.parse(event.data);
        setSimulationState(state);
      } catch (e) {
        console.error("Simulation sync error:", e);
      }
    };
    return () => evtSource.close();
  }, []);

  return simulationState;
}
