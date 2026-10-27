import React, { useState } from 'react';
import { Home as HomeIcon, LayoutGrid, BarChart2, Cpu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './HomeTab';
import FieldsTab from './FieldsTab';
import AnalysisTab from './AnalysisTab';
import ProfileTab from './ProfileTab';
import DetailScreen from './DetailScreen';

import WeatherScreen from './WeatherScreen';
import NotificationsScreen from './NotificationsScreen';
import FullscreenMapScreen from './FullscreenMapScreen';
import SensorDetailScreen from './SensorDetailScreen';
import IrrigationScreen from './IrrigationScreen';
import SensorsListScreen from './SensorsListScreen';
import AlertsScreen from './AlertsScreen';
import SettingsScreen from './SettingsScreen';
import PrivacyScreen from './PrivacyScreen';
import SupportScreen from './SupportScreen';
import AboutScreen from './AboutScreen';
import CarbonFootprintScreen from './CarbonFootprintScreen';
import AddFieldScreen from './AddFieldScreen';
import { FieldItem } from './FieldsTab';
import { DigitalTwinScreen } from './DigitalTwinScreen';

// Doğru dosyayı içe aktarıyoruz
import AiChatScreen from './AiChatScreen';

import { mockFields } from '../mockData';

interface MainScreenProps {
  onLogout: () => void;
}

const FALLBACK_FIELDS: FieldItem[] = [
  {
    id: '1793109118563',
    name: 'Üzüm Bağı',
    location: 'Manisa / Yunusemre',
    area: '63.7 Dönüm',
    status: 'Sağlıklı',
    lat: 38.7377604815913,
    lng: 27.434862654640995,
    crop: 'Üzüm',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.7377604815913, 27.434862654640995],
      [38.7389915490909, 27.43727966132707],
      [38.74011468692338, 27.43641143758065],
      [38.740909681568176, 27.435487820011026],
      [38.74005918493525, 27.433410330488574]
    ]
  },
  {
    id: '1793109250136',
    name: 'Kayısı Tarlası',
    location: 'Malatya / Battalgazi',
    area: '16.8 Dönüm',
    status: 'Sağlıklı',
    lat: 38.44961407555695,
    lng: 38.35766552927494,
    crop: 'Kayısı',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.44961407555695, 38.35766552927494],
      [38.44907632348891, 38.35582903387487],
      [38.44825288286856, 38.35592569152751],
      [38.448673006808086, 38.35785884458023]
    ]
  },
  {
    id: '1793109326110',
    name: 'Buğday Tarlası',
    location: 'Kayseri / Develi',
    area: '55.5 Dönüm',
    status: 'Sağlıklı',
    lat: 38.36509719705687,
    lng: 35.453427189205456,
    crop: 'Buğday',
    ndviScore: 0.84,
    moisture: 42,
    polygon: [
      [38.36509719705687, 35.453427189205456],
      [38.36664502101616, 35.45328757259611],
      [38.366599861712785, 35.44994129644126],
      [38.36505203678775, 35.44936135052545]
    ]
  }
];

