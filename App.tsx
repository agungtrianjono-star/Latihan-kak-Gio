
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Check, X } from 'lucide-react';
import { audioService } from './services/audioService.ts';

const DEFAULT_TIME = 15 * 60; // 15 Menit

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [initialTime, setInitialTime] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputMins, setInputMins] = useState('15');
  const [inputSecs, setInputSecs] = useState('00');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (!isActive) audioService.init();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const handleApplySettings = () => {
    const total = (parseInt(inputMins) || 0) * 60 + (parseInt(inputSecs) || 0);
    if (total > 0) {
      setInitialTime(total);
      setTimeLeft(total);
      setShowSettings(false);
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            audioService.playLevelUpBeep();
            setIsActive(false);
            return 0;
          }
          // Suara detak di 5 detik terakhir
          if (prev <= 6) {
            audioService.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Title */}
      <header className="z-10 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Latihan Kak Gio
        </h1>
        <p className="text-blue-400 text-xs md:text-sm font-bold tracking-[0.5em] uppercase mt-2 opacity-60">
          Professional Timer
        </p>
      </header>

      {/* Main Timer Display */}
      <div className="relative z-10">
        <div className={`glass rounded-full w-72 h-72 md:w-[450px] md:h-[450px] flex flex-col items-center justify-center transition-all duration-500 relative ${isActive ? 'pulsing scale-105 border-blue-500/30' : 'scale-100 border-white/10'}`}>
          <div className="text-center">
            <span className="text-7xl md:text-[140px] font-black tabular-nums tracking-tighter leading-none block drop-shadow-2xl">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm bg-white/5 h-1 rounded-full mt-12 overflow-hidden z-10 border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / initialTime) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="mt-12 z-10 flex items-center gap-8">
        <button 
          onClick={handleReset}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"
          title="Reset"
        >
          <RotateCcw size={28} className="text-slate-400" />
        </button>

        <button 
          onClick={handleToggle}
          className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-2xl active:scale-95 ${isActive ? 'bg-white text-slate-900 shadow-white/10' : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-500'}`}
        >
          {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
        </button>

        <button 
          onClick={() => setShowSettings(true)}
          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"
          title="Pengaturan"
        >
          <Settings size={28} className="text-slate-400" />
        </button>
      </div>

      {/* Quick Info Tags */}
      <footer className="mt-auto pt-10 z-10 text-center opacity-30 hover:opacity-100 transition-opacity">
        <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black tracking-widest uppercase">
          <span className="px-3 py-1 border border-white/20 rounded-full">Berlari</span>
          <span className="px-3 py-1 border border-white/20 rounded-full">Interval</span>
          <span className="px-3 py-1 border border-white/20 rounded-full">Push Up</span>
          <span className="px-3 py-1 border border-white/20 rounded-full">Beep Test</span>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="glass p-8 rounded-[2.5rem] w-full max-w-sm border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight">Set Waktu</h2>
              <button onClick={() => setShowSettings(false)} className="opacity-50 hover:opacity-100">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="text-center">
                <input 
                  type="number" 
                  value={inputMins}
                  onChange={(e) => setInputMins(e.target.value)}
                  className="bg-white/10 w-20 h-20 text-4xl font-black text-center rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                />
                <span className="block text-[10px] uppercase font-bold mt-2 opacity-40">Menit</span>
              </div>
              <span className="text-4xl font-black text-blue-500">:</span>
              <div className="text-center">
                <input 
                  type="number" 
                  value={inputSecs}
                  onChange={(e) => setInputSecs(e.target.value)}
                  className="bg-white/10 w-20 h-20 text-4xl font-black text-center rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                />
                <span className="block text-[10px] uppercase font-bold mt-2 opacity-40">Detik</span>
              </div>
            </div>

            <button 
              onClick={handleApplySettings}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-colors"
            >
              Simpan & Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
