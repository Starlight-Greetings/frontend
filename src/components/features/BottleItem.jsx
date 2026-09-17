import { Sparkles } from 'lucide-react';

// 병 테마별 글로우 & 하이라이트 색상 설정
const THEME_STYLES = {
  amber: {
    glow: 'rgba(251, 191, 36, 0.45)',
    filterShadow: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.75))',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    paper: '#fef3c7',
    glassTint: 'rgba(253, 230, 138, 0.22)'
  },
  cyan: {
    glow: 'rgba(56, 189, 248, 0.45)',
    filterShadow: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.75))',
    badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
    paper: '#e0f2fe',
    glassTint: 'rgba(186, 230, 253, 0.22)'
  },
  rose: {
    glow: 'rgba(244, 114, 182, 0.45)',
    filterShadow: 'drop-shadow(0 0 16px rgba(244, 114, 182, 0.75))',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
    paper: '#ffe4e6',
    glassTint: 'rgba(254, 205, 211, 0.22)'
  },
  emerald: {
    glow: 'rgba(52, 211, 153, 0.45)',
    filterShadow: 'drop-shadow(0 0 16px rgba(52, 211, 153, 0.75))',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    paper: '#d1fae5',
    glassTint: 'rgba(167, 243, 208, 0.22)'
  }
};

export default function BottleItem({ message, onOpen, animationClass = 'animate-float-slow' }) {
  const theme = THEME_STYLES[message.theme] || THEME_STYLES.cyan;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 group z-10 select-none -translate-x-1/2 -translate-y-1/2 scale-90 sm:scale-100 ${animationClass}`}
      style={{
        top: message.position?.top || '40%',
        left: message.position?.left || '40%',
        animationDelay: message.animationDelay || '0s'
      }}
      onClick={() => onOpen(message)}
    >
      {/* 1. 물결 파동 효과 (병 아래 잔물결) */}
      <div
        className="absolute -inset-4 rounded-full animate-water-ripple pointer-events-none"
        style={{
          border: `1px solid ${theme.glow}`,
          animationDelay: message.animationDelay || '0s'
        }}
      />

      {/* 2. 병 주위 앰비언트 글로우 */}
      <div
        className="absolute -inset-2 rounded-full opacity-60 group-hover:opacity-100 blur-lg transition duration-500 pointer-events-none"
        style={{ backgroundColor: theme.glow }}
      />

      {/* 3. 섬세한 커스텀 SVG 유리병 아이콘 */}
      <div
        className="relative w-14 h-20 transition-transform duration-300 group-hover:scale-115 group-active:scale-95"
        style={{ filter: theme.filterShadow }}
      >
        <svg
          viewBox="0 0 64 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* 코르크 마개 */}
          <path
            d="M27 4H37C38.1046 4 39 4.89543 39 6V10H25V6C25 4.89543 25.8954 4 27 4Z"
            fill="#B45309"
            stroke="#D97706"
            strokeWidth="1.2"
          />
          {/* 병 주둥이 입구 */}
          <rect
            x="23"
            y="10"
            width="18"
            height="4"
            rx="2"
            fill="white"
            fillOpacity="0.4"
            stroke="white"
            strokeWidth="1"
          />
          {/* 병 목 부분 */}
          <path
            d="M25 14H39V24C39 26 41 28 44 32C49 39 52 46 52 56V76C52 85.9411 43.9411 94 34 94H30C20.0589 94 12 85.9411 12 76V56C12 46 15 39 20 32C23 28 25 26 25 24V14Z"
            fill={theme.glassTint}
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="1.5"
          />
          {/* 병 내부 두루마리 편지 쪽지 */}
          <g transform="translate(24, 46) rotate(8)">
            <rect
              x="0"
              y="0"
              width="14"
              height="26"
              rx="3"
              fill={theme.paper}
              opacity="0.92"
            />
            {/* 편지 리본 끈 */}
            <rect x="0" y="11" width="14" height="3" fill="#E11D48" opacity="0.8" />
            {/* 편지 글씨 흔적 */}
            <line x1="2.5" y1="4" x2="11.5" y2="4" stroke="#94A3B8" strokeWidth="1" />
            <line x1="2.5" y1="7" x2="9.5" y2="7" stroke="#94A3B8" strokeWidth="1" />
            <line x1="2.5" y1="18" x2="11.5" y2="18" stroke="#94A3B8" strokeWidth="1" />
            <line x1="2.5" y1="21" x2="7.5" y2="21" stroke="#94A3B8" strokeWidth="1" />
          </g>

          {/* 유리 하이라이트 (빛 반사선) */}
          <path
            d="M17 56C17 48 19 42 22 36C23.5 33 24.5 30 25 28"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M16 64V76C16 82 20 87 26 89"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* 작은 반짝이 별빛 아이콘 뱃지 */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3.5 h-3.5 text-white animate-twinkle drop-shadow-[0_0_6px_#fff]" />
        </div>
      </div>

      {/* 4. 마우스 호버 or 모바일 안내 툴팁 (다리 이름과 토닥토닥 수) */}
      <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 opacity-80 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-md shadow-md ${theme.badgeBg}`}>
          {message.locationName} · ❤️ {message.reacts?.heart || 0}
        </span>
      </div>
    </div>
  );
}
