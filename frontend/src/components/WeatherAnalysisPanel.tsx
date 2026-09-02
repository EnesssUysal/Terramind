import React, { useState, useEffect } from 'react';
import { AgriculturalWeatherAnalysis, Field, DetailedWeatherData } from '../types';
import { Cloud, Sun, Wind, Droplets, MapPin, Activity, AlertTriangle, CloudRain, ThermometerSun, Leaf, ChevronDown, Sunrise, Sunset, Navigation, Map as MapIcon, Calendar, Thermometer, ShieldAlert, Play } from 'lucide-react';
import { AreaChart, Area, ComposedChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulationSync } from '../hooks/useSimulationSync';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const WMO_CODES: Record<number, { text: string; icon: string }> = {
  0: { text: 'Açık', icon: '☀️' },
  1: { text: 'Çoğunlukla Açık', icon: '🌤️' },
  2: { text: 'Parçalı Bulutlu', icon: '⛅' },
  3: { text: 'Kapalı', icon: '☁️' },
  45: { text: 'Sisli', icon: '🌫️' },
  48: { text: 'Kırağılı Sis', icon: '🌫️' },
  51: { text: 'Hafif Çisenti', icon: '🌧️' },
  53: { text: 'Orta Çisenti', icon: '🌧️' },
  55: { text: 'Yoğun Çisenti', icon: '🌧️' },
  61: { text: 'Hafif Yağmur', icon: '🌧️' },
  63: { text: 'Orta Yağmur', icon: '🌧️' },
  65: { text: 'Şiddetli Yağmur', icon: '🌧️' },
  71: { text: 'Hafif Kar', icon: '🌨️' },
  73: { text: 'Orta Kar', icon: '🌨️' },
  75: { text: 'Yoğun Kar', icon: '❄️' },
  95: { text: 'Gökgürültülü Fırtına', icon: '⛈️' },
};

const getWeatherInfo = (code: number) => {
  return WMO_CODES[code] || { text: 'Bilinmiyor', icon: '❓' };
};

const getWindDirectionText = (degree: number) => {
  const val = Math.floor((degree / 22.5) + 0.5);
  const arr = ["K", "KKD", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB"];
  return arr[(val % 16)] || "Bilinmiyor";
};

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 12);
  }, [lat, lon, map]);
  return null;
}

