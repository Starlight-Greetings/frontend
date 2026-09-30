import { Sparkles, MapPin, ArrowLeft, Waves } from 'lucide-react';
import { useLetter } from '../../hooks/useLetter';

export default function Header() {
  const { currentLocation, step, goToMap, openDailyGuide } = useLetter();
  const isMap = step === 'map' || step === 'intro';

  return (
    <header className="relative z-30 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-slate-950/70 select-none">
      {/* 좌측: 지도 모드면 서비스 로고 / 강물 모드면 "← 도림천 지도" 뒤로가기 버튼 */}
      <div className="flex items-center space-x-2 min-w-0">
        {!isMap ? (
          <button
            onClick={goToMap}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/40 text-cyan-200 hover:text-white transition active:scale-95 text-xs font-semibold shadow-md shrink-0"
            title="도림천 지도로 나가기"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="whitespace-nowrap">도림천 지도</span>
          </button>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
              <Waves className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
                별빛내린천 병편지
              </h1>
              <p className="text-[10px] text-cyan-200/70 tracking-tight whitespace-nowrap hidden min-[360px]:block">
                도림천 실시간 하천 지도
              </p>
            </div>
          </>
        )}
      </div>

      {/* 우측: 강물 뷰일 때 현재 다리 뱃지 + 오늘의 별빛안부 버튼 */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {!isMap && currentLocation && (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)] text-[11px] font-bold text-cyan-200 shrink-0 whitespace-nowrap">
            <MapPin className="w-3 h-3 text-cyan-300 shrink-0" />
            <span className="whitespace-nowrap">{currentLocation.name}</span>
          </div>
        )}

        {/* 오늘의 별빛안부 가이드 버튼 */}
        <button
          onClick={openDailyGuide}
          title="오늘의 별빛안부 보기"
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-900/80 transition active:scale-95 text-[11px] font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span className="whitespace-nowrap">별빛안부</span>
        </button>
      </div>
    </header>
  );
}
