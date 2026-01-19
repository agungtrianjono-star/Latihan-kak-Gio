
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { audioService } from './services/audioService.ts';

const DEFAULT_TIME = 15 * 60; // 15 minutes

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [initialTime, setInitialTime] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isSettingCustom, setIsSettingCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('15');
  const [customSeconds, setCustomSeconds] = useState('00');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isActive) audioService.init();
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const handleSetCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const totalSeconds = (mins * 60) + secs;
    if (totalSeconds > 0) {
      setInitialTime(totalSeconds);
      setTimeLeft(totalSeconds);
      setIsSettingCustom(false);
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
          // Beep Test style warnings for final 5 seconds
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      
      {/* Title Section */}
      <div className="z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl">
          Latihan Kak Gio
        </h1>
        <div className="h-1 w-24 bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Timer Ring */}
      <div className="relative z-10 flex flex-col items-center">
        {isActive && (
          <div className="absolute inset-0 pulsing-effect rounded-full bg-blue-400/20 blur-xl"></div>
        )}
        
        <div className={`glass rounded-full w-80 h-80 md:w-[450px] md:h-[450px] flex flex-col items-center justify-center transition-all duration-700 ${isActive ? 'scale-105 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'scale-100'}`}>
          <div className="text-center">
            <span className="text-8xl md:text-[140px] font-black tabular-nums tracking-tighter block leading-none">
              {formatTime(timeLeft)}
            </span>
            <p className="text-blue-300 font-bold tracking-[0.3em] uppercase mt-4 text-xs md:text-sm">
              Time Remaining
            </p>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="mt-16 z-10 flex gap-8 items-center">
        <button 
          onClick={handleReset}
          className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 active:scale-90"
        >
          <RotateCcw size={24} />
        </button>

        <button 
          onClick={handleStartStop}
          className="w-24 h-24 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] hover:scale-110 active:scale-95 transition-all"
        >
          {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-2" fill="currentColor" />}
        </button>

        <button 
          onClick={() => setIsSettingCustom(true)}
          className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 active:scale-90"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-16 w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden z-10">
        <div 
          className="h-full bg-blue-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          style={{ width: `${(timeLeft / initialTime) * 100}%` }}
        ></div>
      </div>

      {/* Custom Time Modal */}
      {isSettingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6">
          <div className="glass p-10 rounded-[2rem] w-full max-w-md border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-tight">Atur Waktu</h2>
            <div className="flex gap-6 items-center justify-center mb-10">
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="bg-white/10 border border-white/20 w-24 h-24 text-5xl font-black text-center rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  max="999"
                  min="0"
                />
                <span className="text-[10px] mt-3 opacity-50 uppercase font-black tracking-widest">Minutes</span>
              </div>
              <span className="text-5xl font-black text-blue-500">:</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  className="bg-white/10 border border-white/20 w-24 h-24 text-5xl font-black text-center rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  max="59"
                  min="0"
                />
                <span className="text-[10px] mt-3 opacity-50 uppercase font-black tracking-widest">Seconds</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsSettingCustom(false)}
                className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest transition-colors text-xs"
              >
                Batal
              </button>
              <button 
                onClick={handleSetCustomTime}
                className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl text-xs"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips Overlay */}
      <div className="mt-auto pt-10 z-10 w-full max-w-lg text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-300">Cocok Untuk</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold">
          <span>BERLARI</span>
          <span>LARI INTERVAL</span>
          <span>PULL UP</span>
          <span>PUSH UP</span>
          <span>SIT UP</span>
        </div>
      </div>
    </div>
  );
};

export default App;
