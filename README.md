<div align="center">
  
  # 🌾 TerraMind
  **Otonom Zirai Karar Destek (DSS) ve Deep-Tech Analiz Sistemi**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![IoT Mesh](https://img.shields.io/badge/IoT_Mesh-ESP--NOW-emerald?style=for-the-badge)](#)
  [![Edge AI](https://img.shields.io/badge/Edge_AI-Computer_Vision-blue?style=for-the-badge)](#)

  *TerraMind, tarlaları sadece izlemekle kalmaz; donanım düzeyinde müdahalelerle bitki sağlığını, su tüketimini ve ağ enerjisini otonom olarak optimize eder.*
</div>

---

## 🚀 Proje Vizyonu

TerraMind, geleneksel uydu haritalarının ötesine geçerek tarımı **derin teknoloji (deep-tech)** ile buluşturan yeni nesil bir akıllı tarım platformudur. Sistem; drone kameralarından gelen canlı görüntüleri işler, toprak altı katmanlarının nemini 3D olarak simüle eder ve tarladaki IoT sensör düğümleri (Node) arasındaki iletişim kalitesini (RSSI/PDR) yapay zeka ile denetleyerek enerji tasarrufu (Deep Sleep) sağlar.

---

## 📸 Sistem Ekranları & Derin Teknoloji Şovu

> **Not:** Aşağıdaki görselleri GitHub'da görüntüleyebilmek için uygulamanızdan aldığınız ekran görüntülerini projenin ana dizininde `docs/` veya `public/` klasörüne ekleyip yollarını güncelleyin (Örn: `![Analiz Merkezi](./image_8acccf.jpg)`).

### 1. Spektral & Derinlik Şovu (Komuta Merkezi)
![Spektral Analiz Şovu](https://via.placeholder.com/1000x500/0B1121/10B981?text=Buraya+image_8acccf.jpg+Gorselini+Ekleyin)

Bu ekranda sistem, ham verileri görsel bir şölene dönüştürür:
* **Canlı Bilgisayarlı Görme (Drone Cam):** Bounding-box (sınırlayıcı kutu) teknolojisi ile yapraklardaki külleme hastalığı riskini ve su stresini anlık tespit eder.
* **Lazer Tarama Algoritması:** Tarlayı lokalize olarak tarayarak sadece hastalıklı bölgeye "Değişken Oranlı Uygulama (VRA)" rotası çıkarır.
* **3D Toprak Kesiti:** Yüzey, kök bölgesi ve derin taban rezervlerini eşzamanlı olarak izleyerek dinamik su ihtiyacı hesaplar.

### 2. IoT Mesh Topolojisi ve Edge Computing
![IoT Topolojisi](https://via.placeholder.com/1000x400/050B14/3B82F6?text=IoT+Mesh+Topoloji+Gorselini+Ekleyin)

Sistem arkasında yatan donanım mühendisliği arayüze doğrudan yansır:
* **Canlı Ağ Haritası:** Ana ağ geçidi (Gateway) ile düğümler (NODE-01, NODE-02) arasındaki veri paketlerinin (TX/RX) hareketini simüle eder.
* **Otonom Pil Optimizasyonu:** `NODE-02`'de pil seviyesi %14'e düştüğünde veya sinyal kalitesi zayıfladığında (-78 dBm), yapay zeka düğümü otonom olarak **Deep Sleep (Derin Uyku)** moduna alır ve uyanış döngüsünü 15 dakikadan 45 dakikaya çıkarır.

### 3. Zirai Karar Destek Sistemi (Otonom Danışman)
![Otonom Danışman](https://via.placeholder.com/1000x400/F4FAF5/1B331B?text=Otonom+Danisman+Ekrani)

* **Kriz Simülasyonu:** Beklenen bir fırtına veya kritik nem düşüşü tespit edildiğinde sistem sulamayı otomatik iptal ederek binlerce litre su tasarrufu sağlar.
* **Finansal Etki:** Alınan otonom kararların aylık enerji faturasına ve hasat rekoltesine etkisini (₺ ve %) anlık hesaplar.
* **Sesli Asistan Entegrasyonu:** Tarlanın tüm teknik analiz raporunu, tarayıcının yerleşik `SpeechSynthesis` API'si üzerinden tek tuşla sesli olarak çiftçiye okur.

---

## 🛠️ Teknik Altyapı ve Mimari

| Modül | Kullanılan Teknoloji / Protokol | İşlev |
| :--- | :--- | :--- |
| **Frontend Core** | React, TypeScript, Vite | Yüksek performanslı SPA mimarisi. |
| **Stil & Animasyon** | Tailwind CSS, CSS Keyframes | Dinamik SVG çizimleri ve veri akışı animasyonları. |
| **Donanım İletişimi** | ESP-NOW (Simüle Edilmiş) | Düşük gecikmeli, kamerasız sensör ağ topolojisi. |
| **Veri & Analiz** | Özel AI Algoritmaları | NDVI hesaplamaları, Külleme Radarı, Nem Stresi. |

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde test etmek ve derin teknoloji şovunu jüriye sunmak için aşağıdaki adımları izleyin:

```bash
# Projeyi klonlayın
git clone [https://github.com/EnesssUysal/AI-Smart-Farming.git](https://github.com/EnesssUysal/AI-Smart-Farming.git)

# Proje dizinine girin
cd AI-Smart-Farming/frontend

# Bağımlılıkları yükleyin
npm install
# veya yarn install / pnpm install

# Geliştirme sunucusunu başlatın
npm run dev