import React, { useState } from 'react';
import { Home as HomeIcon, LayoutGrid, BarChart2, Cpu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './HomeTab';
import FieldsTab from './FieldsTab';
import AnalysisTab from './AnalysisTab';
import AiChatScreen from './AiChatScreen';
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

// YENİ EKLENEN EKRAN IMPORTU
import { DigitalTwinScreen } from './DigitalTwinScreen';

import { mockFields } from '../mockData';

interface MainScreenProps {
  onLogout: () => void;
}

function loadUserFields(): FieldItem[] {
  try {
    const raw = localStorage.getItem('terramind_user_fields');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Tarlalar okunamadı:', e);
  }
  // DEFAULT_FIELDS importu dosyanın üst kısımlarında yoksa, FieldsTab'den geliyor olmalı.
  // Eski kodunuzda olduğu gibi bıraktım.
  return []; 
}

export default function MainScreen({ onLogout }: MainScreenProps) {
  const [currentTab, setCurrentTab] = useState<'home' | 'fields' | 'analysis' | 'ai' | 'profile'>('home');
  const [selectedFieldId, setSelectedFieldId] = useState(mockFields[0].id);
 const [detailPage, setDetailPage] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState<string | null>(null);

  const [userFields, setUserFields] = useState<FieldItem[]>(loadUserFields);
  const [selectedUserFieldId, setSelectedUserFieldId] = useState<string>(() => loadUserFields()[0]?.id);
  const [showAddField, setShowAddField] = useState(false);

  const selectedField = mockFields.find(f => f.id === selectedFieldId) || mockFields[0];
  const selectedUserField = userFields.find(f => f.id === selectedUserFieldId) || userFields[0];

  const persistUserFields = (fields: FieldItem[]) => {
    setUserFields(fields);
    localStorage.setItem('terramind_user_fields', JSON.stringify(fields));
  };

  const handleAddField = (newField: FieldItem) => {
    const updated = [...userFields, newField];
    persistUserFields(updated);
    setSelectedUserFieldId(newField.id);
    setShowAddField(false);
  };

  const handleDeleteUserField = (id: string) => {
    const updated = userFields.filter(f => f.id !== id);
    // Eski koddaki DEFAULT_FIELDS mantığı korunuyor
    persistUserFields(updated.length > 0 ? updated : []);
    if (selectedUserFieldId === id) {
      setSelectedUserFieldId((updated[0] || { id: 'default' }).id);
    }
  };

  const handleCloseDetail = () => setDetailPage(null);
  const handleSwitchToAi = (context?: string) => {
    if (context) setAiContext(context);
    setCurrentTab('ai');
  };

  const renderDetailScreen = () => {
    switch (detailPage) {
      case 'weather':
        return <WeatherScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'notifications':
        return <NotificationsScreen onBack={handleCloseDetail} />;
      case 'fullscreen-map':
        return <FullscreenMapScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'sensor-moisture':
        return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="moisture" />;
      case 'sensor-temperature':
        return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="temperature" />;
      case 'sensor-nitrogen':
        return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="nitrogen" />;
      case 'sensor-ph':
        return <SensorDetailScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} sensorType="ph" />;
      case 'irrigation':
        return <IrrigationScreen onBack={handleCloseDetail} selectedFieldId={selectedFieldId} />;
      case 'sensors-list':
  return <DigitalTwinScreen onBack={handleCloseDetail} />;
      case 'alerts-list':
        return <AlertsScreen onBack={handleCloseDetail} />;
      case 'settings':
        return <SettingsScreen onBack={handleCloseDetail} onLogout={onLogout} />;
      case 'privacy':
        return <PrivacyScreen onBack={handleCloseDetail} />;
      case 'support':
        return <SupportScreen onBack={handleCloseDetail} />;
      case 'about':
        return <AboutScreen onBack={handleCloseDetail} />;
      case 'carbon':
        return <CarbonFootprintScreen onBack={handleCloseDetail} />;
      
      // YENİ EKLENEN YÖNLENDİRME (Dijital İkiz Ekranı)
      case 'digital-twin':
        return <DigitalTwinScreen />;
        
      default:
        return <DetailScreen title={detailPage!} onBack={handleCloseDetail} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4FAF5] relative">
      {showAddField && (
        <AddFieldScreen onBack={() => setShowAddField(false)} onSave={handleAddField} />
      )}
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
                onSelectField={setSelectedFieldId} 
                onOpenDetail={setDetailPage} 
                onSwitchToAi={handleSwitchToAi}
                onSwitchToProfile={() => setCurrentTab('profile')}
                onSwitchToFields={() => setCurrentTab('fields')}
              />
            )}
            {currentTab === 'fields' && (
              <FieldsTab
                fields={userFields}
                selectedFieldId={selectedUserFieldId}
                onSelectField={setSelectedUserFieldId}
                onOpenDetail={() => setCurrentTab('analysis')}
                onAddNewField={() => setShowAddField(true)}
                onDeleteField={handleDeleteUserField}
              />
            )}
            {currentTab === 'analysis' && (
              <AnalysisTab
                selectedField={selectedUserField}
                fields={userFields}
                onSelectField={setSelectedUserFieldId}
              />
            )}
            {currentTab === 'ai' && <AiChatScreen initialContext={aiContext} onBack={() => setCurrentTab('home')} />}
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