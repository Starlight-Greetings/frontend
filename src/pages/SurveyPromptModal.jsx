import { ClipboardCheck, ExternalLink, X, Sparkles } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';

export default function SurveyPromptModal() {
  const { isSurveyModalOpen, closeSurveyModal, handleParticipateSurvey } = useLetter();

  if (!isSurveyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] animate-modal-in flex flex-col space-y-4 text-center relative overflow-hidden">
        
        {/* 배경 은은한 광채 */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

        {/* 상단 닫기 버튼 */}
        <button
          onClick={closeSurveyModal}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 상단 아이콘 */}
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-1">
          <ClipboardCheck className="w-6 h-6 animate-pulse" />
        </div>

        {/* 타이틀 & 본문 */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>도림천 이용 소감 조사</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
            따뜻한 편지가 전달되었습니다!<br />
            <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              잠시 설문에 참여해보시겠어요?
            </span>
          </h3>

          <p className="text-xs text-slate-300/80 leading-relaxed font-light px-2">
            소중한 의견(약 1분 소요)은 별빛내린천 공간 개선과 서비스 향상에 큰 힘이 됩니다.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[10px] text-cyan-200/80">
          💡 편지 작성 후 최초 1회만 여쭤보며, 이후에는 다시 뜨지 않습니다.
        </div>

        {/* 액션 버튼 */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleParticipateSurvey}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs tracking-wide border border-cyan-300/40 shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>네, 설문 참여할게요 (네이버 폼)</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
          </button>

          <button
            onClick={closeSurveyModal}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
          >
            나중에 할게요
          </button>
        </div>

      </div>
    </div>
  );
}
