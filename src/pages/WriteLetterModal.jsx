import { useState, useMemo } from 'react';
import { X, Send, Sparkles, HelpCircle, AlertCircle, CheckCircle2, Waves } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import { validateLetterContent } from '../utils/filter';

const BOTTLE_THEMES = [
  { id: 'amber', label: '노을빛', dotColor: 'bg-amber-400', border: 'border-amber-400/60' },
  { id: 'cyan', label: '달빛', dotColor: 'bg-cyan-400', border: 'border-cyan-400/60' },
  { id: 'rose', label: '위로빛', dotColor: 'bg-rose-400', border: 'border-rose-400/60' },
  { id: 'emerald', label: '물결빛', dotColor: 'bg-emerald-400', border: 'border-emerald-400/60' }
];

export default function WriteLetterModal() {
  const { currentLocation, closeToRiver, submitLetter, isSubmitting } = useLetter();
  const [text, setText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('amber');
  const [isFocused, setIsFocused] = useState(false);

  // 글자 수 및 유효성 검사
  const validation = useMemo(() => {
    return validateLetterContent(text);
  }, [text]);

  const length = text.length;
  const isOverLimit = length > 150;
  const canSubmit = text.trim().length > 0 && validation.isValid && !isSubmitting;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    submitLetter(text.trim(), selectedTheme);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end sm:justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`w-full glass-panel rounded-3xl p-6 border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh] overflow-y-auto transition-all duration-500 ${
          isSubmitting ? 'animate-float-away opacity-0 scale-90' : 'animate-modal-in'
        }`}
      >
        {/* 1. 상단 바: 제목 및 닫기 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">유리병 편지 띄우기</h2>
          </div>

          <button
            type="button"
            onClick={closeToRiver}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. 현재 다리의 질문 배너 */}
        <div className="mt-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/25 shadow-inner">
          <div className="flex items-center space-x-1.5 text-cyan-300 text-xs font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{currentLocation ? `${currentLocation.name}의 물음` : '도림천의 물음'}</span>
          </div>
          <p className="text-sm font-medium text-white/90 leading-snug drop-shadow-sm">
            {currentLocation?.question || '오늘 도림천에 내려놓고 싶은 마음은 무엇인가요?'}
          </p>
        </div>

        {/* 3. 편지 본문 작성 영역 (Focus, Error, Validation 상태) */}
        <form onSubmit={handleSubmit} className="mt-4 flex-1 flex flex-col space-y-3">
          <div
            className={`relative rounded-2xl transition-all duration-200 p-0.5 ${
              !validation.isValid && text.length > 0
                ? 'bg-gradient-to-b from-rose-500 to-red-600'
                : isFocused
                ? 'bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/15'
            }`}
          >
            <textarea
              rows={5}
              maxLength={160}
              disabled={isSubmitting}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="산책로를 지나는 익명의 이웃에게 건네는 따뜻한 한 줄을 적어보세요. 타인을 비방하거나 비하하는 글은 필터링됩니다."
              className="w-full h-36 bg-slate-900/90 text-slate-100 placeholder-slate-400/50 p-4 rounded-[14px] text-sm leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* 실시간 유효성 피드백 & 글자 수 카운터 */}
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center space-x-1">
              {!validation.isValid && text.length > 0 ? (
                <span className="text-rose-300 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validation.errorMsg}
                </span>
              ) : text.trim().length > 0 ? (
                <span className="text-emerald-300/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  따뜻한 온기가 담긴 글이에요
                </span>
              ) : (
                <span className="text-slate-400/80">최대 150자 작성</span>
              )}
            </div>

            <div className="font-mono text-slate-300/80">
              <span className={length >= 140 ? 'text-amber-300 font-bold' : isOverLimit ? 'text-rose-400 font-bold' : ''}>
                {length}
              </span>
              <span className="text-slate-500"> / 150자</span>
            </div>
          </div>

          {/* 4. 유리병 빛깔 테마 선택 */}
          <div className="pt-2">
            <p className="text-xs text-slate-300/80 mb-2 font-medium">유리병 빛깔 고르기</p>
            <div className="grid grid-cols-4 gap-2">
              {BOTTLE_THEMES.map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 ${
                    selectedTheme === theme.id
                      ? `${theme.border} bg-white/20 shadow-md font-semibold text-white`
                      : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${theme.dotColor} shadow-[0_0_8px_currentColor]`} />
                  <span className="text-[11px]">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. 하단 버튼 영역 */}
          <div className="pt-3 flex space-x-3">
            <button
              type="button"
              onClick={closeToRiver}
              disabled={isSubmitting}
              className="w-1/3 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition active:scale-95"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-2/3 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg ${
                canSubmit
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 active:scale-95 cursor-pointer'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Waves className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>물결에 띄우는 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-cyan-200" />
                  <span>강물에 띄워 보내기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
