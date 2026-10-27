import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, CheckCircle2, Leaf, Bell, User, CloudSun, MapPin, ChevronDown, RefreshCw, Maximize, Navigation, Zap, Droplets, ThermometerSun, Sprout, Home as HomeIcon, LayoutGrid, BarChart2, Cpu, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import MainScreen from './components/MainScreen';
import TerraMindLogo from './components/TerraMindLogo';

type ScreenType = 'splash' | 'login' | 'register' | 'otp_register' | 'success_register' | 'forgot_password' | 'otp_forgot' | 'new_password' | 'success_password' | 'home';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('splash');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 1) {
      e.target.value = val.slice(0, 1);
    }
    if (val.length === 1 && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeScreen === 'splash') {
      timer = setTimeout(() => {
        setActiveScreen('login');
      }, 2200); 
    } else if (activeScreen === 'success_register') {
      timer = setTimeout(() => {
        setActiveScreen('home');
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [activeScreen]);

  return (
    <div className="min-h-screen w-full bg-[#E8F1EA] font-sans antialiased overflow-hidden">
      <AnimatePresence mode="wait">
        {activeScreen === 'splash' ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F1EA] to-[#D2E6D7]"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="mb-8"
              >
                <TerraMindLogo size={140} badge={true} />
              </motion.div>
              
              <div className="flex flex-col items-center text-center">
                <h1 className="mb-3 text-4xl font-bold leading-none tracking-tight text-[#1B331B]">
                  TerraMind
                </h1>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D5A27] opacity-80">
                  Akıllı Tarım Platformu
                </p>
              </div>
            </div>

            <div className="absolute bottom-12">
              <div className="h-1 w-1 rounded-full bg-[#1B331B] opacity-20"></div>
            </div>
          </motion.div>
        ) : activeScreen === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex w-full max-w-md flex-col items-center">
              <div className="mb-8 flex flex-col items-center justify-center">
                <TerraMindLogo size={80} badge={true} />
                <span className="mt-3 text-xl font-bold tracking-[0.15em] text-[#1B331B]">
                  TERRAMIND
                </span>
              </div>

              <div className="mb-10 text-center">
                <h1 className="mb-2 text-[28px] font-semibold text-[#1B331B]">Hoş Geldiniz</h1>
                <p className="text-[15px] font-normal text-[#597360]">
                  Hesabınıza giriş yaparak tarlanızı yönetmeye başlayın.
                </p>
              </div>

              <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <form className="flex flex-col space-y-5" onSubmit={(e) => e.preventDefault()}>
                  
                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-1">E-posta veya Telefon Numarası</label>
                    <input 
                      type="text" 
                      placeholder="E-posta veya Telefon Numarası"
                      className="w-full rounded-[16px] border-none bg-[#F4FAF5] px-5 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-1">Şifre</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Şifre"
                        className="w-full rounded-[16px] border-none bg-[#F4FAF5] pl-5 pr-12 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA694] hover:text-[#597360]"
                      >
                        {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1 pb-1">
                    <button type="button" onClick={() => setActiveScreen('forgot_password')} className="text-[14px] font-medium text-[#4CAF50] transition-colors hover:text-[#1B331B]">
                      Şifremi Unuttum?
                    </button>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveScreen('home')}
                    className="mt-2 w-full rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
                  >
                    Giriş Yap
                  </button>

                  <div className="pt-4 text-center text-[14px] font-medium text-[#597360]">
                    Hesabın yok mu? <button type="button" onClick={() => setActiveScreen('register')} className="ml-1 font-semibold text-[#4CAF50] transition-colors hover:text-[#1B331B]">Kayıt Ol</button>
                  </div>

                </form>
              </div>

              <div className="mt-12 flex items-center justify-center space-x-3 text-[13px] font-medium text-[#8EA694]">
                <a href="#" className="transition-colors hover:text-[#597360]">Gizlilik Politikası</a>
                <span>•</span>
                <a href="#" className="transition-colors hover:text-[#597360]">Kullanım Koşulları</a>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex w-full max-w-md flex-col items-center">
              <div className="mb-6 flex flex-col items-center justify-center">
                <TerraMindLogo size={64} badge={true} />
                <span className="mt-2 text-lg font-bold tracking-[0.15em] text-[#1B331B]">
                  TERRAMIND
                </span>
              </div>

              <div className="mb-8 text-center">
                <h1 className="mb-2 text-[28px] font-semibold text-[#1B331B]">Hesap Oluştur</h1>
                <p className="text-[15px] font-normal text-[#597360]">
                  Bilgilerinizi girerek TerraMind ekosistemine katılın.
                </p>
              </div>

              <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
                  
                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-0.5">Ad Soyad</label>
                    <input 
                      type="text" 
                      placeholder="Ad Soyad"
                      className="w-full rounded-[16px] border-none bg-[#F4FAF5] px-5 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-0.5">Telefon veya E-posta</label>
                    <input 
                      type="text" 
                      placeholder="Telefon veya E-posta"
                      className="w-full rounded-[16px] border-none bg-[#F4FAF5] px-5 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-0.5">Şifre</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Şifre"
                        className="w-full rounded-[16px] border-none bg-[#F4FAF5] pl-5 pr-12 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA694] hover:text-[#597360]"
                      >
                        {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                      </button>
                    </div>
                    
                    <div className="mt-2 ml-2">
                      <p className="text-[12px] font-medium text-[#8EA694] mb-1">Şifreniz en az:</p>
                      <ul className="text-[12px] text-[#8EA694] flex flex-col space-y-0.5">
                        <li className="flex items-center"><span className="mr-1.5 text-[14px] leading-none">•</span>8 karakter</li>
                        <li className="flex items-center"><span className="mr-1.5 text-[14px] leading-none">•</span>1 büyük harf</li>
                        <li className="flex items-center"><span className="mr-1.5 text-[14px] leading-none">•</span>1 küçük harf</li>
                        <li className="flex items-center"><span className="mr-1.5 text-[14px] leading-none">•</span>1 rakam</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5 relative pt-1">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-0.5">Şifre Tekrar</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Şifre Tekrar"
                        className="w-full rounded-[16px] border-none bg-[#F4FAF5] pl-5 pr-12 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA694] hover:text-[#597360]"
                      >
                        {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 pb-1">
                    <label className="flex items-start cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5 mr-3">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="h-5 w-5 rounded-[6px] border-[1.5px] border-[#8EA694] bg-transparent transition-colors peer-checked:border-[#4CAF50] peer-checked:bg-[#4CAF50] group-hover:border-[#597360]"></div>
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[13px] leading-[1.4] text-[#597360]">
                        <a href="#" className="font-semibold text-[#4CAF50] hover:text-[#1B331B] transition-colors">Kullanım Koşulları</a>
                        {' '}ve{' '}
                        <a href="#" className="font-semibold text-[#4CAF50] hover:text-[#1B331B] transition-colors">Gizlilik Politikasını</a>
                        {' '}okudum ve kabul ediyorum.
                      </span>
                    </label>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveScreen('otp_register')}
                    className="mt-4 w-full rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
                  >
                    Hesap Oluştur
                  </button>

                  <div className="pt-3 text-center text-[14px] font-medium text-[#597360]">
                    Zaten hesabın var mı? <button type="button" onClick={() => setActiveScreen('login')} className="ml-1 font-semibold text-[#4CAF50] transition-colors hover:text-[#1B331B]">Giriş Yap</button>
                  </div>

                </form>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'otp_register' || activeScreen === 'otp_forgot' ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex w-full max-w-md flex-col items-center">
              <div className="mb-10 text-center">
                <h1 className="mb-2 text-[28px] font-semibold text-[#1B331B]">Doğrulama Kodu</h1>
                <p className="text-[15px] font-normal text-[#597360]">
                  Telefonunuza veya e-postanıza gönderilen 6 haneli kodu girin.
                </p>
              </div>

              <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex justify-between space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => handleOtpChange(index, e)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="h-12 w-12 rounded-[12px] bg-[#F4FAF5] text-center text-xl font-semibold text-[#1B331B] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50] sm:h-14 sm:w-14"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button type="button" className="text-[14px] font-medium text-[#4CAF50] transition-colors hover:text-[#1B331B]">
                      Tekrar Gönder
                    </button>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveScreen(activeScreen === 'otp_register' ? 'success_register' : 'new_password')}
                    className="w-full rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
                  >
                    Doğrula
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'success_register' ? (
          <motion.div
            key="success_register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 size={80} className="mb-6 text-[#4CAF50]" strokeWidth={1.5} />
              <h1 className="mb-3 text-[24px] font-semibold text-[#1B331B]">Hesabınız başarıyla oluşturuldu.</h1>
              <p className="text-[15px] font-medium text-[#597360]">
                TerraMind'a yönlendiriliyorsunuz...
              </p>
            </div>
          </motion.div>
        ) : activeScreen === 'forgot_password' ? (
          <motion.div
            key="forgot_password"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex w-full max-w-md flex-col items-center">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-[28px] font-semibold text-[#1B331B]">Şifremi Unuttum</h1>
                <p className="text-[15px] font-normal text-[#597360]">
                  Şifrenizi sıfırlamak için telefon numaranızı veya e-posta adresinizi girin.
                </p>
              </div>

              <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <form className="flex flex-col space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-1">Telefon veya E-posta</label>
                    <input 
                      type="text" 
                      placeholder="Telefon veya E-posta"
                      className="w-full rounded-[16px] border-none bg-[#F4FAF5] px-5 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveScreen('otp_forgot')}
                    className="mt-2 w-full rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
                  >
                    Kod Gönder
                  </button>
                  
                  <div className="pt-2 text-center text-[14px] font-medium text-[#597360]">
                    <button type="button" onClick={() => setActiveScreen('login')} className="font-semibold text-[#4CAF50] transition-colors hover:text-[#1B331B]">Giriş Ekranına Dön</button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'new_password' ? (
          <motion.div
            key="new_password"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex w-full max-w-md flex-col items-center">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-[28px] font-semibold text-[#1B331B]">Yeni Şifre</h1>
                <p className="text-[15px] font-normal text-[#597360]">
                  Lütfen yeni şifrenizi belirleyin.
                </p>
              </div>

              <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
                <form className="flex flex-col space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-1">Yeni Şifre</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Yeni Şifre"
                        className="w-full rounded-[16px] border-none bg-[#F4FAF5] pl-5 pr-12 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA694] hover:text-[#597360]"
                      >
                        {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[13px] font-medium text-[#1B331B] ml-1 mb-1">Şifre Tekrar</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Şifre Tekrar"
                        className="w-full rounded-[16px] border-none bg-[#F4FAF5] pl-5 pr-12 py-4 text-[15px] text-[#1B331B] placeholder-[#8EA694] outline-none ring-1 ring-transparent transition-all hover:bg-[#E8F1EA] focus:bg-[#E8F1EA] focus:ring-[#4CAF50]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA694] hover:text-[#597360]"
                      >
                        {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveScreen('success_password')}
                    className="mt-4 w-full rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
                  >
                    Şifreyi Güncelle
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'success_password' ? (
          <motion.div
            key="success_password"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-[#E8F1EA] px-6 py-12"
          >
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 size={80} className="mb-6 text-[#4CAF50]" strokeWidth={1.5} />
              <h1 className="mb-8 text-[24px] font-semibold text-[#1B331B]">Şifreniz başarıyla değiştirildi.</h1>
              <button 
                type="button" 
                onClick={() => setActiveScreen('login')}
                className="w-[240px] rounded-[16px] bg-[#2D5A27] py-4 text-[16px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1B331B] hover:shadow-lg active:scale-[0.98]"
              >
                Giriş Yap
              </button>
            </div>
          </motion.div>
        ) : activeScreen === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0.0, 0.2, 1] }}
          >
           
            <MainScreen onLogout={() => setActiveScreen('login')} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}