function loadUserFields(): FieldItem[] {
  try {
    const raw = localStorage.getItem('terramind_user_fields');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Eski varsayılan asistan tarlaları tespit edilirse kullanıcının tarlalarına yükselt
        const hasOldAssistantFields = parsed.some(f => f.name === 'Battalgazi Güneş Kayısılığı' || f.name === 'Develi Ovası Bereket Parseli');
        if (hasOldAssistantFields) {
          localStorage.setItem('terramind_user_fields', JSON.stringify(FALLBACK_FIELDS));
          return FALLBACK_FIELDS;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Tarlalar okunamadı:', e);
  }
  try {
    localStorage.setItem('terramind_user_fields', JSON.stringify(FALLBACK_FIELDS));
  } catch { }
  return FALLBACK_FIELDS;
}

export default function MainScreen({ onLogout }: MainScreenProps) {
  const [currentTab, setCurrentTab] = useState<'home' | 'fields' | 'analysis' | 'ai' | 'profile'>('home');
  const [userFields, setUserFields] = useState<FieldItem[]>(loadUserFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(() => loadUserFields()[0]?.id || '1793109118563');
  const [detailPage, setDetailPage] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);

  const selectedUserField = userFields.find(f => f.id === selectedFieldId) || userFields[0] || FALLBACK_FIELDS[0];
  const selectedField = mockFields.find(f => f.id === selectedFieldId) || mockFields.find(f => f.name === selectedUserField.name) || mockFields[0];

  const handleSelectField = (id: string) => {
    setSelectedFieldId(id);
    fetch('http://localhost:3001/api/admin/select-farm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmId: id })
    }).catch(() => { });
  };

  const persistUserFields = (fields: FieldItem[]) => {
    setUserFields(fields);
    localStorage.setItem('terramind_user_fields', JSON.stringify(fields));
  };

  const handleAddField = (newField: FieldItem) => {
    const updated = [...userFields, newField];
    persistUserFields(updated);
    handleSelectField(newField.id);
    setShowAddField(false);
  };

  const handleDeleteUserField = (id: string) => {
    const updated = userFields.filter(f => f.id !== id);
    persistUserFields(updated);
    if (selectedFieldId === id) {
      if (updated.length > 0) {
        handleSelectField(updated[0].id);
      } else {
        setSelectedFieldId('');
      }
    }
  };

  const handleCloseDetail = () => setDetailPage(null);
  const handleSwitchToAi = () => setCurrentTab('ai');

  const renderDetailScreen = () => {
    switch (detailPage) {
      case 'weather': return <WeatherScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'notifications': return <NotificationsScreen onBack={handleCloseDetail} />;
      case 'fullscreen-map': return <FullscreenMapScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'sensor-moisture': return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="moisture" />;
      case 'sensor-temperature': return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="temperature" />;
      case 'sensor-nitrogen': return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="nitrogen" />;
      case 'sensor-ph': return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="ph" />;
      case 'irrigation': return <IrrigationScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'sensors-list': return <SensorsListScreen onBack={handleCloseDetail} />;
      case 'digital-twin': return <DigitalTwinScreen onBack={handleCloseDetail} />;
      case 'alerts-list': return <AlertsScreen onBack={handleCloseDetail} />;
      case 'settings': return <SettingsScreen onBack={handleCloseDetail} onLogout={onLogout} />;
      case 'privacy': return <PrivacyScreen onBack={handleCloseDetail} />;
      case 'support': return <SupportScreen onBack={handleCloseDetail} />;
      case 'about': return <AboutScreen onBack={handleCloseDetail} />;
      case 'carbon': return <CarbonFootprintScreen onBack={handleCloseDetail} />;
      default: return <DetailScreen title={detailPage!} onBack={handleCloseDetail} />;
    }
  };

  if (showAddField) {
    return (
      <AddFieldScreen
        onBack={() => setShowAddField(false)}
        onSave={handleAddField}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4FAF5] relative">
      <AnimatePresence mode="wait">
        {detailPage ? (
          renderDetailScreen()
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 pb-24 flex flex-col min-h-screen"
          >
            {currentTab === 'home' && (
              <HomeTab
                selectedField={selectedField}
                fields={userFields}
                selectedFieldId={selectedFieldId}
                onSelectField={handleSelectField}
                onOpenDetail={setDetailPage}
                onSwitchToAi={handleSwitchToAi}
                onSwitchToProfile={() => setCurrentTab('profile')}
                onSwitchToFields={() => setCurrentTab('fields')}
                onDeleteField={handleDeleteUserField}
              />
            )}
            {currentTab === 'fields' && (
              <FieldsTab
                fields={userFields}
                selectedFieldId={selectedFieldId}
                onSelectField={handleSelectField}
                onOpenDetail={() => setCurrentTab('analysis')}
                onAddNewField={() => setShowAddField(true)}
                onDeleteField={handleDeleteUserField}
              />
            )}
            {currentTab === 'analysis' && (
              <AnalysisTab
                selectedField={selectedUserField}
                fields={userFields}
                onSelectField={handleSelectField}
              />
            )}

            {/* YAPAY ZEKA EKRANI (AiChatScreen) BURADA DEVREYE GİRİYOR */}
            {currentTab === 'ai' && (
              <AiChatScreen
                onBack={() => setCurrentTab('home')}
                selectedField={selectedField}
              />
            )}

            {currentTab === 'profile' && <ProfileTab onLogout={onLogout} onOpenDetail={setDetailPage} />}

            <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[24px] bg-white pb-safe pt-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex justify-around px-2 pb-4 pt-2">
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`flex flex-col items-center space-y-1 transition-colors ${currentTab === 'home' ? 'text-[#4CAF50]' : 'text-[#8EA694] hover:text-[#597360]'}`}
                >
                  <HomeIcon className="h-6 w-6" strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                  <span className={`text-[11px] ${currentTab === 'home' ? 'font-bold' : 'font-medium'}`}>Ana Sayfa</span>
                </button>
                <button
                  onClick={() => setCurrentTab('fields')}
                  className={`flex flex-col items-center space-y-1 transition-colors ${currentTab === 'fields' ? 'text-[#4CAF50]' : 'text-[#8EA694] hover:text-[#597360]'}`}
                >
                  <LayoutGrid className="h-6 w-6" strokeWidth={currentTab === 'fields' ? 2.5 : 2} />
                  <span className={`text-[11px] ${currentTab === 'fields' ? 'font-bold' : 'font-medium'}`}>Tarlalar</span>
                </button>
                <button
                  onClick={() => setCurrentTab('analysis')}
                  className={`flex flex-col items-center space-y-1 transition-colors ${currentTab === 'analysis' ? 'text-[#4CAF50]' : 'text-[#8EA694] hover:text-[#597360]'}`}
                >
                  <BarChart2 className="h-6 w-6" strokeWidth={currentTab === 'analysis' ? 2.5 : 2} />
                  <span className={`text-[11px] ${currentTab === 'analysis' ? 'font-bold' : 'font-medium'}`}>Analiz</span>
                </button>
                <button
                  onClick={() => setCurrentTab('ai')}
                  className={`flex flex-col items-center space-y-1 transition-colors ${currentTab === 'ai' ? 'text-[#4CAF50]' : 'text-[#8EA694] hover:text-[#597360]'}`}
                >
                  <Cpu className="h-6 w-6" strokeWidth={currentTab === 'ai' ? 2.5 : 2} />
                  <span className={`text-[11px] ${currentTab === 'ai' ? 'font-bold' : 'font-medium'}`}>Yapay Zekâ</span>
                </button>
                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`flex flex-col items-center space-y-1 transition-colors ${currentTab === 'profile' ? 'text-[#4CAF50]' : 'text-[#8EA694] hover:text-[#597360]'}`}
                >
                  <User className="h-6 w-6" strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
                  <span className={`text-[11px] ${currentTab === 'profile' ? 'font-bold' : 'font-medium'}`}>Profil</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}