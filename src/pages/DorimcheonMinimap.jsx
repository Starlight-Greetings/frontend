import { useState, useMemo } from 'react';
import { MapPin, Navigation, Sparkles, Compass, Waves, MessageSquare, Users, ChevronRight, QrCode } from 'lucide-react';
import { useLetter } from '../hooks/useLetter';
import { LOCATIONS } from '../data/locations';

export default function DorimcheonMinimap() {
  const { enterBridge, selectedMapSpot, setSelectedMapSpot, messages } = useLetter();
  const [activeBridgeId, setActiveBridgeId] = useState(() => selectedMapSpot?.id || 'sillim');

  // 현재 선택된 다리 데이터
  const selectedBridge = useMemo(() => {
    return LOCATIONS[activeBridgeId] || LOCATIONS.sillim;
  }, [activeBridgeId]);

  // 각 다리별 실시간 흐르는 편지 개수 집계
  const bridgeStats = useMemo(() => {
    const counts = { sillim: 0, bongnim: 0, sillim2: 0 };
    messages.forEach((m) => {
      if (m.locationName?.includes('신림교')) counts.sillim += 1;
      else if (m.locationName?.includes('봉림교')) counts.bongnim += 1;
      else if (m.locationName?.includes('신림2교') || m.locationName?.includes('동방') || m.locationName?.includes('서원')) counts.sillim2 += 1;
    });
    return counts;
  }, [messages]);

  const handleSelectBridge = (bridgeId) => {
    setActiveBridgeId(bridgeId);
    setSelectedMapSpot(LOCATIONS[bridgeId]);
  };

  const handleEnter = () => {
    enterBridge(selectedBridge);
  };

  return (
    <div className="flex-1 relative flex flex-col justify-between overflow-hidden select-none">
      {/* 1. 상단 GIS 정보 헤더 오버레이 */}
      <div className="relative z-20 p-3 sm:p-4 pb-0 pointer-events-none">
        <div className="glass-panel rounded-2xl p-3 border border-cyan-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-between pointer-events-auto">
          <div className="min-w-0 mr-2">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-1 truncate">
                <span>도림천 실시간 하천 지도</span>
              </h2>
            </div>
            <p className="text-[10px] text-cyan-200/80 mt-0.5 truncate flex items-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              <span>관악구 별빛내린천 · 수위 안정 (0.8m/s)</span>
            </p>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <div className="px-2 py-1 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-semibold text-cyan-200 flex items-center space-x-1 shadow-sm">
              <Users className="w-3 h-3 text-cyan-300" />
              <span>실시간 124명</span>
            </div>
          </div>
        </div>

        {/* 다리 빠른 전환 칩 */}
        <div className="flex space-x-1.5 mt-2 pointer-events-auto overflow-x-auto scrollbar-none pb-1">
          {Object.values(LOCATIONS).map((bridge) => {
            const isSelected = bridge.id === activeBridgeId;
            return (
              <button
                key={bridge.id}
                onClick={() => handleSelectBridge(bridge.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center space-x-1 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-300/60 scale-105'
                    : 'bg-slate-900/85 hover:bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-cyan-400'}`} />
                <span>{bridge.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 인터랙티브 지도 영역 (실제 도림천 항공 야경 위 다리 핀) */}
      <div className="flex-1 relative overflow-hidden my-1">
        {/* 하천 물길을 따라 흐르는 감성 SVG 네온 유선 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M 42 15 Q 46 28 44 35 T 48 50 T 46 72 T 44 95"
            fill="none"
            stroke="url(#streamGrad)"
            strokeWidth="2.2"
            strokeDasharray="4 2"
            filter="url(#glow)"
            className="animate-pulse"
          />
        </svg>

        {/* 3개 다리 핀 렌더링 */}
        {Object.values(LOCATIONS).map((bridge) => {
          const isSelected = bridge.id === activeBridgeId;
          const letterCount = bridgeStats[bridge.id] || bridge.stats?.lettersCount || 20;

          return (
            <div
              key={bridge.id}
              onClick={() => handleSelectBridge(bridge.id)}
              className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group focus:outline-none"
              style={{
                top: bridge.mapPos.top,
                left: bridge.mapPos.left
              }}
            >
              {/* 레이더 펄스 효과 */}
              <div
                className={`absolute -inset-3 rounded-full transition-opacity duration-300 pointer-events-none ${
                  isSelected ? 'animate-ping opacity-75 bg-cyan-400/40' : 'opacity-0 group-hover:opacity-40 bg-cyan-300/30'
                }`}
              />

              {/* 핀 본체 및 뱃지 */}
              <div
                className={`relative flex flex-col items-center transition-all duration-300 ${
                  isSelected ? 'scale-110 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)]' : 'scale-95 group-hover:scale-105'
                }`}
              >
                {/* 핀 아이콘 */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-xl ${
                    isSelected
                      ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 border-cyan-300 text-white rotate-0'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-400/40 text-cyan-300'
                  }`}
                >
                  <MapPin className={`w-5 h-5 transition-transform ${isSelected ? 'text-amber-300 animate-bounce' : 'text-cyan-300'}`} />
                </div>

                {/* 핀 아래 정보 라벨 */}
                <div
                  className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all duration-200 whitespace-nowrap shadow-lg flex items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-950/95 border-cyan-300 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-950/80 border-white/15 text-slate-200'
                  }`}
                >
                  <span>{bridge.name}</span>
                  <span className="text-[10px] text-cyan-300/80 font-mono">({letterCount})</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 나침반 및 지도 스케일 워터마크 */}
        <div className="absolute top-2 right-3 pointer-events-none z-10 flex flex-col items-end space-y-1">
          <div className="w-8 h-8 rounded-full bg-slate-950/70 border border-white/15 flex items-center justify-center text-slate-300 backdrop-blur-md shadow-md">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <span className="text-[9px] text-slate-400/80 font-mono tracking-tight bg-slate-950/60 px-1.5 py-0.5 rounded">
            N 37°28' E 126°55'
          </span>
        </div>
      </div>

      {/* 3. 하단 선택된 다리 상세 카드 (Glassmorphism Bottom Sheet) */}
      <div className="relative z-30 p-3 sm:p-4 pt-1 animate-modal-in">
        <div className="w-full glass-panel rounded-3xl p-4 sm:p-5 border border-cyan-400/40 shadow-[0_-12px_40px_rgba(0,0,0,0.8)] flex flex-col space-y-3.5 relative overflow-hidden">
          {/* 다리 실제 사진 썸네일 미리보기 */}
          <div className="relative h-24 sm:h-28 w-full rounded-2xl overflow-hidden border border-white/15 shadow-inner">
            <img
              src={selectedBridge.bgImage}
              alt={selectedBridge.name}
              className="w-full h-full object-cover brightness-[0.85] contrast-[1.1] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* 썸네일 위 뱃지 */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-[10px] font-bold backdrop-blur-md">
                {selectedBridge.badge}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 text-[10px] font-medium backdrop-blur-md">
                {selectedBridge.tag}
              </span>
            </div>

            {/* 다리 이름 및 부제 */}
            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight drop-shadow-md">
                  {selectedBridge.name}
                </h3>
                <p className="text-[11px] text-cyan-200/90 font-light truncate">
                  {selectedBridge.sub}
                </p>
              </div>
              <span className="text-[10px] text-slate-300/80 font-light shrink-0">
                {selectedBridge.distance}
              </span>
            </div>
          </div>

          {/* 다리의 고유 사색 질문 */}
          <div className="px-3.5 py-2.5 rounded-2xl bg-cyan-950/50 border border-cyan-400/25 flex items-start space-x-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-cyan-300 font-bold block mb-0.5">다리의 물음</span>
              <p className="text-slate-100 font-medium text-xs leading-snug break-keep">
                "{selectedBridge.question}"
              </p>
            </div>
          </div>

          {/* 실시간 편지 현황 및 입장하기 CTA 버튼 */}
          <div className="flex items-center space-x-2 pt-0.5">
            <button
              onClick={handleEnter}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_4px_24px_rgba(6,182,212,0.45)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.65)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
            >
              <Waves className="w-4 h-4 text-cyan-200 shrink-0" />
              <span>{selectedBridge.name} 입장하기 (물결로 이동)</span>
              <ChevronRight className="w-4 h-4 text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 하단 QR 직행 안내 가이드 */}
          <p className="text-[10px] text-slate-400 text-center font-light flex items-center justify-center gap-1">
            <QrCode className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>현장의 다리 난간 QR 코드를 스캔하면 이 다리로 즉시 입장합니다</span>
          </p>
        </div>
      </div>
    </div>
  );
}
