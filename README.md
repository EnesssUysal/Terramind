<div align="center">

<img src="design/logo.png" width="170"/>

# 🌱 TerraMind

### Akıllı Tarım Platformu

### **Veri • Zekâ • Verim**

Toprağı anlayan, verileri analiz eden ve üreticiye doğru zamanda doğru kararı vermesinde yardımcı olan yapay zekâ destekli dijital tarım platformu.

🚧 **Proje aktif olarak geliştirilmektedir.**

---

![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![Version](https://img.shields.io/badge/Version-v0.1%20Beta-blue)
![Platform](https://img.shields.io/badge/Platform-Web-green)
![AI](https://img.shields.io/badge/AI-Integrated-brightgreen)
![License](https://img.shields.io/badge/License-MIT-orange)

</div>

---

# 📖 Proje Hakkında

TerraMind; sensörler, yapay zekâ ve veri analizi teknolojilerini tek platform altında birleştirerek tarımsal üretimi daha verimli, sürdürülebilir ve öngörülebilir hale getirmeyi amaçlayan akıllı tarım platformudur.

Platform, yalnızca verileri göstermek yerine üreticiye **"Şu anda ne oluyor?"**, **"Neden oluyor?"** ve **"Şimdi ne yapmalıyım?"** sorularının cevaplarını sunmayı hedeflemektedir.

---

# 📱 Uygulama Görselleri

## Splash Screen • Giriş Yap • Ana Sayfa

<p align="center">
<img src="design/screenshots/splash.png" width="220"/>
<img src="design/screenshots/login.png" width="220"/>
<img src="design/screenshots/anaekran2.png" width="220"/>
</p>

---

## Uydu Haritası • Yapay Zekâ • Profil

<p align="center">
<img src="design/screenshots/anaekran1.5map.png" width="220"/>
<img src="design/screenshots/ai.png" width="220"/>
<img src="design/screenshots/profil.png" width="220"/>
</p>

---

## Tarlalar

<p align="center">
<img src="design/screenshots/tarla.png" width="220"/>
</p>

---

# 🚀 Özellikler

### 🌾 Tarla Yönetimi

- Çoklu tarla desteği
- Tarla sağlık skoru
- Tarla bazlı analiz
- Bölgesel durum takibi

### 🛰️ Akıllı Harita

- Uydu görüntüsü
- Dijital tarla haritası
- Bölgesel analiz
- Katman sistemi

### 📊 Toprak Analizi

- Toprak Nemi
- Su Durumu
- pH
- Azot
- Fosfor
- Hastalık Riski

### 🤖 Yapay Zekâ

- Tarımsal öneriler
- Günlük analiz
- Yapay zekâ sohbet sistemi
- Sensör verilerine göre yorumlama

### 📈 Veri Takibi

- Sensör kartları
- Grafikler
- Günlük değişimler
- Anlık durum analizi

### 🌦️ Hava Durumu

- Konuma özel hava durumu
- Tarımsal etkiler
- Sulama önerileri

---

# 🎯 Vizyon

TerraMind'ın amacı yalnızca sensör verilerini gösteren bir uygulama geliştirmek değildir.

Uzun vadede sensörler, yapay zekâ, veri analizi ve otonom tarım teknolojilerini tek platform altında toplayarak üreticinin karar süreçlerini kolaylaştıran kapsamlı bir dijital tarım ekosistemi oluşturmayı hedeflemektedir.

---

# 🛠️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| React | Kullanıcı Arayüzü |
| TypeScript | Uygulama Geliştirme |
| Vite | Build Tool |
| Material Design 3 | Tasarım Sistemi |
| Google AI Studio | Arayüz Geliştirme |
| Git & GitHub | Versiyon Kontrol |

---

# 💻 Kurulum ve Çalıştırma

Proje, birbirine entegre çalışan bir **Ön Yüz (Frontend)** ve **Arka Yüz (Backend)** bileşenlerinden oluşmaktadır. Geliştirme aşamasında test esnekliği sağlamak amacıyla, arka yüz sunucusu kapalı olduğunda sistem çökmez; **çevrimdışı/simülasyon modu** devreye girerek kesintisiz uygulama deneyimi sunar.

### 1. Arka Yüzü (Backend) Başlatmak (Gerçek Analizler İçin)
Uygulamadaki FAO-56 tabanlı su analizleri ve İklim & GDD hesaplamalarının gerçek zamanlı çalışabilmesi için arka uç sunucusunun aktif olması gerekir. Yeni bir terminal penceresinde:
```bash
cd backend
npm install
node index.js
```
*(Sunucu varsayılan olarak 3001 portunda çalışacaktır.)*

### 2. Ön Yüzü (Frontend) Başlatmak
```bash
cd frontend
npm install
npm run dev
```

> **Not:** Backend sunucusunu çalıştırmazsanız, Analiz sekmeleri (Su & Nem, Sıcaklık & Güneş vb.) sonsuz yükleme ekranında kalmaz. Sistem otomatik olarak bağlantı yokluğunu algılar ve bileşenleri mock/simülasyon verileri ile doldurarak demoyu sürdürür.

---

# 📈 Geliştirme Durumu

Projede arayüz bileşenlerinin (UI) neredeyse tamamı kodlanmış ve temel arka uç (backend) analiz API'leri devreye alınmıştır.

| Modül | Durum | Açıklama |
|--------|:----:|---|
| **Kullanıcı Deneyimi (UI/UX)** | | |
| Splash Screen & Auth | ✅ | Giriş ve kayıt arayüzleri tamamlandı. |
| Ana Sayfa (Dashboard) | ✅ | Dinamik kartlar ve genel bakış aktif. |
| Uydu Haritası | ✅ | Leaflet.js ve NDVI spektral simülasyonları hazır. |
| Yapay Zekâ & Chat | ✅ | AI tahmin zaman çizelgesi ve XAI (Açıklanabilirlik) eklendi. |
| Tarlalar | ✅ | Tarla ekleme ve çoklu tarla detay takibi aktif. |
| Profil & Ayarlar | ✅ | Özelleştirilebilir profil ekranı tamamlandı. |
| **Analiz & Veri** | | |
| Toprak & Su Analizi | ✅ | FAO-56 su dengesi hesaplamaları aktif. |
| İklim & Güneş (GDD) | ✅ | Gelişim Derece Günleri (GDD) hesaplamaları aktif. |
| Karbon Ayakizi & MRV | ✅ | Karbon salınım hesaplama ve blockchain-vari MRV arayüzü eklendi. |
| Hibe & Destek | ✅ | Akıllı tarım hibe eşleştirici (Grantmatcher) eklendi. |
| Hava Durumu | ✅ | Çevresel tahmin simülasyonları tamamlandı. |
| **Arka Plan (Backend)** | | |
| Backend Core API | ✅ | Node.js / Express altyapısı kuruldu. |
| Firebase Veritabanı | ✅ | Temel canlı veri yazma/okuma aktif. |
| Sensör Donanımı | ⏳ | UI tarafı (SensorsList, Detail) bitti, donanım bekleniyor. |

---

# 🛣️ Yol Haritası

## ✅ v0.1 ve v0.2 (Tamamlandı)
- [x] Tüm temel ekranların (Ana Sayfa, Tarlalar, Analiz, Profil) kodlanması.
- [x] Dijital Tarla Haritası (Leaflet entegrasyonu).
- [x] Yapay Zekâ Arayüzleri (SmartAiControl, Explainability).
- [x] Analiz Sayfaları (GDD ve FAO-56 Simülasyonları).
- [x] Hava Durumu ve Sensör Detay UI bileşenleri.
- [x] Temel Backend API ve Firebase entegrasyonu.

---

## 🚧 v0.3 (Mevcut Odak)
- ESP32 ve gerçek sensör cihazlarının donanım entegrasyonu.
- Sensör verilerinin canlı (WebSocket) olarak harita ve grafiklere aktarılması.
- OpenWeather API ile gerçek zamanlı meteoroloji verilerinin çekilmesi.
- Tam kapsamlı kullanıcı kimlik doğrulama (JWT/Firebase Auth).

---

## 🚀 v1.0 (Hedef)
- Tam Otonom Yapay Zekâ Karar Sistemi (Gerçek LLM Entegrasyonu).
- Akıllı Sulama Sistemleri ve Vana Kontrolü.
- Kapsamlı Sensör Ağı Yönetimi.
- Mobil Uygulama Çıkışı (React Native).

# 📂 Proje Yapısı

```text
AI-Smart-Farming
│
├── ai/
├── assets/
├── backend/
├── design/
│   ├── logo/
│   └── screenshots/
├── docs/
├── frontend/
├── hardware/
├── tests/
└── README.md
```

---

# 🌍 Gelecek Hedefleri

- 🌱 Gerçek sensör entegrasyonu
- ☁️ Bulut tabanlı veri yönetimi
- 🤖 Gelişmiş yapay zekâ karar sistemi
- 📱 Mobil uygulama
- 🚜 Otonom tarım araçları entegrasyonu
- 🌍 Küresel ölçekte kullanılabilecek dijital tarım platformu

---

# 🤝 Katkıda Bulunma

TerraMind aktif olarak geliştirilmektedir.

Her türlü öneri, geri bildirim ve katkı projeyi daha ileri taşımamıza yardımcı olacaktır.

---

<div align="center">

## 🌱 TerraMind

### **Veri • Zekâ • Verim**

*"Toprağı anlayan teknoloji, geleceği şekillendirir."*

⭐ Projeyi beğendiysen yıldız vermeyi unutma.

</div>