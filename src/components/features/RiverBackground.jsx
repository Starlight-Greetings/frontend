import { useLetter } from '../../hooks/useLetter';

export default function RiverBackground() {
  const { step, currentLocation } = useLetter();
  const isMap = step === 'map' || step === 'intro';

  // 다리별 고유 야경 배경 이미지 (신림교: sillim_bridge_night.jpg / 봉림교: image_e57129.jpg / 신림2교: sillim2_bridge_night.jpg)
  const currentBgImage = isMap
    ? '/dorimcheon_map_night.jpg'
    : (currentLocation?.bgImage || '/image_e57129.jpg');

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. 다리별 실제 야경 배경화면 */}
      <div
        key={currentBgImage}
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out animate-fade-in ${
          isMap
            ? 'scale-100 translate-y-0 brightness-[0.85] contrast-[1.05] blur-none'
            : 'scale-105 translate-y-2 brightness-[0.72] contrast-[1.1] blur-[0.5px]'
        }`}
        style={{
          backgroundImage: `url('${currentBgImage}')`,
        }}
      />

      {/* 2. 단계별 정교한 글래스모피즘 오버레이 */}
      {/* 지도 뷰: 하천과 도시 불빛이 선명하게 보이도록 가벼운 다크 비네팅 */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isMap ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80`}
      />

      {/* 강물 뷰 / 모달: 유리병의 네온 글로우와 편지 가독성을 위한 딥 나이트 오버레이 */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          !isMap ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90`}
      />

      {/* 방사형 은은한 앰비언트 광채 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

      {/* 3. 별빛내린천 은은한 별빛 반짝임 파티클 */}
      <div className="absolute top-[16%] left-[25%] w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_8px_#38bdf8] animate-twinkle opacity-70" style={{ animationDelay: '0.4s' }} />
      <div className="absolute top-[28%] right-[18%] w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde047] animate-twinkle opacity-80" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-[48%] left-[20%] w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_10px_#60a5fa] animate-twinkle opacity-60" style={{ animationDelay: '2.0s' }} />
      <div className="absolute top-[72%] right-[22%] w-1 h-1 rounded-full bg-emerald-200 shadow-[0_0_6px_#34d399] animate-twinkle opacity-70" style={{ animationDelay: '0.8s' }} />

      {/* 4. 하단 수면 물결 부드러운 안개/빛 굴절 효과 */}
      <div className="absolute -bottom-10 left-0 right-0 h-44 bg-gradient-to-t from-slate-950/60 via-cyan-950/20 to-transparent blur-xl" />
    </div>
  );
}
