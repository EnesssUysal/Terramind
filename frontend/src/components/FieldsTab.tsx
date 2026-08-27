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
}

const DEFAULT_FIELDS: FieldItem[] = [
  {
    id: '1',
    name: 'Kuzey Tarlası',
    location: 'Kayseri / Develi',
    area: '42.0 Dönüm',
    status: 'Sağlıklı',
    lat: 38.6520,
    lng: 35.6230,
    crop: 'Buğday',
    ndviScore: 0.76,
    moisture: 38,
  },
];

export const FieldsTab: React.FC = () => {
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('terramind_user_fields');
    if (saved) {
      setFields(JSON.parse(saved));
    } else {
      setFields(DEFAULT_FIELDS);
      localStorage.setItem('terramind_user_fields', JSON.stringify(DEFAULT_FIELDS));
    }
  }, []);

  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bu tarlayı kayıtlardan silmek istediğinize emin misiniz?')) {
      const updated = fields.filter((f) => f.id !== id);
      setFields(updated);
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

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Kayıtlı Tarla</p>
              <p className="text-2xl font-black">{fields.length}</p>
            </div>
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Toplam Arazi</p>
              <p className="text-2xl font-black">{totalArea.toFixed(1)} <span className="text-xs font-medium">Dönüm</span></p>
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
            <p className="text-slate-500 text-base font-medium">Kayıtlı tarla bulunamadı.</p>
            <p className="text-xs text-slate-400 mt-1">Ana sayfadaki formu kullanarak yeni tarlalar ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <div
                key={field.id}
                className="bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-900/10 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Üst Vurgu Çubuğu */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3 pt-1">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {field.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        📍 {field.location}
                      </p>
                    </div>

                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
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
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
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

                  <button
                    onClick={(e) => handleDeleteField(field.id, e)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Tarlayı Sil"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsTab;
