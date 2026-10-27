<div align="center">

![TerraMind Harita Görünümü](docs/harita.jpg)

# 🌾 TerraMind
**Otonom Zirai Karar Destek Sistemi (DSS) ve Deep-Tech Akıllı Tarım Platformu**

[![React](https://img.shields.io/badge/React-18-061631?logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![Gemini](https://img.shields.io/badge/Gemini_API-2.0_Flash-4285F4?logo=google&logoColor=white)](#)
[![IoT](https://img.shields.io/badge/IoT_Mesh-ESP--NOW-2E7D32)](#)

*TerraMind, tarlaları sadece izlemekle kalmaz — sensör verisini, yapay zekayı ve iklim finansmanını birleştirerek **otonom kararlar alır**.*
</div>

---

## 🚩 Problem ve Vizyon

Türkiye'de ve dünyada tarımsal sulamanın büyük bölümü hâlâ deneyime dayalı, gerçek zamanlı veri ve hava tahmini olmadan yapılıyor. 
**Sonuç:** Gereksiz su ve enerji tüketimi, önlenebilir rekolte kayıpları ve verinin doğrulanamaması nedeniyle karbon/iklim finansmanı fırsatlarının tamamen kaçırılması.

## 💡 Çözüm: 3 Katmanlı Otonomi

TerraMind, sahadaki IoT sensör ağından (Edge Nodes) gelen veriyi üç katmanda işler ve eyleme dönüştürür:

1. **📡 Algı (IoT & Edge):** Ham sensör verisini (Nem, Sıcaklık, Azot, pH) toplar ve gerçek zamanlı işler.
2. **🧠 Karar (AI DSS):** Gemini 2.0 Flash modeli, bu veriyi hava tahminleriyle çaprazlayarak otonom sulama kararları alır.
3. **💰 Etki (FinTech & MRV):** Alınan her otonom kararı parasal karşılığa (₺), karbon tasarrufuna ve doğrulanabilir bir MRV kaydına çevirir.

---

## ⚙️ Öne Çıkan Modüller (Gerçek Ekran Görüntüleri)

> *Aşağıdaki tüm modüller çalışan koddur. Gerçek zamanlı arayüzlerimizden alınmıştır.*

### 1. 🤖 Edge AI ve 3D Toprak Kesiti (Akıllı Analiz Merkezi)
![Akıllı Analiz Merkezi](docs/analiz.jpg)
Drone kamerasından gelen veriler bilgisayarlı görme (Vision AI) ile işlenerek bitki üzerindeki külleme riski ve su stresi tespit edilir. Aynı anda 3D Toprak Kesiti ile yüzeyden derin kök tabanına kadar nem oranı izlenerek otonom sulama kararları doğrulanır.

### 2. 🗺️ Donanım & Dijital İkiz (IDW Isı Haritası)
![Dijital İkiz](docs/ikiz.jpg)
Sahadaki ESP-NOW ağından (Node-01, Node-02, Gateway) gelen telemetri verileri, Inverse Distance Weighting (IDW) enterpolasyonu ile canvas üzerinde anlık hesaplanır. Kırmızı bölgeler düşük nem ve yüksek sıcaklığı temsil eder, sistem bu alanlara otonom müdahale başlatır.

### 3. ⛓️ Finansal Etki, Karbon ve MRV Takibi
![Karbon Takibi](docs/karbon.png)
Gereksiz traktör kullanımı ve yanlış sulamanın önüne geçerek sağlanan CO2 emisyon düşüşü ve yakıt maliyeti (TL bazında) anlık olarak hesaplanır. Bölge ortalamasıyla kıyaslanarak çiftçiye sürdürülebilirlik karnesi sunulur.

### 4. 🧠 Gemini 2.0 Flash Destekli TerraMind AI
![Yapay Zeka Asistanı](docs/asistan.png)
Tarlanın güncel sensör verileri ve hava durumu, "Vision Motoru" aktif olan sisteme anlık beslenir. Kullanıcı, tarlasındaki kriz durumlarını önceden yazılmış senaryolarla değil, gerçek yapay zeka ile diyalog kurarak çözer.

---

## 🛠️ Teknik Mimari ve Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Arayüz (Core)** | React 18, TypeScript, Vite 6 | Yüksek performanslı, asenkron veri akışına uygun SPA mimarisi. |
| **Harita & Grafik** | Leaflet.js, HTML5 Canvas | IDW enterpolasyonu ve poligon tabanlı tarla çizimleri. |
| **Yapay Zeka** | Google Gemini 2.0 Flash API | Dinamik context window ile anlık analiz ve Vision desteği. |
| **IoT / Edge (Sim)** | ESP-NOW Topolojisi | Düşük gecikmeli, kamerasız sensör ağ topolojisi arayüzü. |
| **Stil & UI** | Tailwind CSS v4, Framer Motion | Modern, akıcı ve responsive tasarım. |

---

## 🚀 Kurulum ve Geliştirme

```bash
# Projeyi klonlayın ve dizine girin
git clone [https://github.com/EnesssUysal/AI-Smart-Farming.git](https://github.com/EnesssUysal/AI-Smart-Farming.git)
cd AI-Smart-Farming/frontend

# Bağımlılıkları yükleyin
npm install

# Çevre değişkenlerini ayarlayın (Gemini API Anahtarı)
cp .env.example .env

# Geliştirme sunucusunu başlatın
npm run dev