import { useLetter } from '../../hooks/useLetter';

export default function RiverBackground() {
  const { step } = useLetter();
  const isIntro = step === 'intro';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. 옵션 B: 감성적인 별빛내린천 야경 3D 일러스트 배경 (public/dorimcheon_night_illust.jpg)
          - 9:16 모바일 비율의 시네마틱 아트
          - 인트로: 은하수와 다리가 시원하게 펼쳐지는 뷰
          - 강물뷰/모달: 물결과 반짝이는 빛망울 쪽으로 부드럽게 줌인(1초 트랜지션)
      */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
          isIntro
            ? 'scale-100 translate-y-0 brightness-100 contrast-100 blur-none'
            : 'scale-110 translate-y-3 brightness-[0.75] contrast-[1.1] blur-[1px]'
        }`}
        style={{
          backgroundImage: `url('/image_e57129.jpg')`,
        }}
      />

      {/* 2. 단계별 정교한 글래스모피즘 오버레이 */}
      {/* 인트로: 상단 텍스트와 하단 카드 가독성을 위한 부드럽고 차분한 다크 비네팅 (눈부심 방지) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isIntro ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90`}
      />

      {/* 강물 뷰 / 모달: 유리병의 네온 글로우와 편지 가독성을 위한 딥 나이트 오버레이 */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          !isIntro ? 'opacity-100' : 'opacity-0'
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
