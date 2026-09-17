# 🌾 TerraMind

### Otonom Zirai Karar Destek Sistemi (DSS) — Deep-Tech Akıllı Tarım Platformu

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-061631?logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini_API-2.0_Flash-4285F4?logo=google&logoColor=white" />
  <img alt="ESP-NOW" src="https://img.shields.io/badge/IoT-ESP--NOW_Mesh-2E7D32" />
</p>

> TerraMind, tarlaları sadece **izlemekle** kalmaz — sensör verisini, yapay zekayı ve iklim finansmanını birleştirerek **otonom kararlar alır**: sulamayı kendi başına iptal eder, karbon verisini doğrular, çiftçiyi gerçek devlet hibelerine yönlendirir.

---

## 🚩 Problem

Türkiye'de tarımsal sulamanın büyük bölümü hâlâ deneyime dayalı, gerçek zamanlı veri ve hava tahmini olmadan yapılıyor. Sonuç: gereksiz su/enerji tüketimi, önlenebilir rekolte kayıpları ve verinin doğrulanamaması nedeniyle karbon/iklim finansmanı fırsatlarının kaçırılması.

## 💡 Çözüm

TerraMind, sahadaki IoT sensör ağından gelen veriyi üç katmanda işler:

1. **Alg** — ham sensör verisini (nem, sıcaklık, azot, pH) gerçek zamanlı yorumlar
2. **Karar** — bir yapay zeka modeli (Gemini 2.0 Flash), bu veriyi hava tahminiyle birleştirip otonom sulama kararları alır
3. **Etki** — alınan her kararı parasal karşılığa, karbon tasarrufuna ve doğrulanabilir bir kayda çevirir

---

## ⚙️ Öne Çıkan Modüller (Gerçek Mühendislik Detayları)

Aşağıdakilerin hepsi çalışan kod — mock veri kullanılan yerler açıkça belirtilmiştir, abartılı iddia yoktur.

### 1. Kriz Simülasyonu & Otonom Karar Destek (DSS)
Toprak nemi kritik eşiğin altına düştüğünde sistem otomatik alarm üretir; yapay zeka hava tahminine (yağış olasılığı) bakarak sulamayı **otonom olarak iptal eder ya da manuel müdahaleyi risk analiziyle** (kök çürümesi riski, su israfı tahmini) sunar.

### 2. IDW Algoritmalı Gerçek Isı Haritası (Digital Twin)
Sahadaki sensör düğümlerinin nem verisi, statik/sabit renklerle değil, **Inverse Distance Weighting (IDW)** enterpolasyonu ile hesaplanır: her piksel, tüm sensörlerin uzaklığa göre ağırlıklandırılmış ortalamasıdır. Canvas üzerinde piksel piksel hesaplanıp gerçek bir bulut/gradient dokusu üretir; sensör verisi periyodik olarak küçük rastgele sapmalarla ("jitter") güncellenerek canlı telemetri hissi verir.

### 3. Doğrulanabilir Karbon Kaydı (MRV Defteri)
Karbon piyasalarının en büyük sorunu **MRV** (Measurement, Reporting, Verification) — yani verinin doğrulanabilirliği. TerraMind, her tasarruf olayını bir önceki kaydın hash'ini referans alan basit bir **hash-zinciri** (FNV-1a tabanlı) ile kaydeder. "Zincir Bütünlüğünü Doğrula" butonu, zinciri gerçekten yeniden hesaplayıp kayıtların değiştirilmediğini kanıtlar.

### 4. Sürdürülebilir Tarım Hibe Eşleştirici
Çiftliğin doğrulanmış performansını (akıllı sulama kullanımı, bölge ortalamasının altında karbon salınımı), **gerçek, güncel devlet destek programlarıyla** (IPARD III / TKDK, KKYDP Akıllı Tarım Uygulamaları Desteği) eşleştirip örnek bir yatırım tutarı üzerinden tahmini destek miktarını (₺) hesaplar.

### 5. Gemini API ile Bağlamsal Yapay Zeka Asistanı
Sohbet ekranı, önceden yazılmış senaryolarla değil, **gerçek Gemini 2.0 Flash API'sine** her seferinde tarlanın güncel sensör verisiyle (nem, sıcaklık, azot, pH, NDVI) zenginleştirilmiş bir prompt göndererek yanıt üretir.

### 6. Finansal Etki & Rekolte Risk Skoru
Su/enerji tasarrufunu ₺'ye, karbon salınım farkını ağaç-eşdeğerine çevirir; kriz anında rekolte risk skorunu ve beklenen rekolte değişimini canlı günceller.

---

## 🛠️ Teknik Mimari

| Katman | Teknoloji | Not |
|---|---|---|
| Arayüz | React 18 + TypeScript, Vite 6 | |
| Stil | Tailwind CSS v4 (`@tailwindcss/vite`) | |
| Grafik/Görselleştirme | Recharts, HTML5 Canvas (özel IDW motoru) | |
| Harita | Leaflet + react-leaflet, Turf.js (alan hesaplama) | |
| Yapay Zeka | Google Gemini API (`gemini-2.0-flash`) | İstemci tarafında `.env` üzerinden anahtar |
| Animasyon | Motion (Framer Motion) | |
| Durum Yönetimi | React state + `localStorage` (kullanıcı tarlaları) | |
| IoT Katmanı | ESP-NOW mesh ağı simülasyonu | Şu an mock veri; gerçek donanım entegrasyonuna hazır arayüz |

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Projeyi klonlayın
git clone https://github.com/EnesssUysal/AI-Smart-Farming.git
cd AI-Smart-Farming/frontend

# Bağımlılıkları yükleyin
npm install

# Gemini API anahtarınızı ekleyin
# .env.example dosyasını .env olarak kopyalayıp VITE_GEMINI_API_KEY değerini girin

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

---

## 📸 Ekran Görüntüleri

> Ekran görüntülerini eklemek için: uygulamadan aldığınız görselleri bu reponun
> `docs/screenshots/` klasörüne koyun, sonra aşağıdaki satırları güncelleyin
> (örnek: `![Kriz Simülasyonu](docs/screenshots/kriz-simulasyonu.png)`).
> Dosya oraya eklenmeden bağlantılar açılmaz — bu, henüz eklenmediği için bilerek
> boş bırakılmıştır.

- [ ] `docs/screenshots/kriz-simulasyonu.png` — Kriz Simülasyonu & AI Müdahalesi
- [ ] `docs/screenshots/dijital-ikiz.png` — IDW Isı Haritası (Digital Twin)
- [ ] `docs/screenshots/mrv-defteri.png` — Doğrulanabilir Karbon Kaydı
- [ ] `docs/screenshots/ai-sohbet.png` — Gemini API Sohbet Ekranı

---

## 🗺️ Yol Haritası

- [ ] Gerçek ESP-NOW donanımıyla saha testi
- [ ] MRV hash-zincirini gerçek bir blockchain/anchoring servisine bağlama
- [ ] Görsel (yaprak fotoğrafı) analizini Gemini Vision API'ye taşıma
- [ ] Çoklu çiftlik / bölgesel etki ağı ekranı

---

## 👥 Takım

| İsim | Rol |
|---|---|
| *(isim ekleyin)* | *(rol ekleyin)* |
| *(isim ekleyin)* | *(rol ekleyin)* |

---

## 📄 Lisans

Bu proje bir yarışma prototipidir. Lisans bilgisi eklenmemiştir — eklemek isterseniz `LICENSE` dosyası oluşturun.