import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Quote, Clock, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import ReactionButtons from '../components/features/ReactionButtons';
import { getFormattedKSTYesterdayDate, getTimeUntilKSTMidnight } from '../utils/dateUtils';

export default function DailyTopGuideModal() {
  const {
    isDailyGuideOpen,
    closeDailyGuide,
    topDailyLetter,
    reactToMessage,
    weeklyTopic
  } = useLetter();

  // KST 00:00 갱신까지 남은 카운트다운 타이머
  const [timeLeft, setTimeLeft] = useState(getTimeUntilKSTMidnight());

  useEffect(() => {
    if (!isDailyGuideOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilKSTMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, [isDailyGuideOpen]);

  if (!isDailyGuideOpen || !topDailyLetter) return null;

  const yesterdayDateString = getFormattedKSTYesterdayDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md glass-panel rounded-3xl p-5 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-modal-in flex flex-col max-h-[90vh] overflow-hidden relative">

        {/* 배경 상단 은은한 오로라 광채 */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* 1. 가이드 상단 헤더 & 타이틀 */}
        <div className="text-center pt-1 pb-3 space-y-2 border-b border-white/10 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-[11px] font-semibold tracking-wide shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce shrink-0" />
            <span>DAILY GUIDE · 오늘의 별빛안부</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug break-keep">
            이웃들에게 가장 깊은 위로를 전한<br />
            <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-cyan-200 bg-clip-text text-transparent">
              오늘의 별빛안부
            </span>
          </h2>

          <p className="text-[11px] text-slate-300/90 font-light break-keep">
            전날({yesterdayDateString}) 기준 '위로됐어요'를 가장 많이 받은 대표 안부 편지입니다.
          </p>
        </div>

        {/* 2. 주간 별빛안부 주제 배너 */}
        {weeklyTopic && (
          <div className="my-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/90 via-indigo-950/90 to-slate-900/90 border border-cyan-400/30 flex items-start space-x-2 text-xs text-cyan-200 shadow-md">
            <MessageCircle className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block whitespace-nowrap">
                주제별 별빛안부 ({weeklyTopic.subtitle})
              </span>
              <p className="text-slate-100 font-medium text-xs leading-snug mt-0.5 break-keep">
                "{weeklyTopic.title}"
              </p>
            </div>
          </div>
        )}

        {/* 3. 오늘의 별빛안부 대표 유리병 카드리프 */}
        <div className="flex-1 overflow-y-auto pr-1 my-1 space-y-3">
          <div className="relative rounded-2xl p-4 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-400/30 shadow-lg group">

            {/* 별빛안부 배지 & 위로됐어요 반응 수 */}
            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap mb-3">
              <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold whitespace-nowrap shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>오늘의 별빛안부</span>
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-300/80 font-medium whitespace-nowrap shrink-0">
                  <MapPin className="w-3 h-3 text-cyan-300 shrink-0" />
                  <span>{topDailyLetter.locationName}</span>
                </span>
              </div>

              {/* 위로됐어요 반응 수 */}
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-200 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30 whitespace-nowrap shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse shrink-0" />
                <span>{topDailyLetter.reacts?.cheer || 0} 위로됐어요</span>
              </div>
            </div>

            {/* 편지 본문 */}
            <div className="py-2 text-slate-100 text-sm sm:text-base leading-relaxed font-normal tracking-normal break-keep">
              <div className="text-cyan-400/30 mb-1">
                <Quote className="w-5 h-5 rotate-180" />
              </div>
              <p className="px-1 text-slate-100 font-medium">
                {topDailyLetter.text}
              </p>
              <div className="flex justify-end text-cyan-400/30 mt-1">
                <Quote className="w-5 h-5" />
              </div>
            </div>

            {/* 본문 하단 직관적 반응 버튼 */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-[10px] text-slate-400 text-center mb-2 whitespace-nowrap">
                따뜻한 안부에 직접 마음을 얹어주세요
              </p>
              <ReactionButtons message={topDailyLetter} onReact={reactToMessage} />
            </div>
          </div>

          {/* KST 00:00 리셋 카운트다운 박스 */}
          <div className="rounded-xl p-3 bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-300 whitespace-nowrap">
              <Clock className="w-4 h-4 text-cyan-400 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
              <span className="font-medium text-[11px]">다음 별빛안부 갱신까지</span>
            </div>
            <div className="font-mono text-cyan-300 font-bold text-xs bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-400/30 shrink-0 whitespace-nowrap">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* 4. 가이드 완독 confirmation 버튼 */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <button
            onClick={closeDailyGuide}
            className="w-full relative group overflow-hidden rounded-2xl p-3 sm:p-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_4px_24px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-white font-bold shrink-0" />
            <span className="break-keep">위로를 마음에 품고 도림천 물결로 가기</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          </button>

          <p className="text-[10px] text-slate-400 text-center font-light">
            확인을 누르면 오늘(한국시간 기준)은 다시 뜨지 않습니다.
          </p>
        </div>

      </div>
    </div>
  );
}
