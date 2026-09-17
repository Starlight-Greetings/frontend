import { Sparkles, MapPin, RefreshCw, Crown } from 'lucide-react';
import { useLetter } from '../../hooks/useLetter';

export default function Header() {
  const { currentLocation, step, resetLocation, openDailyGuide } = useLetter();

  return (
    <header className="relative z-30 px-3.5 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-slate-950/60 select-none">
      <div className="flex items-center space-x-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
            별빛내린천 병편지
          </h1>
          <p className="text-[10px] text-slate-300/70 tracking-tight whitespace-nowrap hidden min-[360px]:block">
            도림천 디지털 타임캡슐
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* 오늘의 별빛안부 가이드 버튼 */}
        <button
          onClick={openDailyGuide}
          title="오늘의 별빛안부 보기"
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-900/80 transition active:scale-95 text-[11px] font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span className="whitespace-nowrap">별빛안부</span>
        </button>

        {currentLocation && step !== 'intro' && (
          <>
            <div className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] text-[11px] font-medium text-cyan-200 shrink-0 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">{currentLocation.name}</span>
            </div>

            <button
              onClick={resetLocation}
              title="위치 다시 선택"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
