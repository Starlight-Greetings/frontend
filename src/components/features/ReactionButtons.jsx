import { Heart, Sparkles, Anchor } from 'lucide-react';

export default function ReactionButtons({ message, onReact }) {
  const { reacts = { heart: 0, cheer: 0, report: 0 }, userReacted = {} } = message;

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-white/15">
      {/* 1. 토닥토닥 (Heart) */}
      <button
        onClick={() => onReact(message.id, 'heart')}
        className={`flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-2xl border transition-all duration-300 active:scale-95 ${
          userReacted.heart
            ? 'bg-rose-500/25 border-rose-400/60 text-rose-200 shadow-[0_0_16px_rgba(244,114,182,0.4)]'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="relative mb-1">
          <Heart
            className={`w-5 h-5 transition-transform duration-300 ${
              userReacted.heart
                ? 'fill-rose-400 text-rose-400 scale-110 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]'
                : 'text-slate-300'
            }`}
          />
        </div>
        <span className="text-[11px] font-semibold whitespace-nowrap">토닥토닥</span>
        <span className="text-[10px] opacity-75 font-mono mt-0.5 whitespace-nowrap">{reacts.heart}</span>
      </button>

      {/* 2. 위로됐어요 (Sparkles) */}
      <button
        onClick={() => onReact(message.id, 'cheer')}
        className={`flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-2xl border transition-all duration-300 active:scale-95 ${
          userReacted.cheer
            ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="relative mb-1">
          <Sparkles
            className={`w-5 h-5 transition-transform duration-300 ${
              userReacted.cheer
                ? 'fill-amber-300 text-amber-300 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'text-slate-300'
            }`}
          />
        </div>
        <span className="text-[11px] font-semibold whitespace-nowrap">위로됐어요</span>
        <span className="text-[10px] opacity-75 font-mono mt-0.5 whitespace-nowrap">{reacts.cheer}</span>
      </button>

      {/* 3. 가라앉히기 (신고/부적절) */}
      <button
        onClick={() => onReact(message.id, 'report')}
        className={`flex-1 flex flex-col items-center justify-center py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-2xl border transition-all duration-300 active:scale-95 ${
          userReacted.report
            ? 'bg-slate-700/50 border-slate-500/60 text-slate-300'
            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
        }`}
      >
        <div className="relative mb-1">
          <Anchor className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
        </div>
        <span className="text-[11px] font-semibold whitespace-nowrap">가라앉히기</span>
        <span className="text-[10px] opacity-60 font-mono mt-0.5 whitespace-nowrap">신고</span>
      </button>
    </div>
  );
}
