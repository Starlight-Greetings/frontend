import { Compass, Waves } from 'lucide-react';

export default function LoadingSpinner({ text = '위치를 확인하고 있습니다...', subText = '도림천 물결과 연결 중' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-5 animate-modal-in">
      <div className="relative flex items-center justify-center">
        {/* 외부 펄스 링 */}
        <div className="absolute w-24 h-24 rounded-full border border-cyan-400/30 animate-ping opacity-60"></div>
        <div className="absolute w-16 h-16 rounded-full border border-indigo-400/40 animate-pulse"></div>
        
        {/* 중앙 아이콘 서클 */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600/40 via-indigo-600/40 to-blue-500/40 border border-cyan-300/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
          <Compass className="w-7 h-7 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* 잔물결 효과 */}
        <div className="absolute -bottom-2 flex items-center justify-center">
          <Waves className="w-6 h-6 text-cyan-300/60 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-cyan-100 tracking-wide drop-shadow-md">
          {text}
        </p>
        <p className="text-xs text-slate-300/70">
          {subText}
        </p>
      </div>
    </div>
  );
}
