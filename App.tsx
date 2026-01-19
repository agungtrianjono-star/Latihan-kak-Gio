
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Check, X } from 'lucide-react';
import { audioService } from './services/audioService';

const DEFAULT_TIME = 15 * 60; // 15 minutes in seconds

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isSettingCustom, setIsSettingCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('15');
  const [customSeconds, setCustomSeconds] = useState('00');
  
  // Use ReturnType<typeof setInterval> to avoid reliance on the NodeJS namespace in a browser environment
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
    setTimeLeft(DEFAULT_TIME);
  };

  const handleSetCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const totalSeconds = (mins * 60) + secs;
    if (totalSeconds > 0) {
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
          // Sound effects for final seconds
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
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500 opacity-20 blur-[120px] rounded-full"></div>

      {/* Header */}
      <div className="z-10 text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-lg">
          Latihan Kak Gio
        </h1>
        <p className="text-blue-200 mt-2 font-medium tracking-widest opacity-80">
          PUSH YOUR LIMITS
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsing ring around timer */}
        {isActive && (
          <div className="absolute inset-0 pulsing-effect rounded-full bg-white opacity-10 blur-md"></div>
        )}
        
        <div className={`glass rounded-full w-72 h-72 md:w-96 md:h-96 flex items-center justify-center transition-transform duration-500 ${isActive ? 'scale-105' : 'scale-100'}`}>
          <div className="text-center">
            <span className="text-7xl md:text-9xl font-black tabular-nums drop-shadow-2xl">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12 z-10 flex gap-6 items-center">
        <button 
          onClick={handleReset}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          title="Reset"
        >
          <RotateCcw size={28} />
        </button>

        <button 
          onClick={handleStartStop}
          className="w-24 h-24 rounded-full bg-white text-indigo-900 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all"
        >
          {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-2" fill="currentColor" />}
        </button>

        <button 
          onClick={() => setIsSettingCustom(true)}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          title="Custom Settings"
        >
          <Settings size={28} />
        </button>
      </div>

      {/* Progress Bar (Visual indicator) */}
      <div className="mt-12 w-full max-w-md bg-white/10 h-2 rounded-full overflow-hidden z-10 border border-white/5">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ width: `${(timeLeft / DEFAULT_TIME) * 100}%` }}
        ></div>
      </div>

      {/* Custom Time Modal */}
      {isSettingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-slate-900 border border-white/20 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Atur Waktu Latihan</h2>
            <div className="flex gap-4 items-center justify-center mb-8">
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="bg-white/5 border border-white/10 w-20 h-20 text-4xl font-black text-center rounded-2xl focus:outline-none focus:border-blue-400"
                  max="99"
                  min="0"
                />
                <span className="text-xs mt-2 opacity-50 uppercase font-bold">Menit</span>
              </div>
              <span className="text-4xl font-black">:</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  className="bg-white/5 border border-white/10 w-20 h-20 text-4xl font-black text-center rounded-2xl focus:outline-none focus:border-blue-400"
                  max="59"
                  min="0"
                />
                <span className="text-xs mt-2 opacity-50 uppercase font-bold">Detik</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsSettingCustom(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSetCustomTime}
                className="flex-1 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up / Survey Section */}
      <div className="mt-16 z-10 w-full max-w-3xl glass p-8 rounded-3xl border-white/10 mb-10">
        <h3 className="text-xl font-bold mb-4 text-blue-200">Bagaimana saya bisa membantu Anda lebih lanjut?</h3>
        <p className="text-sm text-white/70 mb-6">
          Timer ini dirancang untuk latihan intensitas tinggi seperti <b>Berlari, Lari interval, Pull Up, Push Up, atau Sit up</b>.
          Beri tahu saya jika Anda ingin menyesuaikan fitur berikut:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase text-blue-300">Pertanyaan Lanjutan:</h4>
            <ul className="text-sm space-y-2 list-disc list-inside opacity-90">
              <li>Durasi spesifik yang Anda butuhkan untuk setiap set?</li>
              <li>Preferensi gaya visual (lebih gelap, futuristik, atau cerah)?</li>
              <li>Apakah Anda ingin hitung mundur berkelanjutan (Interval)?</li>
              <li>Fitur tambahan (peringatan suara khusus, efek visual flash)?</li>
              <li>Jenis latihan spesifik yang Anda lakukan hari ini?</li>
            </ul>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <h4 className="text-sm font-black uppercase text-purple-300 mb-2">Contoh Penggunaan:</h4>
            <div className="flex flex-wrap gap-2">
              {['Berlari', 'Lari Interval', 'Pull Up', 'Push Up', 'Sit up'].map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-1 bg-white/10 rounded-full border border-white/10 font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
