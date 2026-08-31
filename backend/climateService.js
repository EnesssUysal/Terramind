// climateService.js

/**
 * Sıcaklık (GDD) ve Güneş Radyasyonu analiz servisi
 */

function calculateClimateData(params) {
  // Gelen parametreler (veya varsayılan demo değerleri)
  const Tmax = params.Tmax !== undefined ? params.Tmax : 32.5; // Günlük Max Sıcaklık
  const Tmin = params.Tmin !== undefined ? params.Tmin : 18.2; // Günlük Min Sıcaklık
  const Tbase = params.Tbase !== undefined ? params.Tbase : 10.0; // Bitki taban sıcaklığı
  const radiation = params.radiation !== undefined ? params.radiation : 22.4; // Günlük radyasyon (MJ/m2)
  const RUE = params.RUE !== undefined ? params.RUE : 1.8; // Radiation Use Efficiency (g/MJ)
  const hasRadiationData = params.hasRadiationData !== undefined ? params.hasRadiationData : true;

  // 1. Sıcaklık ve GDD (Growing Degree Days) Hesaplaması
  const Tavg = (Tmax + Tmin) / 2;
  let dailyGDD = Tavg - Tbase;
  if (dailyGDD < 0) dailyGDD = 0;

  // Sıcaklık Durumu (Çiftçi dostu)
  let tempStatus = "Normal";
  let tempMessage = "Sıcaklık bitki gelişimi için ideal seviyelerde.";
  if (Tmax > 35) {
    tempStatus = "Stres Riski";
    tempMessage = "Aşırı sıcaklar bitkide sıcaklık stresi yaratabilir.";
  } else if (Tmin < Tbase) {
    tempStatus = "Dikkat";
    tempMessage = "Gece sıcaklıkları bitki gelişim tabanının altına düşüyor, gelişim yavaşlayabilir.";
  } else {
    tempStatus = "İdeal";
  }

  // 2. Güneş / Radyasyon Analizi
  let radStatus = "Bilinmiyor";
  let radMessage = "Radyasyon verisi bulunamadığı için bu analiz hesaplanamıyor.";
  let biomassEstimate = 0;

  if (hasRadiationData) {
    // Basit Biyokütle tahmini = Intercepted Radiation * RUE (Basit bir varsayımla %80 interception)
    const interceptedRadiation = radiation * 0.8;
    biomassEstimate = interceptedRadiation * RUE;

    if (radiation > 25) {
      radStatus = "Yüksek";
      radMessage = "Güneş enerjisi alımı çok yüksek. Yüksek sıcaklıkla birleşirse su tüketimi çok artar.";
    } else if (radiation >= 15) {
      radStatus = "Normal";
      radMessage = "Güneş enerjisi bitki gelişimi (fotosentez) için ideal seviyede.";
    } else {
      radStatus = "Düşük";
      radMessage = "Bulutluluk veya gölgelenme nedeniyle güneş enerjisi alımı düşük.";
    }
  }

  // 3. Sıcaklık + Radyasyon Birlikte Analiz (Bitki Gelişim Koşulları)
  let growthStatus = "Bilinmiyor";
  let growthMessage = "";
  if (hasRadiationData) {
    if (tempStatus === "İdeal" && radStatus === "Normal") {
      growthStatus = "İYİ";
      growthMessage = "Son günlerdeki sıcaklık ve radyasyon değerleri bitkinin gelişimi açısından çok uygun seviyelerde.";
    } else if (tempStatus === "Stres Riski" || radStatus === "Yüksek") {
      growthStatus = "STRES RİSKİ";
      growthMessage = "Yüksek sıcaklık ve aşırı güneşlenme nedeniyle bitkinin sıcaklık ve su stresi riski artmıştır.";
    } else {
      growthStatus = "DİKKAT";
      growthMessage = "Sıcaklık dalgalanmaları veya düşük radyasyon nedeniyle bitki gelişimi optimalin altında olabilir.";
    }
  } else {
    growthStatus = "Veri Eksik";
    growthMessage = "Radyasyon verisi eksik olduğu için kombine gelişim analizi yapılamıyor.";
  }

  // Juri Demosu için Geçmiş Veriler (30 günlük mock data)
  const history = generateMockClimateHistory(Tmax, Tmin, Tbase, radiation, hasRadiationData);
  const totalGDD = history.reduce((sum, day) => sum + day.GDD, 0) + dailyGDD;

  return {
    parameters: {
      Tmax,
      Tmin,
      Tavg: parseFloat(Tavg.toFixed(1)),
      Tbase,
      radiation: hasRadiationData ? radiation : null,
      RUE,
      hasRadiationData
    },
    results: {
      dailyGDD: parseFloat(dailyGDD.toFixed(1)),
      totalGDD: parseFloat(totalGDD.toFixed(1)),
      biomassEstimate: hasRadiationData ? parseFloat(biomassEstimate.toFixed(1)) : null,
      tempStatus,
      tempMessage,
      radStatus: hasRadiationData ? radStatus : "Veri Yok",
      radMessage,
      growthStatus,
      growthMessage
    },
    history
  };
}

function generateMockClimateHistory(currentTmax, currentTmin, Tbase, currentRad, hasRad) {
  const history = [];
  const today = new Date();

  // Son 30 gün
  for (let i = 29; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Ufak rastgele varyasyonlarla veriler
    const variation = (Math.random() * 6) - 3; // -3 ile +3 arası
    const tmax = parseFloat((currentTmax + variation).toFixed(1));
    const tmin = parseFloat((currentTmin + (variation * 0.5)).toFixed(1));
    const tavg = parseFloat(((tmax + tmin) / 2).toFixed(1));
    
    let gdd = tavg - Tbase;
    if (gdd < 0) gdd = 0;

    let rad = null;
    if (hasRad) {
      rad = parseFloat((currentRad + (Math.random() * 8 - 4)).toFixed(1));
      if (rad < 5) rad = 5;
    }

    history.push({
      date: d.toISOString().split('T')[0],
      Tmax: tmax,
      Tmin: tmin,
      Tavg: tavg,
      GDD: parseFloat(gdd.toFixed(1)),
      radiation: rad
    });
  }

  return history;
}

module.exports = {
  calculateClimateData
};
