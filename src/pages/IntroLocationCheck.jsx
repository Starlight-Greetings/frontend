import { QrCode, MapPin, Sparkles, Navigation, Waves } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import { LOCATIONS } from '../data/locations';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function IntroLocationCheck() {
  const { isLocating, locatingBridgeName, startLocationCheck } = useLetter();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 z-10 overflow-y-auto">
      {/* 1. 인트로 헤더 & 슬로건 카드 */}
      <div className="pt-3 pb-2 flex flex-col items-center text-center space-y-4">
        {/* 상단 별빛 물결 배지 */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-200 text-xs shadow-[0_0_12px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <Waves className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>별빛내린천 디지털 타임캡슐</span>
        </div>

        {/* 슬로건 및 기획 의도 */}
        <div className="space-y-2.5">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            도림천을 걷는 너에게,<br />
            <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              어제의 내가 띄우는 한 줄 위로
            </span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-300/85 max-w-[280px] mx-auto font-light">
            앱 설치와 회원가입 없이,<br />
            다리 난간의 QR 코드로 접속해 마음을 나눕니다.
          </p>
        </div>
      </div>

      {/* 2. QR 인증 영역 or 로딩 상태 */}
      <div className="my-auto py-2">
        {isLocating ? (
          <div className="glass-panel rounded-3xl p-6 border border-cyan-400/30">
            <LoadingSpinner
              text={`📍 ${locatingBridgeName} QR 스캔 확인 중...`}
              subText="다리 반경 50m 위치를 동기화하고 있어요"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-1 text-slate-300 text-xs">
              <span className="flex items-center gap-1 font-medium">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                접속할 다리 스팟을 선택하세요
              </span>
              <span className="text-[11px] text-cyan-300/80 flex items-center gap-0.5">
                <Navigation className="w-3 h-3" /> 위치 기반
              </span>
            </div>

            {Object.values(LOCATIONS).map((loc) => (
              <button
                key={loc.id}
                onClick={() => startLocationCheck(loc.id)}
                className="w-full glass-card hover:bg-white/15 p-4 rounded-2xl transition-all duration-200 text-left flex items-center justify-between group active:scale-[0.98] border border-white/15 hover:border-cyan-400/50 shadow-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-600/30 group-hover:border-cyan-400 transition shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-200 transition">
                        {loc.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 font-medium">
                        QR 즉시접속
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/80 mt-0.5 font-light">
                      {loc.sub}
                    </p>
                    <p className="text-[11px] text-cyan-200/70 mt-1 line-clamp-1 italic">
                      "{loc.question}"
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-semibold text-cyan-300 group-hover:translate-x-1 inline-block transition-transform">
                    입장 →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. 하단 안내 문구 */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[11px] text-slate-400/80 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          도림천 산책로에서 언제나 열려 있는 느슨한 온기
        </p>
      </div>
    </div>
  );
}
