import React from 'react';
import { ArrowLeft, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

interface DetailScreenProps {
  title: string;
  onBack: () => void;
}

export default function DetailScreen({ title, onBack }: DetailScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      className="flex min-h-screen flex-col bg-[#F4FAF5]"
    >
      <header className="sticky top-0 z-50 flex items-center bg-[#F4FAF5]/80 px-4 py-4 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B331B] shadow-sm transition-colors hover:bg-[#E8F1EA]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-4 text-lg font-bold text-[#1B331B]">{title}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F1EA] mb-6">
          <Leaf className="h-10 w-10 text-[#8EA694] opacity-50" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#1B331B] mb-2">{title}</h2>
        <p className="text-[#597360] max-w-xs">
          Bu sayfa şu an geliştirme aşamasındadır. Yakında detaylı veriler eklenecektir.
        </p>
      </main>
    </motion.div>
  );
}
