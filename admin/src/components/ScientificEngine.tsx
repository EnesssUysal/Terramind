import React from 'react';
import { Activity, Calculator, Variable, CheckCircle } from 'lucide-react';

export const ScientificEngine = ({ state }: { state: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-zinc-400 mb-6">
        <Activity className="mr-3 text-brand-green"/>
        <div>
          <h2 className="text-2xl font-bold text-white">Bilimsel Hesaplama Motoru</h2>
          <p className="text-sm">Matematiksel formüllerin arka planda gerçek zamanlı hesaplanma şeması.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ET0 Hesaplaması */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-brand-blue mb-4 flex items-center border-b border-zinc-800 pb-2">
            <Calculator className="mr-2" size={18}/>
            FAO-56 Referans Evapotranspirasyon (ET₀)
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Sıcaklık</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.temperature ?? '28.4'} °C</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Bağıl Nem</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.humidity ?? '42'} %</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Rüzgar</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.windSpeed ?? '2.1'} m/s</div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-lg mb-4 text-center font-serif italic text-sm text-zinc-400 relative">
            <Variable size={16} className="absolute left-3 top-3 text-zinc-600"/>
            "Penman-Monteith denklemi ile atmosferik su talebi hesaplanır."<br/>
            (0.408 Δ (Rn - G) + γ (900 / (T + 273)) u2 (es - ea)) / (Δ + γ (1 + 0.34 u2))
          </div>
          
          <div className="flex justify-between items-center p-3 bg-brand-blue/10 border border-brand-blue/30 rounded-lg">
            <span className="font-bold text-brand-blue">Sonuç (ET₀):</span>
            <span className="font-black text-xl text-white">4.8 <span className="text-sm font-normal text-brand-blue/70">mm/gün</span></span>
          </div>
        </div>

        {/* Su Dengesi Hesaplaması */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-brand-green mb-4 flex items-center border-b border-zinc-800 pb-2">
            <Calculator className="mr-2" size={18}/>
            Kök Bölgesi Su Dengesi (Root Zone Balance)
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Yağış</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.rainfall ?? '0'} mm</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Sulama</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.irrigationAmount ?? '0'} mm</div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Girdi: Toprak Nemi</div>
              <div className="font-mono text-zinc-300">{state?.overrides?.soilMoisture ?? '32'} %</div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-lg mb-4 text-center font-serif italic text-sm text-zinc-400 relative">
            <Variable size={16} className="absolute left-3 top-3 text-zinc-600"/>
            "Su açığı (Dr) ve bitki su tüketimi (ETc) kullanılarak bakiye güncellenir."<br/>
            Dr, i = Dr, i-1 - (P - RO) - I - CR + ETc + DP
          </div>
          
          <div className="flex justify-between items-center p-3 bg-brand-green/10 border border-brand-green/30 rounded-lg">
            <span className="font-bold text-brand-green">Sonuç (Su Açığı - Dr):</span>
            <span className="font-black text-xl text-white">34.2 <span className="text-sm font-normal text-brand-green/70">mm</span></span>
          </div>
        </div>

        {/* VPD Hesaplaması */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-orange-400 mb-4 flex items-center border-b border-zinc-800 pb-2">
            <Calculator className="mr-2" size={18}/>
            Buhar Basıncı Açığı (VPD)
          </h3>
          <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-lg mb-4 text-center font-serif italic text-sm text-zinc-400 relative">
            <Variable size={16} className="absolute left-3 top-3 text-zinc-600"/>
            es = 0.6108 * exp((17.27 * T) / (T + 237.3))<br/>
            ea = es * (RH / 100)<br/>
            VPD = es - ea
          </div>
          
          <div className="flex justify-between items-center p-3 bg-orange-400/10 border border-orange-400/30 rounded-lg">
            <span className="font-bold text-orange-400">Sonuç (VPD):</span>
            <span className="font-black text-xl text-white">1.42 <span className="text-sm font-normal text-orange-400/70">kPa</span></span>
          </div>
        </div>
        
        {/* ECe Hesaplaması */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-purple-400 mb-4 flex items-center border-b border-zinc-800 pb-2">
            <Calculator className="mr-2" size={18}/>
            Tuzluluk Düzeltmesi (ECe)
          </h3>
          <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-lg mb-4 text-center font-serif italic text-sm text-zinc-400 relative">
            <Variable size={16} className="absolute left-3 top-3 text-zinc-600"/>
            EC25 = ECa * [ 1 + 0.019 * (T - 25) ]<br/>
            ECe = EC25 * (FC / Theta) * Kalibrasyon_Faktörü
          </div>
          
          <div className="flex justify-between items-center p-3 bg-purple-400/10 border border-purple-400/30 rounded-lg">
            <span className="font-bold text-purple-400">Sonuç (ECe):</span>
            <span className="font-black text-xl text-white">2.8 <span className="text-sm font-normal text-purple-400/70">dS/m</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