export default function WeatherAnalysisPanel({ field }: { field: Field }) {
  const [data, setData] = useState<AgriculturalWeatherAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  const simState = useSimulationSync();
  const [resolvedLocationName, setResolvedLocationName] = useState<string>('');

  useEffect(() => {
    const lat = field.latitude || (field as any).lat;
    const lon = field.longitude || (field as any).lng;
    
    if (!lat || !lon) {
      setError("Bu tarla için koordinat bilgisi bulunmuyor.");
      return;
    }
    setError(null);
    fetchWeatherData(lat, lon, field.location);
  }, [field]);

  const fetchWeatherData = async (lat: number, lon: number, defaultLocationName: string) => {
    setLoading(true);
    
    const mockReverseGeocoding = (lat: number, lon: number) => {
        if (Math.abs(lat - 38.29) < 0.1) return "Yeşilyurt, Malatya";
        if (Math.abs(lat - 38.09) < 0.1) return "Doğanşehir, Malatya";
        if (Math.abs(lat - 38.41) < 0.1) return "Battalgazi, Malatya";
        if (Math.abs(lat - 38.61) < 0.1) return "Saruhanlı, Manisa";
        return "Tarla Konumu";
    };
    setResolvedLocationName(mockReverseGeocoding(lat, lon));

    try {
      // Added past_days=1, wind_direction_10m_dominant
      const query = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,weather_code,soil_temperature_0cm,soil_moisture_0_to_1cm,uv_index,et0_fao_evapotranspiration&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration,sunrise,sunset,uv_index_max&past_days=1&timezone=auto`;
      const meteoRes = await fetch(query);
      if (!meteoRes.ok) throw new Error("API erişim hatası");
      const meteoData = await meteoRes.json();

      // With past_days=1, yesterday is at index 0, today is at index 1
      const yesterdayDaily = {
        tempMax: meteoData.daily.temperature_2m_max[0],
        tempMin: meteoData.daily.temperature_2m_min[0],
        precipitationSum: meteoData.daily.precipitation_sum[0],
      };
      
      // Calculate yesterday soil temp average (hours 0 to 23)
      let soilTempSum = 0;
      for (let i = 0; i < 24; i++) {
        soilTempSum += meteoData.hourly.soil_temperature_0cm[i];
      }
      const data = await meteoRes.json();
      const current = data.current;
      const h0 = data.hourly;
      
      let activeTemp = current.temperature_2m;
      let activeHum = current.relative_humidity_2m;
      let activeWind = current.wind_speed_10m;
      let activeRain = current.precipitation;
      
      if (simState.isSimulationActive) {
         if (simState.overrides.temperature !== null) activeTemp = simState.overrides.temperature;
         if (simState.overrides.humidity !== null) activeHum = simState.overrides.humidity;
         if (simState.overrides.rainfall !== null) activeRain = simState.overrides.rainfall;
         if (simState.overrides.windSpeed !== null) activeWind = simState.overrides.windSpeed;
      }

      const hourly = h0.time.slice(0, 24).map((t: string, idx: number) => {
        let temp = h0.temperature_2m[idx];
        let hum = h0.relative_humidity_2m[idx];
        let rain = h0.precipitation[idx];
        let wind = h0.wind_speed_10m[idx];
        let wmo = h0.weather_code[idx];

        if (simState.isSimulationActive && idx === 0) {
           temp = activeTemp;
           hum = activeHum;
           rain = activeRain;
           wind = activeWind;
        }

        let frostRisk = "Düşük";
        if (temp < 0) frostRisk = "Çok Yüksek";
        else if (temp < 3) frostRisk = "Yüksek";
        else if (temp < 5) frostRisk = "Orta";
        
        let heatStress = "-";
        if (temp >= 35) heatStress = "Yüksek";
        else if (temp >= 30) heatStress = "Orta";

        return {
          time: new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          temperature: temp,
          humidity: hum,
          precipitation: rain,
          precipitationProbability: h0.precipitation_probability[idx],
          windSpeed: wind,
          weatherCode: wmo,
          frostRisk,
          heatStress,
          sprayingSuitability: (wind > 15 || h0.precipitation_probability[idx] > 20) ? "Uygun Değil" : "Uygun"
        };
      });

      const avgSoilTempIndex = Math.max(0, h0.time.findIndex((t: string) => t.includes('12:00')) - 24);
      const avgSoilTemp = avgSoilTempIndex >= 0 ? h0.soil_temperature_0cm[avgSoilTempIndex] : 18;

      const detailedWeather: DetailedWeatherData = {
        current: {
          temperature: activeTemp,
          apparentTemperature: current.apparent_temperature,
          humidity: activeHum,
          precipitation: activeRain,
          windSpeed: activeWind,
          windDirection: current.wind_direction_10m,
          pressure: current.surface_pressure,
          weatherCode: current.weather_code,
          isDay: current.is_day === 1,
          uvIndex: data.daily.uv_index_max[1],
        },
        location: { latitude: lat, longitude: lon, name: field.name },
        hourly: hourly,
        daily: [],
        source: "open-meteo",
        updatedAt: new Date().toLocaleTimeString('tr-TR')
      };

      const mockAnalysis: AgriculturalWeatherAnalysis = {
        weather: detailedWeather,
        metrics: {
          eto: Number((activeTemp * 0.15 + (100 - activeHum) * 0.02 + activeWind * 0.1).toFixed(1)),
          etc: Number(((activeTemp * 0.15 + (100 - activeHum) * 0.02 + activeWind * 0.1) * 1.1).toFixed(1)),
          gdd: Math.max(0, activeTemp - 10),
          vpd: Number(((Math.exp(activeTemp * 0.05)) * (1 - (activeHum / 100))).toFixed(2)),
          sunrise: new Date(data.daily.sunrise[1]).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(data.daily.sunset[1]).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        },
        risks: { frostRisk: "Yok", heatStress: "Yok", diseaseRisk: "Yok", heavyRainRisk: "Yok" },
        activities: { spraying: "Uygun", planting: "Uygun", fertilizing: "Uygun", harvesting: "Uygun" },
        summary: { generalStatus: "Genel Olarak Uygun", message: "", impactMessage: "", irrigationMessage: "" }
      };

      (mockAnalysis as any).impactsList = [];
      setData(mockAnalysis);
    } catch (err) {
      setError("Hava durumu verilerine şu anda ulaşılamıyor.");
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 font-bold justify-center">
        <MapPin className="mr-3" /> {error}
      </div>
    );
  }

  if (!data || loading) {
    return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center"><CloudRain className="animate-spin mb-2 text-indigo-400" size={32} /> Hava durumu yükleniyor...</div>;
  }

  const { weather, metrics, risks, summary } = data;
  const currentCondition = getWeatherInfo(weather.current.weatherCode);
  const impactsList: any[] = (data as any).impactsList || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-6">
           <div>
             <h2 className="text-2xl font-black text-[#1B331B] flex items-center mb-1">
             <MapPin className="mr-2 text-indigo-500"/> Tarla Hava Durumu
             {simState.isSimulationActive && (
                <span className="ml-4 bg-orange-100 text-orange-700 border border-orange-200 text-[10px] px-3 py-1 rounded-full flex items-center shadow-sm uppercase font-black tracking-widest animate-pulse">
                  <Play className="w-3 h-3 mr-1" /> SİMÜLASYON (OVERRIDE)
                </span>
             )}
           </h2>
           <div className="text-slate-500 font-medium">{resolvedLocationName} • <span className="font-mono text-xs">{weather.location.latitude.toFixed(6)}°, {weather.location.longitude.toFixed(6)}°</span></div>
           </div>
           <div className="mt-4 md:mt-0 bg-blue-50/50 p-2 px-4 rounded-xl border border-blue-100 text-xs font-bold text-blue-600 flex items-center">
              MGM Benzeri Tarımsal Tahmin
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Map representation */}
           <div className="lg:col-span-3 h-48 rounded-2xl overflow-hidden border border-slate-200 relative">
              <MapContainer center={[weather.location.latitude, weather.location.longitude]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Marker position={[weather.location.latitude, weather.location.longitude]} icon={customIcon}>
                  <Popup>{field.name}</Popup>
                </Marker>
                <MapUpdater lat={weather.location.latitude} lon={weather.location.longitude} />
              </MapContainer>
           </div>
           
           {/* Current Data points */}
           <div className="lg:col-span-9 flex flex-col justify-center">
             <div className="flex items-center mb-6">
                <div className="text-7xl mr-6">{currentCondition.icon}</div>
                <div>
                  <div className="text-5xl font-black text-slate-800 tracking-tight">{Math.round(weather.current.temperature)}°C</div>
                  <div className="text-slate-500 font-bold text-lg">{currentCondition.text}</div>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Hissedilen</div>
                  <div className="font-black text-slate-800">{Math.round(weather.current.apparentTemperature)}°C</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Nem</div>
                  <div className="font-black text-slate-800">%{weather.current.humidity}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Rüzgar</div>
                  <div className="font-black text-slate-800">{Math.round(weather.current.windSpeed)} km/sa <span className="text-xs text-slate-400 ml-1">({getWindDirectionText(weather.current.windDirection)})</span></div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Yağış</div>
                  <div className="font-black text-slate-800">{weather.current.precipitation} mm</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Basınç</div>
                  <div className="font-black text-slate-800">{Math.round(weather.current.pressure)} hPa</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">UV İndeksi</div>
                  <div className="font-black text-purple-600">{weather.current.uvIndex}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Doğuş</div>
                  <div className="font-black text-orange-600">{metrics.sunrise}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-bold text-xs mb-1">Batış</div>
                  <div className="font-black text-orange-600">{metrics.sunset}</div>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* 5. BU HAVA TARLANI NASIL ETKİLER? */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
         <h3 className="font-black text-lg text-emerald-800 mb-4 flex items-center">
           <Leaf className="mr-2 text-emerald-600"/> Bu hava tarlan için ne anlama geliyor?
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {impactsList.map((impact, idx) => (
             <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-white">
                <h4 className="font-bold text-slate-800 mb-2">{impact.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">"{impact.text}"</p>
             </div>
           ))}
         </div>
      </div>

      {/* 2. DÜN GERÇEKLEŞEN DEĞERLER */}
      {weather.yesterday && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="font-black text-lg text-[#1B331B] mb-4 flex items-center">
             <Calendar className="mr-2 text-indigo-500"/> Dün Gerçekleşen Değerler
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 mb-1">Min/Max Sıcaklık</div>
                 <div className="font-black text-slate-800">{Math.round(weather.yesterday.tempMin)}°C / {Math.round(weather.yesterday.tempMax)}°C</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 mb-1">Toplam Yağış</div>
                 <div className="font-black text-blue-600">{weather.yesterday.precipitationSum} mm</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 mb-1">Toprak Sıcaklığı (Ort)</div>
                 <div className="font-black text-amber-700">{weather.yesterday.soilTemp}°C</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 mb-1">Günlük Etkili Sıc.</div>
                 <div className="font-black text-emerald-600">{weather.yesterday.effectiveTemp}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 text-center">
                 Tarımsal Geçmiş Veri
              </div>
           </div>
        </div>
      )}

      {/* 3. SAATLİK TAHMİN (MGM FORMAT) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
         <h3 className="font-black text-lg text-[#1B331B] mb-6 flex items-center">
           <Activity className="mr-2 text-indigo-500"/> Saatlik Tarımsal Tahmin
         </h3>
         
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left whitespace-nowrap">
             <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-4 py-3 rounded-tl-xl font-black">Saat</th>
                 <th className="px-4 py-3 font-black text-center">Hava</th>
                 <th className="px-4 py-3 font-black">Sıcaklık</th>
                 <th className="px-4 py-3 font-black">Rüzgar</th>
                 <th className="px-4 py-3 font-black">Yağış İht.</th>
                 <th className="px-4 py-3 font-black">Zirai Don Riski</th>
                 <th className="px-4 py-3 font-black">İlaçlama Uygunluğu</th>
                 <th className="px-4 py-3 font-black rounded-tr-xl">Sıcaklık Stresi</th>
               </tr>
             </thead>
             <tbody>
               {weather.hourly.slice(0, 12).map((h, i) => {
                 const condition = getWeatherInfo(h.weatherCode);
                 return (
                   <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                     <td className="px-4 py-3 font-bold text-slate-700">{h.time}</td>
                     <td className="px-4 py-3 text-center text-xl" title={condition.text}>{condition.icon}</td>
                     <td className="px-4 py-3 font-black text-slate-800">{Math.round(h.temperature)}°C</td>
                     <td className="px-4 py-3 text-slate-600 font-medium">{Math.round(h.windSpeed)} km/sa</td>
                     <td className="px-4 py-3 text-blue-600 font-bold">%{h.precipitationProbability}</td>
                     <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.frostRisk !== '-' ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}>
                          {h.frostRisk}
                        </span>
                     </td>
                     <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.sprayingSuitability === 'Uygun' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {h.sprayingSuitability}
                        </span>
                     </td>
                     <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.heatStress !== '-' ? 'bg-orange-50 text-orange-600' : 'text-slate-400'}`}>
                          {h.heatStress}
                        </span>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
         </div>
      </div>

      {/* 4. 5-7 GÜNLÜK TAHMİN (MGM FORMAT) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
         <h3 className="font-black text-lg text-[#1B331B] mb-6 flex items-center">
           <Calendar className="mr-2 text-indigo-500"/> 7 Günlük Tarımsal Hava Tahmini
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weather.daily.map((day, idx) => {
              const info = getWeatherInfo(day.weatherCode);
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="text-sm font-black text-slate-700 mb-2">{idx === 0 ? 'Bugün' : idx === 1 ? 'Yarın' : day.date}</div>
                  <div className="text-4xl mb-2">{info.icon}</div>
                  
                  <div className="flex space-x-2 mb-3">
                    <span className="font-black text-slate-800">{Math.round(day.tempMax)}°</span>
                    <span className="text-slate-400 font-bold">{Math.round(day.tempMin)}°</span>
                  </div>
                  
                  <div className="w-full space-y-2 text-xs font-medium border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rüzgar</span>
                      <span className="text-slate-700 font-bold">{Math.round(day.windSpeedMax)} km {getWindDirectionText(day.windDirection)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Yağış</span>
                      <span className="text-blue-600 font-bold">%{day.precipitationProbabilityMax} ({day.precipitationSum} mm)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-400 text-[10px]">Don Riski</span>
                      <span className={`text-[10px] font-black ${day.frostRisk !== '-' ? 'text-red-500' : 'text-slate-300'}`}>{day.frostRisk}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px]">İlaçlama</span>
                      <span className={`text-[10px] font-black ${day.sprayingSuitability === 'Uygun' ? 'text-emerald-500' : 'text-red-500'}`}>{day.sprayingSuitability}</span>
                    </div>
                  </div>
                </div>
              );
            })}
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl text-xs font-medium text-slate-500 border border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex space-x-6">
          <div><strong>Konum Kaynağı:</strong> Tarla koordinatları</div>
          <div><strong>Meteoroloji Kaynağı:</strong> {weather.source === "open-meteo" ? "Open-Meteo" : "Sensörler"}</div>
          <div><strong>Latitude:</strong> {weather.location.latitude.toFixed(6)}</div>
          <div><strong>Longitude:</strong> {weather.location.longitude.toFixed(6)}</div>
        </div>
        <div>
          <strong>Son Güncelleme:</strong> {weather.updatedAt}
        </div>
      </div>

      <button 
        onClick={() => setShowDetailedInfo(!showDetailedInfo)}
        className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
      >
        <Activity size={18} className="text-indigo-500" />
        <span>{showDetailedInfo ? 'Detaylı Analizi Kapat' : 'Detaylı Analiz (Teknik Hesaplamalar)'}</span>
        <ChevronDown size={16} className={`transition-transform ${showDetailedInfo ? 'rotate-180' : ''}`} />
      </button>

      {showDetailedInfo && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-2">
           <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-indigo-500"/> Tarımsal Meteoroloji Analizi (Katman 2)</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-black text-lg text-[#1B331B] mb-4">Hesaplanan Bilimsel Metrikler</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                   <div className="flex items-center text-sm font-bold text-slate-600">
                     <span className="w-8 font-mono text-xs bg-slate-100 rounded text-center py-0.5 mr-2">ET₀</span> 
                     Referans Evapotranspirasyon
                   </div>
                   <span className="text-sm font-black text-indigo-600">{metrics.eto} mm/gün</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                   <div className="flex items-center text-sm font-bold text-slate-600">
                     <span className="w-8 font-mono text-xs bg-slate-100 rounded text-center py-0.5 mr-2">ETc</span> 
                     Tahmini Bitki Su Tüketimi
                   </div>
                   <span className="text-sm font-black text-indigo-600">{metrics.etc?.toFixed(1)} mm/gün</span>
                 </div>
                 <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                   <div className="flex items-center text-sm font-bold text-slate-600">
                     <span className="w-8 font-mono text-xs bg-slate-100 rounded text-center py-0.5 mr-2">GDD</span> 
                     Büyüme Derece Günleri (Tbase: 10°C)
                   </div>
                   <span className="text-sm font-black text-emerald-600">{metrics.gdd}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center text-sm font-bold text-slate-600">
                     <span className="w-8 font-mono text-xs bg-slate-100 rounded text-center py-0.5 mr-2">VPD</span> 
                     Buhar Basıncı Açığı
                   </div>
                   <span className="text-sm font-black text-orange-600">{metrics.vpd} kPa</span>
                 </div>
               </div>
               <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                 Bu metrikler Open-Meteo tahminsel verileri baz alınarak Hargreaves ve Penman-Monteith (basitleştirilmiş) yöntemleriyle hesaplanmıştır.
               </p>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
