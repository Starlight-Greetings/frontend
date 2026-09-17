import { X, MapPin, Clock, Quote, ArrowLeft, ExternalLink, ClipboardCheck, Sparkles } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import ReactionButtons from '../components/features/ReactionButtons';
import { openSurveyForm } from '../utils/surveyUtils';

export default function ReadLetterModal() {
  const { selectedMessage, closeToRiver, reactToMessage } = useLetter();

  if (!selectedMessage) return null;

  const hasReacted = selectedMessage.userReacted && (
    selectedMessage.userReacted.heart ||
    selectedMessage.userReacted.cheer ||
    selectedMessage.userReacted.report
  );

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end sm:justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full glass-panel rounded-3xl p-6 border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.6)] animate-modal-in flex flex-col max-h-[85vh] overflow-hidden">
        {/* 상단 헤더: 위치 및 작성시간 & 닫기 버튼 */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-cyan-300" />
              <span>{selectedMessage.locationName || '도림천 물결'}</span>
            </span>

            {selectedMessage.timeAgo && (
              <span className="flex items-center space-x-1 text-[11px] text-slate-300/70">
                <Clock className="w-3 h-3" />
                <span>{selectedMessage.timeAgo}</span>
              </span>
            )}
          </div>

          <button
            onClick={closeToRiver}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 편지 본문 영역 */}
        <div className="py-6 flex-1 overflow-y-auto">
          <div className="flex items-start space-x-2 text-cyan-400/40 mb-2">
            <Quote className="w-6 h-6 rotate-180" />
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-normal px-2 tracking-normal break-keep">
            {selectedMessage.text}
          </p>

          <div className="flex justify-end text-cyan-400/40 mt-3">
            <Quote className="w-6 h-6" />
          </div>
        </div>

        {/* 리액션 버튼 영역 (토닥토닥, 응원해요, 가라앉히기) */}
        <ReactionButtons message={selectedMessage} onReact={reactToMessage} />

        {/* 하단 버튼 영역: 반응 전(가운데 정렬) -> 반응 후(왼쪽: 강물로 돌아가기 / 오른쪽: 설문조사 하러가기) */}
        <div className={`pt-3 sm:pt-4 border-t border-white/10 mt-4 text-xs flex items-center gap-2 transition-all duration-300 ${
          hasReacted ? 'justify-between flex-wrap sm:flex-nowrap' : 'justify-center'
        }`}>
          <button
            onClick={closeToRiver}
            className="text-slate-300 hover:text-white flex items-center gap-1.5 py-1.5 transition underline underline-offset-4 shrink-0 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">강물로 돌아가기</span>
          </button>

          {hasReacted && (
            <button
              onClick={openSurveyForm}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/85 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-200 hover:text-white font-semibold transition active:scale-95 shadow-md animate-fade-in shrink-0 whitespace-nowrap"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span className="whitespace-nowrap">설문조사 하러가기</span>
              <ExternalLink className="w-3 h-3 text-cyan-300/80 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
