import React, { useState, useEffect } from 'react';
import { 
  CloudRain, AlertTriangle, Zap, RotateCcw, Sprout, Bug, ShieldAlert, 
  CircleDollarSign, Fingerprint, MapPin, Droplets, Scan, Activity, Server, 
  Target, Layers, Wifi, Cpu, BatteryCharging, Power, ThermometerSun, Wind, 
  Beaker, Leaf, ListChecks, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Clock, ArrowRight, ShieldCheck, Play, Volume2, ExternalLink
} from 'lucide-react';

import { Field } from '../types';
import { mockWaterSavingEvents } from '../mockData';
import WaterSoilAnalysisPanel from './WaterSoilAnalysisPanel';
import ClimateAnalysisPanel from './ClimateAnalysisPanel';
import FactorCard from './FactorCard';
import InfoTooltip from './InfoTooltip';

interface AnalysisTabProps {
  selectedField: Field | any;
  fields: Field[] | any[];
  onSelectField?: (fieldId: string) => void;
}

type SimStage = 'idle' | 'crisis' | 'warning';

const CRITICAL_MOISTURE = 18;

// Kademeli Açılım (Progressive Disclosure) Durum Kartı Bileşeni
interface AccordionCardProps {
  id: string;
  title: string;
  category: string;
  status: 'İyi' | 'Dikkat' | 'Kritik';
  badgeText: string;
  summary: string;
  primaryMetric: { label: string; value: string };
  secondaryMetric?: { label: string; value: string };
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ProgressiveAccordionCard({
  id,
  title,
  category,
  status,
  badgeText,
  summary,
  primaryMetric,
  secondaryMetric,
  icon,
  isOpen,
  onToggle,
  children
}: AccordionCardProps) {
  const getStatusStyles = (st: 'İyi' | 'Dikkat' | 'Kritik') => {
    switch (st) {
      case 'İyi':
        return {
          border: 'border-l-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconBg: 'bg-emerald-50 text-emerald-600',
          dot: 'bg-emerald-500'
        };
      case 'Dikkat':
        return {
          border: 'border-l-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-50 text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'Kritik':
        return {
          border: 'border-l-rose-500',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          iconBg: 'bg-rose-50 text-rose-600',
          dot: 'bg-rose-500'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div 
      id={id}
      className={`bg-white rounded-3xl border border-slate-200 shadow-xs transition-all duration-300 overflow-hidden border-l-4 ${styles.border} ${isOpen ? 'ring-2 ring-emerald-500/10 shadow-md' : 'hover:border-slate-300'}`}
    >
      
      {/* 1. SEVİYE: SADE ÖZET KART (İLK BAKIŞTA GÖRÜNEN KISIM - SIFIR GRAFİK KARMAŞASI) */}
      <div 
        onClick={onToggle}
        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none min-h-[70px]"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        {/* Sol: İkon, Başlık ve 1 Cümlelik Net Sonuç */}
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3.5 rounded-2xl shrink-0 mt-0.5 ${styles.iconBg}`}>
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">{category}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${styles.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                {badgeText}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{title}</h4>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1 leading-relaxed max-w-2xl">
              {summary}
            </p>
          </div>
        </div>

        {/* Sağ: Hızlı Temel Değerler ve "Detaylı Bilgi / İncele" Butonu */}
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{primaryMetric.label}</span>
              <span className="text-base sm:text-lg font-black text-slate-900">{primaryMetric.value}</span>
            </div>
            {secondaryMetric && (
              <div className="text-right pl-3 border-l border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{secondaryMetric.label}</span>
                <span className="text-base sm:text-lg font-black text-slate-700">{secondaryMetric.value}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`min-h-[46px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              isOpen 
                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 shadow-xs'
            }`}
          >
            <span>{isOpen ? 'Detayları Kapat' : 'Detaylı Bilgi / İncele'}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* 2. SEVİYE: DOĞRUDAN YERİNDE AÇILAN KAPSAMLI DETAY PANELİ & GRAFİKLER */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 animate-in slide-in-from-top-3 duration-200">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={15} className="text-emerald-600" />
              Ayrıntılı Telemetri, Zaman Serisi Grafiği ve Bilimsel Analiz
            </span>
          </div>
          {children}
        </div>
      )}

    </div>
  );
}

export default function AnalysisTab({ selectedField, fields, onSelectField }: AnalysisTabProps) {
  // SADELEŞTİRİLMİŞ 3 ANA MOD: 'advisor' (Varsayılan AI Danışman), 'dashboard' (Kapsamlı Analiz Tek Kaynak), 'spectral' (IoT Mesh)
  // Çiftleme yapan parçalı 'water' ve 'climate' sekmeleri temizlenmiştir.
  const [activeFieldId, setActiveFieldId] = useState<string>(selectedField?.id || fields[0]?.id || '1');
  const [activeMode, setActiveMode] = useState<'advisor' | 'dashboard' | 'spectral'>('advisor');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('water-stress');

  // LoRaWAN Telemetri Verileri
  const [pdr] = useState(98.4);
  const [node1Rssi] = useState(-84);
  const [node2Rssi] = useState(-92);
  const [isNode2Sleeping] = useState(false);

  useEffect(() => {
    if (selectedField?.id) {
      setActiveFieldId(selectedField.id);
    }
  }, [selectedField]);

  const activeField = fields.find(f => f.id === activeFieldId) || selectedField || fields[0] || {
    id: '1',
    name: 'Kuzey Tarlası',
    crop: 'Mısır (Pioneer)',
    ndvi: 0.82,
    area: '42.0 Dönüm'
  };

  // Saha Durumu (Simülasyon yerine sahadan gelen gerçek telemetri/durum)
  const currentMoisture = activeField.sensors?.moisture?.value || activeField.moisture || 34;
  const isCrisis = currentMoisture < 20 || activeField.status === 'Kritik';
  const isWarning = activeField.status === 'Dikkat';

  const fieldEvents = mockWaterSavingEvents.filter(e => e.field === activeField.name);
  const realSavedLiters = fieldEvents.reduce((sum, e) => sum + e.savedLiters, 0);
  const displaySavedLiters = realSavedLiters > 0 ? realSavedLiters : Math.floor((activeField.ndvi || 0.7) * 540);
  const expectedYieldIncrease = Math.max(0, (((activeField.ndvi || 0.75) - 0.4) * 35)).toFixed(1);
  const monthlyProjectedSavings = (displaySavedLiters * 15 * 0.15).toLocaleString('tr-TR', { maximumFractionDigits: 0 });

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [actionId]: !prev[actionId]
    }));
  };

  const toggleAccordion = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  // DOĞRUDAN YÖNLENDİRME & DERİN BAĞLANTI (DEEP-LINK & SMOOTH SCROLL)
  // Kullanıcı bir tavsiyeye veya kart bağlantısına tıkladığında Kapsamlı Analiz'e geçip o bölüme akıcı odaklanır
  const navigateToAnalysis = (sectionId: string) => {
    setActiveMode('dashboard');
    setExpandedSection(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const playSummaryAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      let statusText = 'Tarlada toprak nemi ideal seviyede olup bitki gelişimi sağlıklı ilerliyor.';
      if (isWarning) statusText = 'Kritik uyarı: Külleme ve mantar riski tespit edildi. Koruyucu ilaçlama önerilir.';
      else if (isCrisis) statusText = 'Acil durum: Toprak nemi kritik seviyeye düştü ancak fırtına beklendiği için sulama otonom olarak durduruldu.';
      
      const summaryText = `${activeField.name} tarlası için otonom ziraat raporu. Güncel toprak nemi yüzde ${currentMoisture}. ${statusText} Akşam 19:30 sonrası damlama sulama ve yarın sabah gübreleme tavsiye edilir.`;
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
    }
  };

  const handleFieldChange = (fId: string) => {
    setActiveFieldId(fId);
    if (onSelectField) onSelectField(fId);
  };

  return (
    <div className="flex-1 px-3 sm:px-6 pt-5 pb-28 font-sans animate-in fade-in duration-500 bg-[#F4FAF5]">
      
      {/* 1. ÜST BAŞLIK VE TARLA SEÇİCİ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">TerraMind DSS • Otonom Tarım</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B331B] tracking-tight mt-0.5">
            Zirai Karar Destek & Analiz
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Canlı Telemetri Modu
          </span>
        </div>
      </div>

      {/* TARLA SEÇİCİ PİLLER */}
      <div className="flex space-x-2.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {fields.map(field => {
          const isActive = activeFieldId === field.id;
          return (
            <button 
              key={field.id} 
              onClick={() => handleFieldChange(field.id)} 
              className={`flex items-center px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all min-h-[46px] ${
                isActive 
                  ? 'bg-[#1B331B] text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin size={16} className={`mr-1.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {field.name}
              {field.crop && <span className="opacity-60 text-[11px] ml-1.5">({field.crop})</span>}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. REVIZYON: EN ÜSTTE DİKKAT ÇEKİCİ, TEMİZ "OTONOM AI DANIŞMANI" KARTI */}
      {/* ========================================================================= */}
      <section className="mb-6">
        <div className={`rounded-3xl p-5 sm:p-7 shadow-xl border-2 transition-all duration-500 relative overflow-hidden ${
          isWarning 
            ? 'bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 border-rose-500 text-white' 
            : isCrisis 
              ? 'bg-gradient-to-br from-[#0B1E12] via-[#0E2C1A] to-[#08150D] border-emerald-500 text-white' 
              : 'bg-gradient-to-br from-[#132B16] via-[#1B3B1E] to-[#0E2010] border-emerald-600/40 text-white'
        }`}>
          
          {/* Arka plan parlama efekti */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Kart Üst Bilgisi: AI Durum Rozeti ve Canlı Telemetri */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    TerraMind Otonom Danışman
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
                    CANLI DSS
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-medium">
                  {activeField.name} • Gerçek Zamanlı Telemetri & Zirai Karar Motoru
                </p>
              </div>
            </div>

            {/* Hızlı Butonlar: Sesli Dinle ve Canlı Sensör Rozeti */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <span className="text-[11px] font-mono text-emerald-300/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Nem: %{currentMoisture} • Sıcaklık: 24°C
              </span>
              <button
                type="button"
                onClick={playSummaryAudio}
                className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                title="Sesli Raporu Dinle"
              >
                <Volume2 size={16} className="text-emerald-400" />
                <span>Sesli Dinle</span>
              </button>
            </div>
          </div>

          {/* GENEL DURUM ÖZETİ (1-2 Cümle Net Türkçe Özet) */}
          <div className="mb-5 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <Activity size={14} /> Tarlanın Anlık Durum Özeti
            </span>
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
              {isWarning ? (
                <>
                  <strong className="text-rose-300">Kritik Risk Tespit Edildi:</strong> Nem oranı ve ani sıcaklık artışı sebebiyle <span className="underline decoration-rose-400">Külleme Mantarı riski %78'e</span> ulaştı. Kök çürümesini engellemek için planlanan sulama derhal durdurulmalıdır.
                </>
              ) : isCrisis ? (
                <>
                  <strong className="text-amber-300">Otonom Tasarruf Devrede:</strong> Toprak nemi kritik eşiğe (%{currentMoisture}) düştü; ancak 18 saat sonra beklenen <span className="underline decoration-amber-400">şiddetli fırtına yağışı</span> nedeniyle sistem sulamayı otonom iptal ederek <strong>{displaySavedLiters} Litre</strong> su tasarrufu sağladı.
                </>
              ) : (
                <>
                  Toprak nemi ve kök su açığı ideal seviyede (%{currentMoisture}); ancak önümüzdeki 36 saatte beklenen sıcak hava nedeniyle hafif buharlaşma stresi öngörülmektedir. Bitki sağlığı (NDVI: {activeField.ndvi || 0.82}) bölge ortalamasının üzerindedir.
                </>
              )}
            </p>
          </div>

          {/* SOMUT YAPAY ZEKA EYLEMLERİ (TAVSİYELER - 3 ADIM) */}
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-3">
              <CheckCircle2 size={14} /> Hemen Uygulanacak Somut Tavsiyeler (Derin Bağlantılı)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Eylem 1: Sulama Tavsiyesi & Kapsamlı Analize Derin Bağlantı */}
              <div 
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  completedActions['action-1']
                    ? 'bg-emerald-950/40 border-emerald-500/40 opacity-70'
                    : 'bg-white/10 hover:bg-white/15 border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                        <Droplets size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-200">1. Sulama Adımı</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleAction('action-1')}
                      className="p-1 text-emerald-400 hover:text-white"
                      title="Tamamlandı olarak işaretle"
                    >
                      <input 
                        type="checkbox" 
                        checked={!!completedActions['action-1']} 
                        readOnly 
                        className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                    </button>
                  </div>
                  <h5 className={`text-sm font-bold leading-snug mb-1 ${completedActions['action-1'] ? 'line-through text-slate-400' : 'text-white'}`}>
                    {isCrisis 
                      ? 'Sulamayı kapalı tutun (Doğal yağış bekleniyor).' 
                      : 'Bugün saat 19:30\'dan sonra 45 dk damlama sulama uygulayın.'}
                  </h5>
                  <p className="text-[11px] text-emerald-200/70 font-medium mb-3">
                    {isCrisis 
                      ? 'Fırtına kök bölgesini 24 saat içinde doyuracaktır.' 
                      : 'Buharlaşma kaybını %26 azaltır, kök stresini önler.'}
                  </p>
                </div>

                {/* DOĞRUDAN YÖNLENDİRME BUTONU (DEEP-LINK) */}
                <button
                  type="button"
                  onClick={() => navigateToAnalysis('water-stress')}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-white text-xs font-bold transition-all flex items-center justify-between border border-blue-400/20"
                >
                  <span>Su & Nem Analizini Aç</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Eylem 2: Gübreleme / Besin Tavsiyesi & Kapsamlı Analize Derin Bağlantı */}
              <div 
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  completedActions['action-2']
                    ? 'bg-emerald-950/40 border-emerald-500/40 opacity-70'
                    : 'bg-white/10 hover:bg-white/15 border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                        <Beaker size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-200">2. Gübreleme Adımı</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleAction('action-2')}
                      className="p-1 text-emerald-400 hover:text-white"
                      title="Tamamlandı olarak işaretle"
                    >
                      <input 
                        type="checkbox" 
                        checked={!!completedActions['action-2']} 
                        readOnly 
                        className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                    </button>
                  </div>
                  <h5 className={`text-sm font-bold leading-snug mb-1 ${completedActions['action-2'] ? 'line-through text-slate-400' : 'text-white'}`}>
                    Azotlu gübrelemeyi rüzgar hızının düşeceği yarın sabah 06:30'a erteleyin.
                  </h5>
                  <p className="text-[11px] text-purple-200/70 font-medium mb-3">
                    Rüzgar 18 km/h altına inecek; azot uçuculuğu ve yaprak yanması önlenir.
                  </p>
                </div>

                {/* DOĞRUDAN YÖNLENDİRME BUTONU (DEEP-LINK) */}
                <button
                  type="button"
                  onClick={() => navigateToAnalysis('nutrients-npk')}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white text-xs font-bold transition-all flex items-center justify-between border border-purple-400/20"
                >
                  <span>NPK Besin Durumunu Aç</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Eylem 3: Hastalık & İklim Tavsiyesi & Kapsamlı Analize Derin Bağlantı */}
              <div 
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  completedActions['action-3']
                    ? 'bg-emerald-950/40 border-emerald-500/40 opacity-70'
                    : 'bg-white/10 hover:bg-white/15 border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                        <Bug size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-200">3. Hastalık & İklim</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleAction('action-3')}
                      className="p-1 text-emerald-400 hover:text-white"
                      title="Tamamlandı olarak işaretle"
                    >
                      <input 
                        type="checkbox" 
                        checked={!!completedActions['action-3']} 
                        readOnly 
                        className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                    </button>
                  </div>
                  <h5 className={`text-sm font-bold leading-snug mb-1 ${completedActions['action-3'] ? 'line-through text-slate-400' : 'text-white'}`}>
                    {isWarning 
                      ? 'Külleme mantarına karşı derhal koruyucu fungisit uygulayın.' 
                      : 'Nemli alt yaprakları külleme lekelerine karşı gözle kontrol edin.'}
                  </h5>
                  <p className="text-[11px] text-amber-200/70 font-medium mb-3">
                    {isWarning 
                      ? 'Risk %78; 48 saatte müdahale edilmezse verim %15 düşer.' 
                      : 'Erken teşhis sayesinde kimyasal ilaç masrafı minimize edilir.'}
                  </p>
                </div>

                {/* DOĞRUDAN YÖNLENDİRME BUTONU (DEEP-LINK) */}
                <button
                  type="button"
                  onClick={() => navigateToAnalysis('disease-radar')}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white text-xs font-bold transition-all flex items-center justify-between border border-amber-400/20"
                >
                  <span>Hastalık Radarına Git</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TEK MERKEZLİ VE SADELEŞTİRİLMİŞ NAVİGASYON (ÇİFTLEME KALDIRILDI) */}
      {/* ========================================================================= */}
      <nav className="flex space-x-2 sm:space-x-3 mb-6 border-b border-slate-200 overflow-x-auto scrollbar-hide pb-2">
        <button 
          onClick={() => setActiveMode('advisor')} 
          className={`min-h-[46px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'advisor' 
              ? 'bg-[#1B331B] text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
          }`}
        >
          <Sparkles size={16} className={activeMode === 'advisor' ? 'text-emerald-400' : 'text-slate-400'} />
          Otonom AI Danışmanı
        </button>

        <button 
          onClick={() => setActiveMode('dashboard')} 
          className={`min-h-[46px] px-5 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'dashboard' 
              ? 'bg-[#1B331B] text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
          }`}
        >
          <Layers size={16} className={activeMode === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'} />
          Kapsamlı Analiz (Tek Kaynak)
        </button>

        <button 
          onClick={() => setActiveMode('spectral')} 
          className={`min-h-[46px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeMode === 'spectral' 
              ? 'bg-[#1B331B] text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
          }`}
        >
          <Scan size={16} className={activeMode === 'spectral' ? 'text-emerald-400' : 'text-slate-400'} />
          IoT Mesh & Spektral
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 4. KAPSAMLI ANALİZ BÖLÜMÜ (TEK MERKEZ & KADEMELİ AÇILAN AKORDİYONLAR) */}
      {/* ========================================================================= */}
      {activeMode === 'dashboard' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Merkezi Analiz</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {activeField.name} — Tüm Zirai Parametreler Tek Noktada
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Su, iklim, besin ve hastalık verileri tek merkezde toplanmıştır. Ayrıntı için kartlara dokunun.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 3 İdeal</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 1 Dikkat</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 1 Risk</span>
            </div>
          </div>

          {/* AKORDİYON KART 1: SU & NEM DENGESİ (TEK KAYNAK - FAO-56) */}
          <ProgressiveAccordionCard
            id="water-stress"
            title="Su ve Nem Dengesi (Kök Bölgesi)"
            category="FAO-56 Su Bilimi"
            status={isCrisis ? 'Kritik' : 'İyi'}
            badgeText={isCrisis ? 'Kritik / %18 Nem' : 'Yeterli / %34 Nem'}
            summary="Toprak nemi ve kök su açığı (18mm) güvenli aralıktadır. Bitki susuzluk stresi yaşamıyor ve evapotranspirasyon normal seviyededir."
            primaryMetric={{ label: 'Toprak Nemi', value: `%${currentMoisture}` }}
            secondaryMetric={{ label: 'Su Açığı (Dr)', value: '18 mm' }}
            icon={<Droplets className="text-blue-500" size={24} />}
            isOpen={expandedSection === 'water-stress'}
            onToggle={() => toggleAccordion('water-stress')}
          >
            <div className="bg-white rounded-3xl p-5 border border-slate-200">
              <WaterSoilAnalysisPanel fieldName={activeField.name} />
            </div>
          </ProgressiveAccordionCard>

          {/* AKORDİYON KART 2: SICAKLIK, BUHAR AÇIĞI (VPD) VE İKLİM */}
          <ProgressiveAccordionCard
            id="climate-vpd"
            title="Sıcaklık, Buhar Açığı (VPD) ve Biyokütle (GDD)"
            category="İklim & Büyüme"
            status="İyi"
            badgeText="İdeal / 24°C"
            summary="Hava sıcaklığı bitki gelişimi için çok uygun. Buharlaşma açığı (VPD 1.8 kPa) gün ortasında takip edilmelidir."
            primaryMetric={{ label: 'Hava Sıcaklığı', value: '24°C' }}
            secondaryMetric={{ label: 'VPD Değeri', value: '1.8 kPa' }}
            icon={<ThermometerSun className="text-orange-500" size={24} />}
            isOpen={expandedSection === 'climate-vpd'}
            onToggle={() => toggleAccordion('climate-vpd')}
          >
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200">
                <ClimateAnalysisPanel fieldName={activeField.name} />
              </div>
              <FactorCard 
                title="Buhar Basıncı Açığı (VPD)"
                currentValue="1.8"
                unit="kPa"
                status="Dikkat"
                referenceRange="0.8 - 1.5 kPa"
                changeValue="0.4 kPa artış"
                changeType="up"
                impactDescription="Hava şu an kuru ve sıcak olduğu için bitkiniz daha fazla terliyor. Yüksek VPD, yaprak stomalarının kapanmasına yol açabilir."
                suggestion="Planlanan sulamayı akşam serinliğinde yaparak buharlaşma kaybını azaltın."
                dataSource="Yerel İstasyon & Open-Meteo"
                lastUpdated="10 dakika önce"
                detailedAnalysis="VPD, sıcaklık ve bağıl nem arasındaki buharlaşma potansiyelidir."
                calculationMethod="VPD = e_s(T) - e_a(T, RH) (Tetens formülü)"
                icon={<Wind className="text-blue-500" />}
              />
            </div>
          </ProgressiveAccordionCard>

          {/* AKORDİYON KART 3: TOPRAK BESİN MADDELERİ (NPK DENGESİ) */}
          <ProgressiveAccordionCard
            id="nutrients-npk"
            title="Toprak Besin Seviyesi (NPK Dengesi)"
            category="Toprak Kimyası"
            status="İyi"
            badgeText="İdeal / NO3 86 ppm"
            summary="Azot ve potasyum seviyeleri mısırın çiçeklenme evresi için ideal düzeyde. Fosfor seviyesi hafif takviye gerektirebilir."
            primaryMetric={{ label: 'Azot (NO3-N)', value: '86 ppm' }}
            secondaryMetric={{ label: 'Toprak pH', value: '6.8' }}
            icon={<Beaker className="text-purple-500" size={24} />}
            isOpen={expandedSection === 'nutrients-npk'}
            onToggle={() => toggleAccordion('nutrients-npk')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FactorCard 
                title="Nitrat Azotu (NO3-N)" 
                currentValue="86" 
                unit="ppm" 
                status="İyi" 
                referenceRange="40 - 90 ppm" 
                changeValue="2 ppm artış" 
                changeType="up"
                impactDescription="Azot seviyesi yaprak gelişimi ve fotosentez için optimum düzeydedir."
                suggestion="Mevcut gübreleme dengesini koruyun, ek müdahale gerekmemektedir."
                dataSource="Toprak NPK Sensörü" 
                lastUpdated="1 saat önce" 
                icon={<Beaker className="text-emerald-500"/>}
              />
              <FactorCard 
                title="Alınabilir Fosfor (P2O5)" 
                currentValue="42" 
                unit="ppm" 
                status="Dikkat" 
                referenceRange="45 - 65 ppm" 
                changeValue="1 ppm düşüş" 
                changeType="down"
                impactDescription="Fosfor seviyesi referansın sınırında. Kök ve koçan gelişimini desteklemek için hafif fosfor takviyesi önerilir."
                suggestion="Damla sulama sistemine fosfor içerikli sıvı gübre (örn: MAP) eklenmesi uygundur."
                dataSource="Sensör & Tahminleme" 
                lastUpdated="Dün 14:30" 
                icon={<Beaker className="text-amber-500"/>}
              />
            </div>
          </ProgressiveAccordionCard>

          {/* AKORDİYON KART 4: ZİRAİ HASTALIK & ZARARLI RADARI */}
          <ProgressiveAccordionCard
            id="disease-radar"
            title="Zirai Hastalık & Zararlı Radarı"
            category="Epidemiyoloji Modeli"
            status={isWarning ? 'Kritik' : 'Dikkat'}
            badgeText={isWarning ? 'Kritik Risk / %84' : 'Riskli / %78 Külleme'}
            summary="Gece nemi ve sıcaklık farkı külleme mantar sporlarının çimlenmesine elverişli ortam oluşturuyor. Koruyucu ilaçlama önerilir."
            primaryMetric={{ label: 'Külleme Riski', value: isWarning ? '%84' : '%78' }}
            secondaryMetric={{ label: 'Yaprak Islaklığı', value: '4.2 saat' }}
            icon={<Bug className="text-rose-500" size={24} />}
            isOpen={expandedSection === 'disease-radar'}
            onToggle={() => toggleAccordion('disease-radar')}
          >
            <FactorCard 
              title="Külleme (Powdery Mildew) Riski" 
              currentValue="%78" 
              unit="Risk Skoru" 
              status="Kritik" 
              referenceRange="<%40" 
              changeValue="%15 artış" 
              changeType="up"
              impactDescription="Yüksek bağıl nem (%68) ve 24°C sıcaklık mantar sporlarının çimlenmesi için yüksek risk oluşturuyor."
              suggestion="Önümüzdeki 48 saat içerisinde yaprak hastalıklarına karşı koruyucu fungisit uygulaması yapılması şiddetle tavsiye edilir."
              dataSource="AI Hastalık Modeli" 
              lastUpdated="30 dakika önce"
              detailedAnalysis="Model, 'Yaprak Islaklığı Süresi' ve 'VPD' değerlerini entegre ederek risk projeksiyonu üretir."
              calculationMethod="Risk = f(T_avg, Bağıl_Nem, Yaprak_Islaklık_Süresi)" 
              icon={<Bug className="text-rose-500"/>}
            />
          </ProgressiveAccordionCard>

          {/* AKORDİYON KART 5: SON İŞLEMLER VE MÜDAHALELER */}
          <ProgressiveAccordionCard
            id="field-ops"
            title="Son Saha İşlemleri ve Kayıtlar"
            category="İşlem Defteri"
            status="İyi"
            badgeText="2 İşlem Tamamlandı"
            summary="Son 48 saatte koruyucu sulama (25mm) ve telemetri kalibrasyonu başarıyla kayda geçirildi."
            primaryMetric={{ label: 'Son Sulama', value: '25 mm' }}
            secondaryMetric={{ label: 'Durum', value: 'Başarılı' }}
            icon={<ListChecks className="text-teal-600" size={24} />}
            isOpen={expandedSection === 'field-ops'}
            onToggle={() => toggleAccordion('field-ops')}
          >
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Droplets size={18}/></div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Koruyucu Damlama Sulama</h5>
                    <p className="text-xs text-slate-500">25mm su uygulandı • Buharlaşma kaybı: %8</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black text-slate-700">Dün, 18:30</span>
                  <span className="text-[11px] font-bold text-emerald-600">Tamamlandı</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><CheckCircle2 size={18}/></div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">NPK Sensör Kalibrasyonu</h5>
                    <p className="text-xs text-slate-500">Toprak altı prob okumaları sıfırlandı</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black text-slate-700">3 gün önce</span>
                  <span className="text-[11px] font-bold text-emerald-600">Aktif</span>
                </div>
              </div>
            </div>
          </ProgressiveAccordionCard>

        </div>
      ) : activeMode === 'advisor' ? (
        
        /* OTONOM DANIŞMAN FİNANSAL VE HASTALIK ÖZETİ */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 mr-3">
                    <CircleDollarSign size={22}/>
                  </div>
                  <h4 className="font-black text-base sm:text-lg text-slate-900">Doğrulanmış Finansal Etki</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5">
                  TerraMind'ın <strong className="text-slate-800">{activeField.name}</strong> üzerindeki otonom kararlarının doğrudan bütçenize katkısı:
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Aylık Tasarruf</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-600">₺{monthlyProjectedSavings}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Beklenen Hasat Artışı</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600">%{expectedYieldIncrease}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 mr-3">
                    <Bug size={22}/>
                  </div>
                  <h4 className="font-black text-base sm:text-lg text-slate-900">Zirai Hastalık Riski</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4">
                  Toprak nemi (%{currentMoisture}) ve gece yaprak ıslaklığı süresi çaprazlanarak hesaplanır.
                </p>
              </div>
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-rose-900 text-sm">Külleme (Powdery Mildew)</span>
                  <span className="bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-xl text-xs font-black">YÜKSEK RİSK (%78)</span>
                </div>
                <div className="w-full bg-rose-100 rounded-full h-2.5 mb-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full w-[78%]"></div>
                </div>
                <p className="text-xs font-medium text-rose-800 leading-relaxed">
                  Nem ve gece serinliği mantar sporları için uygun ortam oluşturuyor. Koruyucu ilaçlama rekolte kaybını önler.
                </p>
              </div>
            </div>
          </div>

          {/* TEK MERKEZLİ KAPSAMLI ANALİZE GEÇİŞ KARTI */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#132B16] to-slate-900 rounded-3xl p-6 text-white border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="font-black text-white text-base sm:text-lg">Kapsamlı Analiz Merkezini Keşfedin</h4>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                  Su, sıcaklık, toprak besinleri ve zararlı analizlerinin tamamını tek merkezden kademeli olarak inceleyin.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode('dashboard')}
              className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 shrink-0 shadow-lg"
            >
              <span>Kapsamlı Analizi Aç</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      ) : (
        /* SPEKTRAL & IOT MESH */
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Drone Görselleştirme */}
            <div className="lg:col-span-2 bg-[#0B1121] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden h-[380px]">
              <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1121]/30 to-[#0B1121]/90"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div> CANLI DRONE
                </span>
                <span className="bg-[#0F172A]/80 border border-slate-700 text-emerald-400 text-[10px] font-black px-2 py-1 rounded font-mono">
                  AI VISION: AKTİF
                </span>
              </div>

              <div className="absolute top-4 right-4 text-[10px] font-mono text-emerald-400 text-right bg-black/50 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                <p>TARLA: {activeField.name}</p>
                <p>NDVI: {activeField.ndvi || 0.82}</p>
              </div>

              <div className="absolute top-[35%] left-[25%] w-28 h-32 border-2 border-emerald-500 rounded-lg bg-emerald-500/10 flex flex-col justify-end p-1">
                <div className="bg-emerald-600 text-white text-[9px] font-black px-1 py-0.5 rounded-xs">SAĞLIKLI [%96]</div>
              </div>

              <div className="absolute bottom-[25%] right-[30%] w-24 h-28 border-2 border-amber-500 rounded-lg bg-amber-500/10 flex flex-col justify-end p-1">
                <div className="bg-amber-600 text-white text-[9px] font-black px-1 py-0.5 rounded-xs">NEM AÇIĞI [%58]</div>
              </div>
            </div>

            {/* 3D Toprak Kesiti */}
            <div className="bg-[#0B1121] rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col h-[380px]">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="text-blue-400" size={18} />
                <h4 className="text-white font-black text-sm">3D Toprak Katman Profili</h4>
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col">
                <div className="h-[25%] bg-gradient-to-b from-[#2D5A27] to-[#3E2723] p-2 flex justify-between items-start border-b border-white/10">
                  <span className="text-[10px] font-bold text-emerald-300">Yüzey (0-10cm)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-black/40 px-1 rounded">NPK: İDEAL</span>
                </div>
                <div className="h-[45%] bg-gradient-to-b from-[#3E2723] to-[#261612] p-2 flex flex-col justify-between border-b border-white/10">
                  <span className="text-[10px] font-bold text-orange-200">Kök Bölgesi (10-40cm)</span>
                  <div className="w-full h-7 bg-black/50 rounded-full mt-1 relative overflow-hidden border border-white/10">
                    <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isCrisis ? 'bg-rose-500 w-[18%]' : 'bg-emerald-500 w-[78%]'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                      KÖK NEMİ: %{currentMoisture}
                    </div>
                  </div>
                </div>
                <div className="h-[30%] bg-[#1A0F0D] p-2 flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500">Derin Taban (40-80cm)</span>
                  <span className="text-[10px] font-mono text-blue-400/80">Rezerv: Yeterli</span>
                </div>
              </div>
            </div>

          </div>

          {/* IoT Mesh Ağı Sinyal Durumu */}
          <div className="bg-[#050B14] rounded-3xl border border-slate-800 p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="text-emerald-400" size={18} />
                <h4 className="text-white font-black text-sm">ESP-NOW IoT Düğüm Ağı (Canlı)</h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                PDR: %{pdr.toFixed(1)} • KESİNTİSİZ
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-xs">NODE-01 (Kuzey İstasyonu)</h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Sinyal: {node1Rssi} dBm (Mükemmel)</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-xs">NODE-02 (Güney Prob)</h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {isNode2Sleeping ? 'Pil Koruma (Deep Sleep)' : `Sinyal: ${node2Rssi} dBm`}
                    </p>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${isNode2Sleeping ? 'bg-slate-500' : 'bg-blue-400 animate-pulse'}`}></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}