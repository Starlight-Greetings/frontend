import { Sparkles, PenLine, Waves, Layers, RotateCw } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import BottleItem from '../components/features/BottleItem';

const ANIMATION_CLASSES = [
  'animate-float-slow',
  'animate-float-gentle',
  'animate-float-wave',
  'animate-float-slow',
  'animate-float-gentle'
];

export default function RiverView() {
  const {
    activeStreamBottles,
    messages,
    openBottle,
    openWrite,
    currentLocation,
    shuffleStream,
    isShuffling,
    setIsDrawerOpen
  } = useLetter();

  return (
    <div className="flex-1 flex flex-col justify-between relative z-10 overflow-hidden select-none">
      {/* 1. 상단 감성 컨트롤 바: 스트림 정보 + 물결 젓기 + 전체 서랍장 */}
      <div className="p-4 pt-2">
        <div className="glass-panel px-3.5 py-2.5 rounded-2xl border border-white/15 flex items-center justify-between shadow-xl">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <Waves className={`w-3.5 h-3.5 text-cyan-300 ${isShuffling ? 'animate-spin' : 'animate-pulse'}`} />
              <h2 className="text-xs font-semibold text-cyan-100">
                {currentLocation ? `${currentLocation.name} 앞 물결` : '별빛내린천 물결'}
              </h2>
            </div>
            <p className="text-[10px] text-slate-300/80">
              현재 도림천에 <span className="text-cyan-300 font-semibold">{messages.length}개</span>의 마음이 흐르는 중
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* 물결 젓기 (셔플) 버튼 */}
            <button
              onClick={shuffleStream}
              disabled={isShuffling}
              title="물결을 저어 다른 유리병 건지기"
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-400/30 text-cyan-200 text-xs font-medium flex items-center space-x-1 hover:bg-cyan-900/60 transition active:scale-95 disabled:opacity-60 shadow-md"
            >
              <RotateCw className={`w-3 h-3 ${isShuffling ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="text-[11px]">물결 젓기</span>
            </button>

            {/* 전체 편지 서랍장 버튼 */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              title="전체 편지 서랍장 열기"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition active:scale-95 shadow-md"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 도림천 강물 위를 부유하는 엄선된 4~5개 유리병들 */}
      <div className={`flex-1 relative overflow-hidden transition-opacity duration-300 ${isShuffling ? 'opacity-30' : 'opacity-100'}`}>
        {activeStreamBottles.map((msg, index) => (
          <BottleItem
            key={msg.id}
            message={msg}
            onOpen={openBottle}
            animationClass={ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}
          />
        ))}

        {/* 하단 잔물결 가이드 힌트 */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-50 hover:opacity-80 transition whitespace-nowrap">
          <p className="text-[11px] text-cyan-200 tracking-wider font-light flex items-center gap-1 justify-center">
            <Waves className="w-3 h-3" />
            유리병을 터치해 마음을 열어보세요
          </p>
        </div>
      </div>

      {/* 3. 하단 액션 바: "나도 유리병 띄우기" CTA */}
      <div className="p-4 pb-5">
        <button
          onClick={openWrite}
          className="w-full relative group overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 border border-cyan-400/40 text-white font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(6,182,212,0.45)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2.5"
        >
          {/* 빛나는 셔터 이펙트 */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

          <PenLine className="w-4 h-4 text-cyan-200" />
          <span>도림천에 나도 유리병 띄우기</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
