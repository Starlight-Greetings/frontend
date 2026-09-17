import { X, MapPin, Clock, Heart, Sparkles, Waves, Layers } from 'lucide-react';
import { useLetter } from '../../hooks/useLetter';

export default function LetterListDrawer() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    filteredMessages,
    messages,
    filterType,
    setFilterType,
    currentLocation,
    openBottle,
    reactToMessage
  } = useLetter();

  if (!isDrawerOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      {/* 바텀시트 본체 */}
      <div className="w-full glass-panel rounded-t-[32px] border-t border-white/20 shadow-[0_-12px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] animate-modal-in overflow-hidden">
        {/* 1. 상단 드래그 핸들 및 타이틀 바 */}
        <div className="pt-3 pb-2 px-6 flex flex-col items-center border-b border-white/10">
          <div className="w-10 h-1 rounded-full bg-white/25 mb-3" />

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  도림천 편지 서랍장
                </h3>
                <p className="text-[10px] text-slate-300/70">
                  물결을 타고 흐른 총 {messages.length}개의 온기
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. 필터 탭 칩 (오늘의 별빛안부 & 주제별 별빛안부) */}
          <div className="w-full flex space-x-1.5 mt-3 pt-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition shrink-0 ${
                filterType === 'all'
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              전체 ({messages.length})
            </button>

            <button
              onClick={() => setFilterType('star-greeting')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition shrink-0 flex items-center gap-1 ${
                filterType === 'star-greeting'
                  ? 'bg-amber-500/30 border-amber-400 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              오늘의 별빛안부
            </button>

            <button
              onClick={() => setFilterType('weekly-topic')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition shrink-0 flex items-center gap-1 ${
                filterType === 'weekly-topic'
                  ? 'bg-indigo-500/30 border-indigo-400 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Heart className="w-3 h-3 text-rose-300" />
              주제별 별빛안부
            </button>

            {currentLocation && (
              <button
                onClick={() => setFilterType('my-bridge')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition shrink-0 flex items-center gap-1 ${
                  filterType === 'my-bridge'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <MapPin className="w-3 h-3 text-cyan-300" />
                {currentLocation.name}
              </button>
            )}
          </div>
        </div>

        {/* 3. 스크롤 가능한 편지 카드 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <Waves className="w-8 h-8 text-cyan-400/40 mx-auto animate-pulse" />
              <p className="text-xs">이 다리에는 아직 흘러온 편지가 없어요.</p>
              <p className="text-[11px] text-cyan-300/70">첫 번째 유리병을 물결에 띄워보세요!</p>
            </div>
          ) : (
            filteredMessages.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-2xl border border-white/15 hover:border-cyan-400/40 transition-all text-left shadow-lg group relative"
              >
                {/* 헤더 정보 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] text-cyan-200 font-medium flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-cyan-300" />
                      {item.locationName}
                    </span>
                    {item.timeAgo && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timeAgo}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      openBottle(item);
                    }}
                    className="text-[11px] text-cyan-300 hover:text-white font-medium underline underline-offset-2 transition"
                  >
                    열어보기 →
                  </button>
                </div>

                {/* 본문 (클릭 시 상세 모달 오픈) */}
                <p
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openBottle(item);
                  }}
                  className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3 cursor-pointer hover:text-white transition"
                >
                  {item.text}
                </p>

                {/* 하단 리액션 카운트 및 바로 반응하기 */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => reactToMessage(item.id, 'heart')}
                      className={`flex items-center space-x-1 text-[11px] transition active:scale-90 ${
                        item.userReacted?.heart ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-rose-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.userReacted?.heart ? 'fill-rose-400' : ''}`} />
                      <span>{item.reacts?.heart || 0}</span>
                    </button>

                    <button
                      onClick={() => reactToMessage(item.id, 'cheer')}
                      className={`flex items-center space-x-1 text-[11px] transition active:scale-90 ${
                        item.userReacted?.cheer ? 'text-amber-300 font-bold' : 'text-slate-400 hover:text-amber-200'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${item.userReacted?.cheer ? 'fill-amber-300' : ''}`} />
                      <span>{item.reacts?.cheer || 0}</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400/60">익명의 산책자</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
