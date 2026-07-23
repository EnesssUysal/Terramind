import React from 'react';
import { User, Settings, Shield, HelpCircle, Info, LogOut, ChevronRight, Activity } from 'lucide-react';

interface ProfileTabProps {
  onLogout: () => void;
  onOpenDetail: (title: string) => void;
}

export default function ProfileTab({ onLogout, onOpenDetail }: ProfileTabProps) {
  return (
    <div className="flex-1 px-6 pt-6 pb-12">
      <h2 className="text-2xl font-bold text-[#1B331B] mb-6">Profil</h2>
      
      <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 flex items-center space-x-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#E8F1EA] bg-[#F4FAF5] flex items-center justify-center">
          <User className="h-8 w-8 text-[#8EA694]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1B331B]">Misafir Kullanıcı</h3>
          <p className="text-sm text-[#597360]">misafir@terramind.app</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[20px] bg-white overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <button onClick={() => onOpenDetail('sensors-list')} className="w-full flex justify-between items-center p-5 hover:bg-[#F4FAF5] transition-colors">
            <div className="flex items-center space-x-3 text-[#1B331B]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EA]">
                <Activity className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <span className="font-semibold text-[15px]">Sensörlerim</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </button>
          <div className="h-[1px] w-full bg-[#E8F1EA] ml-[68px]"></div>
          
          <button onClick={() => onOpenDetail('settings')} className="w-full flex justify-between items-center p-5 hover:bg-[#F4FAF5] transition-colors">
            <div className="flex items-center space-x-3 text-[#1B331B]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EA]">
                <Settings className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <span className="font-semibold text-[15px]">Ayarlar</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </button>
          <div className="h-[1px] w-full bg-[#E8F1EA] ml-[68px]"></div>
          
          <button onClick={() => onOpenDetail('privacy')} className="w-full flex justify-between items-center p-5 hover:bg-[#F4FAF5] transition-colors">
            <div className="flex items-center space-x-3 text-[#1B331B]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EA]">
                <Shield className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <span className="font-semibold text-[15px]">Gizlilik</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </button>
        </div>

        <div className="rounded-[20px] bg-white overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <button onClick={() => onOpenDetail('support')} className="w-full flex justify-between items-center p-5 hover:bg-[#F4FAF5] transition-colors">
            <div className="flex items-center space-x-3 text-[#1B331B]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EA]">
                <HelpCircle className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <span className="font-semibold text-[15px]">Destek</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </button>
          <div className="h-[1px] w-full bg-[#E8F1EA] ml-[68px]"></div>
          
          <button onClick={() => onOpenDetail('about')} className="w-full flex justify-between items-center p-5 hover:bg-[#F4FAF5] transition-colors">
            <div className="flex items-center space-x-3 text-[#1B331B]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1EA]">
                <Info className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <span className="font-semibold text-[15px]">Hakkında</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#8EA694]" />
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-4 flex items-center justify-center space-x-2 rounded-[16px] bg-white p-4 font-bold text-[#E53935] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:bg-[#FFEBEE] transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

