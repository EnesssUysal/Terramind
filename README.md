<div align="center">

![TerraMind Banner](https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80)

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
3. **💰 Etki (FinTech & MRV):** Alınan her otonom kararı parasal karşılığa (₺), karbon tasarrufuna ve blokzincir mantığıyla doğrulanabilir bir hash kaydına (MRV) çevirir.

---

## ⚙️ Öne Çıkan Modüller ve Mühendislik Şovu

> *Aşağıdaki tüm modüller çalışan koddur. Statik tasarımlar veya abartılı iddialar içermez.*

### 1. 🌪️ Kriz Simülasyonu & Otonom Müdahale (DSS)

![Kriz Simülasyonu](https://images.unsplash.com/photo-1592982537447-6f23f7902d76?auto=format&fit=crop&w=1000&q=80)

Toprak nemi kritik eşiğin altına düştüğünde sistem otomatik alarm üretir. Yapay zeka, meteorolojik verilere (yağış olasılığı) bakarak sulamayı **otonom olarak iptal eder**. Manuel müdahale edilmek istendiğinde ise kök çürümesi riski ve su israfı tahminlerini bir rapor olarak sunar.

### 2. 🗺️ IDW Algoritmalı Gerçek Zamanlı Isı Haritası (Digital Twin)

![Digital Twin](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80)

Sahadaki düğümlerin nem verisi basit statik renklerle değil, **Inverse Distance Weighting (IDW)** enterpolasyonu ile hesaplanır. Her bir piksel, tüm sensörlerin uzaklığa göre ağırlıklandırılmış ortalamasıdır. Canvas üzerinde anlık hesaplanarak gerçeğe en yakın toprak altı su dağılım haritasını (Digital Twin) oluşturur.

### 3. ⛓️ Doğrulanabilir Karbon Kaydı (MRV Defteri)

![Blockchain ve MRV](https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1000&q=80)

Karbon piyasalarının en büyük sorunu olan **MRV (Measurement, Reporting, Verification)** sürecini çözüyoruz. TerraMind, her tasarruf olayını bir önceki kaydın hash'ini referans alan **FNV-1a tabanlı bir hash-zinciri** ile mühürler. Sistemin bütünlüğü her an kriptografik olarak kanıtlanabilir.

### 4. 🤖 Gemini 2.0 Flash ile Bağlamsal Tarım Asistanı
Sohbet ekranımız önceden yazılmış statik senaryolarla çalışmaz. Tarla verileri (Nem, Sıcaklık, Azot, pH, NDVI vb.) arka planda anlık olarak **Google Gemini 2.0 Flash API'sine** sistem promptu olarak beslenir. Asistan, tarlanın o anki durumunu bilerek size mühendislik seviyesinde danışmanlık yapar.

---

## 🛠️ Teknik Mimari ve Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Arayüz (Core)** | React 18, TypeScript, Vite 6 | Yüksek performanslı, asenkron veri akışına uygun SPA mimarisi. |
| **Görselleştirme** | HTML5 Canvas (IDW Motoru), Recharts | Piksel tabanlı matematiksel enterpolasyon ve veri grafikleri. |
| **Yapay Zeka** | Google Gemini 2.0 Flash API | Dinamik context window (bağlam penceresi) ile anlık analiz. |
| **IoT / Edge (Sim)** | ESP-NOW Topolojisi | Düşük gecikmeli, kamerasız sens