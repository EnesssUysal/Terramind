import React, { useState, useEffect } from 'react';

export interface FieldItem {
  id: string;
  name: string;
  location: string;
  area: string;
  status: 'Sağlıklı' | 'Dikkat' | 'Kritik';
  lat: number;
  lng: number;
  crop: string;
  ndviScore?: number;
  moisture?: number;
  polygon?: [number, number][];
}

const DEFAULT_FIELDS: FieldItem[] = [
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
  },
];

export interface FieldsTabProps {
  fields?: FieldItem[];
  selectedFieldId?: string;
  onSelectField?: (id: string) => void;
  onOpenDetail?: (title: string) => void;
  onAddNewField?: () => void;
  onDeleteField?: (id: string) => void;
}

export const FieldsTab: React.FC<FieldsTabProps> = ({ 
  fields: propFields,
  selectedFieldId, 
  onSelectField, 
  onOpenDetail, 
  onAddNewField,
  onDeleteField 
}) => {
  const [localFields, setLocalFields] = useState<FieldItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (propFields !== undefined) {
      setLocalFields(propFields);
      return;
    }
    const saved = localStorage.getItem('terramind_user_fields');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalFields(parsed);
          return;
        }
      } catch {}
    }
    setLocalFields(DEFAULT_FIELDS);
    localStorage.setItem('terramind_user_fields', JSON.stringify(DEFAULT_FIELDS));
  }, [propFields]);

  const fields = propFields !== undefined ? propFields : localFields;

  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = fields.find((f) => f.id === id);
    const targetName = target ? target.name : 'Bu tarlayı';
    if (window.confirm(`"${targetName}" arazisini kayıtlardan silmek istediğinize emin misiniz?`)) {
      if (onDeleteField) {
        onDeleteField(id);
      }
      const updated = fields.filter((f) => f.id !== id);
      setLocalFields(updated);
      localStorage.setItem('terramind_user_fields', JSON.stringify(updated));
    }
  };

  const filteredFields = fields.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArea = fields.reduce((acc, f) => {
    const num = parseFloat(f.area.replace(/[^0-9.]/g, '')) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/40 text-slate-800 p-4 md:p-6 pb-28 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Canlı Üst İstatistik Paneli */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
              🌱 Arazi Portföyü
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tarlalarım ve Parsellerim
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Hesabınıza bağlı tüm aktif tarım arazilerinin uydu ve durum analizi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onAddNewField}
              className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              Yeni Tarla Ekle
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 text-center flex-1">
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Kayıtlı Tarla</p>
                <p className="text-2xl font-black">{fields.length}</p>
              </div>
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 text-center flex-1">
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Toplam Arazi</p>
                <p className="text-2xl font-black">{totalArea.toFixed(1)} <span className="text-xs font-medium">Dönüm</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Renkli Arama Arayüzü */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Tarla adı, ürün veya ilçe ara..."
            className="w-full bg-white text-sm text-slate-800 placeholder-slate-400 px-5 py-3.5 rounded-2xl border border-emerald-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Tarla Kartları Izgarası */}
        {filteredFields.length === 0 ? (
          <div className="p-12 text-center bg-white/60 rounded-3xl border border-dashed border-emerald-200">
            <p className="text-slate-500 text-base font-medium mb-4">Kayıtlı tarla bulunamadı.</p>
            <button
              onClick={onAddNewField}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <span>+</span>
              Şimdi İlk Tarlanızı Ekleyin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => {
              const isSelected = selectedFieldId === field.id;
              return (
                <div
                  key={field.id}
                  onClick={() => {
                    if (onSelectField) onSelectField(field.id);
                    if (onOpenDetail) onOpenDetail('analysis');
                  }}
                  className={`bg-white hover:bg-slate-50/90 rounded-3xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-900/10 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${
                    isSelected 
                      ? 'ring-2 ring-emerald-500 border-2 border-emerald-500 shadow-emerald-500/10' 
                      : 'border border-slate-200/80 hover:border-emerald-400'
                  }`}
                >
                  {/* Üst Vurgu Çubuğu */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${isSelected ? 'from-emerald-500 via-teal-400 to-emerald-600' : 'from-emerald-400 via-teal-400 to-sky-400'}`} />

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3 pt-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {field.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                              AKTİF
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          📍 {field.location}
                        </p>
                      </div>

                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm shrink-0">
                        🌾 {field.crop}
                      </span>
                    </div>

                    <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono text-slate-600 mb-4 border border-slate-200">
                      {field.lat.toFixed(4)}, {field.lng.toFixed(4)}
                    </div>

                    {/* Metrik Kutuları */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 text-xs mb-4">
                      <div>
                        <span className="text-slate-500 block text-[11px] font-medium">Arazi Büyüklüğü</span>
                        <span className="font-bold text-slate-800 text-sm">{field.area}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] font-medium">NDVI Canlılık</span>
                        <span className="font-bold text-emerald-600 text-sm">+{field.ndviScore || 0.76}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alt İşlem Barı */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                        field.status === 'Sağlıklı'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {field.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectField) onSelectField(field.id);
                          if (onOpenDetail) onOpenDetail('analysis');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl transition-all text-xs font-bold shadow-xs flex items-center gap-1"
                      >
                        <span>Analiz & Detay</span>
                        <span>→</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteField(field.id, e)}
                        className="px-2.5 py-1.5 text-rose-500 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100/90 border border-rose-200/80 rounded-xl transition-all text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                        title="Tarlayı Sil"
                      >
                        <span>🗑️</span>
                        <span className="text-[11px]">Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsTab;
