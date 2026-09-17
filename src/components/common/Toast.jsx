import { Sparkles, AlertTriangle } from 'lucide-react';
import { useLetter } from '../../hooks/useLetter';

export default function Toast() {
  const { toast } = useLetter();

  if (!toast.show) return null;

  const iconMap = {
    info: <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />,
    success: <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />,
    warn: <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
  };

  const borderMap = {
    info: 'border-cyan-400/40 bg-slate-900/80 text-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.25)]',
    success: 'border-emerald-400/40 bg-slate-900/80 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.25)]',
    warn: 'border-amber-400/40 bg-slate-900/80 text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
  };

  return (
    <div className="absolute top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-modal-in">
      <div
        className={`px-4 py-2.5 rounded-2xl backdrop-blur-xl border text-xs font-medium flex items-center space-x-2.5 max-w-sm pointer-events-auto ${borderMap[toast.type] || borderMap.info}`}
      >
        {iconMap[toast.type] || iconMap.info}
        <span className="leading-snug">{toast.message}</span>
      </div>
    </div>
  );
}
