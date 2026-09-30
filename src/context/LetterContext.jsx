import { useState, useCallback, useMemo, useEffect } from 'react';
import { LetterContext } from './createLetterContext';
import { LOCATIONS } from '../data/locations';
import { INITIAL_MESSAGES, WEEKLY_TOPIC } from '../data/mockMessages';
import { isDailyTopGuideSeenToday, markDailyTopGuideSeenToday } from '../utils/dateUtils';
import { isSurveyAsked, markSurveyAsked, openSurveyForm } from '../utils/surveyUtils';

// URL 파라미터(?spot=...) 분석 헬퍼
function resolveSpotFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const spotParam = params.get('spot');
  if (!spotParam) return null;

  const clean = decodeURIComponent(spotParam).trim().toLowerCase();
  if (clean === 'sillim' || clean === '신림교' || clean === '1' || clean === 'bridge1') return LOCATIONS.sillim;
  if (clean === 'bongnim' || clean === '봉림교' || clean === '2' || clean === 'bridge2') return LOCATIONS.bongnim;
  if (clean === 'sillim2' || clean === '신림2교' || clean === '3' || clean === 'bridge3' || clean === 'dongbang' || clean === 'seowon') return LOCATIONS.sillim2;
  if (LOCATIONS[clean]) return LOCATIONS[clean];
  return null;
}

// 물결 젓기(셔플) 시 매번 새롭게 건져 올려질 6가지 다채로운 수면 리스폰 패턴 군
// 모든 좌표는 상단 컨트롤 바와 하단 가이드 문구와 겹치지 않는 안전 수면 영역(top: 14%~56%, left: 20%~76%) 내 배치
const BOTTLE_RESPAWN_PATTERNS = [
  // 패턴 1: 지그재그 유선형 물결 (좌우 번갈아 흐름)
  [
    { top: '16%', left: '22%', animationDelay: '0s', animationClass: 'animate-float-slow' },
    { top: '22%', left: '74%', animationDelay: '1.2s', animationClass: 'animate-float-wave' },
    { top: '35%', left: '30%', animationDelay: '0.6s', animationClass: 'animate-float-gentle' },
    { top: '44%', left: '70%', animationDelay: '1.8s', animationClass: 'animate-float-slow' },
    { top: '56%', left: '24%', animationDelay: '0.9s', animationClass: 'animate-float-wave' }
  ],
  // 패턴 2: 별빛 소용돌이 흐름 (중앙 및 대각 곡선)
  [
    { top: '15%', left: '68%', animationDelay: '0.8s', animationClass: 'animate-float-gentle' },
    { top: '25%', left: '26%', animationDelay: '0.2s', animationClass: 'animate-float-slow' },
    { top: '34%', left: '58%', animationDelay: '1.5s', animationClass: 'animate-float-wave' },
    { top: '46%', left: '22%', animationDelay: '1.0s', animationClass: 'animate-float-gentle' },
    { top: '55%', left: '74%', animationDelay: '0.4s', animationClass: 'animate-float-slow' }
  ],
  // 패턴 3: 양안 분산 물결 (강변 양쪽으로 넓게 흩뿌려짐)
  [
    { top: '18%', left: '32%', animationDelay: '1.4s', animationClass: 'animate-float-slow' },
    { top: '20%', left: '76%', animationDelay: '0.5s', animationClass: 'animate-float-gentle' },
    { top: '36%', left: '48%', animationDelay: '1.9s', animationClass: 'animate-float-wave' },
    { top: '50%', left: '26%', animationDelay: '0.7s', animationClass: 'animate-float-slow' },
    { top: '56%', left: '68%', animationDelay: '1.2s', animationClass: 'animate-float-gentle' }
  ],
  // 패턴 4: 대각선 물무리 (우상단에서 좌하단으로 유영)
  [
    { top: '15%', left: '52%', animationDelay: '0.3s', animationClass: 'animate-float-wave' },
    { top: '26%', left: '22%', animationDelay: '1.1s', animationClass: 'animate-float-slow' },
    { top: '33%', left: '78%', animationDelay: '0.7s', animationClass: 'animate-float-gentle' },
    { top: '45%', left: '46%', animationDelay: '1.6s', animationClass: 'animate-float-wave' },
    { top: '56%', left: '24%', animationDelay: '1.3s', animationClass: 'animate-float-slow' }
  ],
  // 패턴 5: 밤하늘 성좌 클러스터 (은하수처럼 감성적 분산)
  [
    { top: '16%', left: '76%', animationDelay: '0.9s', animationClass: 'animate-float-gentle' },
    { top: '27%', left: '44%', animationDelay: '0.4s', animationClass: 'animate-float-slow' },
    { top: '38%', left: '22%', animationDelay: '1.7s', animationClass: 'animate-float-wave' },
    { top: '48%', left: '70%', animationDelay: '0.6s', animationClass: 'animate-float-slow' },
    { top: '55%', left: '42%', animationDelay: '1.4s', animationClass: 'animate-float-gentle' }
  ],
  // 패턴 6: 도림천 여울목 (잔잔한 호소와 급류의 조화)
  [
    { top: '18%', left: '24%', animationDelay: '1.0s', animationClass: 'animate-float-slow' },
    { top: '17%', left: '64%', animationDelay: '0.2s', animationClass: 'animate-float-gentle' },
    { top: '32%', left: '32%', animationDelay: '1.5s', animationClass: 'animate-float-wave' },
    { top: '42%', left: '76%', animationDelay: '0.8s', animationClass: 'animate-float-slow' },
    { top: '56%', left: '50%', animationDelay: '1.7s', animationClass: 'animate-float-gentle' }
  ]
];

export function LetterProvider({ children }) {
  const initialSpot = useMemo(() => resolveSpotFromUrl(), []);
  const [step, setStep] = useState(() => (initialSpot ? 'river' : 'map')); // 'map' | 'river' | 'read' | 'write'
  const [currentLocation, setCurrentLocation] = useState(() => initialSpot);
  const [selectedMapSpot, setSelectedMapSpot] = useState(() => initialSpot || LOCATIONS.sillim);
  const [isLocating, setIsLocating] = useState(false);
  const [locatingBridgeName, setLocatingBridgeName] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 오늘의 별빛안부 가이드 모달 상태 (KST 00:00 기준 일일 첫 접속자 전용)
  const [isDailyGuideOpen, setIsDailyGuideOpen] = useState(() => !isDailyTopGuideSeenToday());

  // 안부를 묻고 위로받는 취지에 맞게 "위로됐어요"(reacts.cheer) 기준 어제 1위 별빛안부 계산
  const topDailyLetter = useMemo(() => {
    if (!messages || messages.length === 0) return null;
    const yesterdayPool = messages.filter(m => m.timeAgo === '어제' || m.timeAgo?.includes('어제') || m.timeAgo?.includes('일 전'));
    const pool = yesterdayPool.length > 0 ? yesterdayPool : messages;
    return [...pool].sort((a, b) => (b.reacts?.cheer || 0) - (a.reacts?.cheer || 0))[0];
  }, [messages]);

  const closeDailyGuide = useCallback(() => {
    markDailyTopGuideSeenToday();
    setIsDailyGuideOpen(false);
  }, []);

  const openDailyGuide = useCallback(() => {
    setIsDailyGuideOpen(true);
  }, []);

  // 네이버 폼 설문조사 안내 모달 상태 (최초 1회만 문의)
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  const closeSurveyModal = useCallback(() => {
    markSurveyAsked();
    setIsSurveyModalOpen(false);
  }, []);

  const handleParticipateSurvey = useCallback(() => {
    markSurveyAsked();
    setIsSurveyModalOpen(false);
    openSurveyForm();
  }, []);

  // 대규모 편지 관리: 3대 핵심 카테고리 필터링 (현재 교 오늘 베스트 Top5 / 현재 교 주제별 Top5 / 전체 교 주제별 Top5)
  const [filterType, setFilterType] = useState('bridge-daily-best'); // 'bridge-daily-best' | 'bridge-weekly-best' | 'all-weekly-best'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shufflePhase, setShufflePhase] = useState('idle'); // 'idle' | 'departing' | 'arriving'
  const isShuffling = shufflePhase !== 'idle';
  const isDeparting = shufflePhase === 'departing';
  const [shuffleKey, setShuffleKey] = useState(0);

  // 토스트 메시지 상태
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const triggerToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  }, []);

  // URL ?spot=... 으로 직행 접속한 경우 환영 토스트 알림
  useEffect(() => {
    if (initialSpot) {
      triggerToast(`📍 ${initialSpot.name} 스팟에 QR로 즉시 입장했습니다.`, 'info');
    }
  }, [initialSpot, triggerToast]);

  // 1. 다리 입장 (즉시 입장)
  const enterBridge = useCallback((locKeyOrObj) => {
    let target = locKeyOrObj;
    if (typeof locKeyOrObj === 'string') {
      target = LOCATIONS[locKeyOrObj] || LOCATIONS.sillim;
    }
    if (!target) return;

    setCurrentLocation(target);
    setSelectedMapSpot(target);
    setStep('river');
    triggerToast(`📍 ${target.name} 물결에 입장했습니다.`, 'info');
  }, [triggerToast]);

  // 도림천 미니맵으로 복귀
  const goToMap = useCallback(() => {
    setStep('map');
  }, []);

  const resetLocation = goToMap;
  const startLocationCheck = enterBridge;

  // 2. 유리병 열기
  const openBottle = useCallback((msg) => {
    setSelectedMessage(msg);
    setStep('read');
  }, []);

  // 3. 모달 닫고 강물 뷰로 복귀
  const closeToRiver = useCallback(() => {
    setStep('river');
    setTimeout(() => {
      setSelectedMessage(null);
    }, 200);
  }, []);

  // 4. 작성 모달 열기
  const openWrite = useCallback(() => {
    setStep('write');
  }, []);

  // 5. 새 편지 띄우기 (강물에 병 띄우기)
  const submitLetter = useCallback((text, theme = 'amber') => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newLetter = {
        id: Date.now(),
        locationName: currentLocation ? currentLocation.name : '별빛내린천',
        timeAgo: '방금 전',
        text,
        theme,
        reacts: { heart: 0, cheer: 0, report: 0 },
        userReacted: { heart: false, cheer: false, report: false },
        isNew: true
      };

      setMessages(prev => [newLetter, ...prev]);
      setIsSubmitting(false);
      setShuffleKey(k => k + 1); // 새로 작성된 편지가 첫 화면에 뜨도록 리프레시
      setStep('river');
      triggerToast('✨ 따뜻한 마음이 별빛내린천 물결에 띄워졌습니다.', 'success');

      // 편지 작성 완료 후 설문 미참여 사용자인 경우 단 1회 한정 설문 팝업 문의
      if (!isSurveyAsked()) {
        setTimeout(() => {
          setIsSurveyModalOpen(true);
        }, 500);
      }
    }, 1200);
  }, [currentLocation, triggerToast]);

  // 6. 편지 반응 (토닥토닥 / 응원해요 / 가라앉히기)
  const reactToMessage = useCallback((msgId, type) => {
    setMessages(prev =>
      prev.map(item => {
        if (item.id !== msgId) return item;

        const isAlready = item.userReacted[type];
        const nextReacted = {
          ...item.userReacted,
          [type]: !isAlready
        };

        const nextCount = {
          ...item.reacts,
          [type]: isAlready ? Math.max(0, item.reacts[type] - 1) : item.reacts[type] + 1
        };

        const updated = {
          ...item,
          reacts: nextCount,
          userReacted: nextReacted
        };

        if (selectedMessage && selectedMessage.id === msgId) {
          setSelectedMessage(updated);
        }

        return updated;
      })
    );

    if (type === 'heart') {
      triggerToast('❤️ "토닥토닥" 마음이 전해졌어요.', 'info');
    } else if (type === 'cheer') {
      triggerToast('✨ "위로됐어요" 마음을 보냈습니다.', 'info');
    } else if (type === 'report') {
      triggerToast('🚨 가라앉히기 요청이 접수되었습니다.', 'warn');
    }
  }, [selectedMessage, triggerToast]);

  // 7. 물결 젓기 (셔플) 기능 고도화 (퇴장 -> 수면 소용돌이 -> 새 유리병 순차 부력 등장)
  const shuffleStream = useCallback(() => {
    if (isShuffling) return;
    setShufflePhase('departing'); // 1단계: 기존 병들이 물살을 타고 부드럽게 흘러내려감 (400ms)

    setTimeout(() => {
      setShuffleKey(prev => prev + 1); // 2단계: 새 유리병 세트 & 새 좌표 로드
      setShufflePhase('arriving'); // 새 유리병들이 수면 위로 차례대로 떠오름

      setTimeout(() => {
        setShufflePhase('idle');
        triggerToast('🌊 물결을 저어 새로운 유리병들을 건져 올렸습니다.', 'info');
      }, 700);
    }, 420);
  }, [isShuffling, triggerToast]);

  // 8. 서랍장 3대 핵심 카테고리 필터링 계산
  // 1) 현재 교의 오늘 베스트 TOP 5
  // 2) 현재 교의 주간 주제별 베스트 TOP 5
  // 3) 도림천 모든 교 합산 주간 주제별 베스트 TOP 5
  const filteredMessages = useMemo(() => {
    const curName = currentLocation ? currentLocation.name : '신림교';

    if (filterType === 'bridge-weekly-best') {
      // 1. 현재 교의 주간 주제별 베스트 Top 5
      const pool = messages.filter(m => m.locationName === curName && m.isWeeklyTopic);
      const sorted = [...pool].sort((a, b) => 
        ((b.reacts?.cheer || 0) * 2 + (b.reacts?.heart || 0)) - 
        ((a.reacts?.cheer || 0) * 2 + (a.reacts?.heart || 0))
      );
      return sorted.slice(0, 5);
    } else if (filterType === 'all-weekly-best') {
      // 2. 도림천 전체(모든 교 합산) 주간 주제별 베스트 Top 5
      const pool = messages.filter(m => m.isWeeklyTopic);
      const sorted = [...pool].sort((a, b) => 
        ((b.reacts?.cheer || 0) * 2 + (b.reacts?.heart || 0)) - 
        ((a.reacts?.cheer || 0) * 2 + (a.reacts?.heart || 0))
      );
      return sorted.slice(0, 5);
    } else {
      // 3. 기본값: 현재 교의 오늘 하루 기준 베스트 Top 5
      const pool = messages.filter(m => m.locationName === curName);
      const sorted = [...pool].sort((a, b) => 
        ((b.reacts?.cheer || 0) * 2 + (b.reacts?.heart || 0)) - 
        ((a.reacts?.cheer || 0) * 2 + (a.reacts?.heart || 0))
      );
      return sorted.slice(0, 5);
    }
  }, [messages, filterType, currentLocation]);

  // 9. 화면에 동시 노출할 엄선된 4~5개 유리병 계산 (강물 뷰)
  // 현재 접속한 다리의 편지를 우선 부유시키며, shuffleKey 증가 시마다 6가지 리스폰 패턴 순환
  const activeStreamBottles = useMemo(() => {
    const bridgePool = currentLocation 
      ? messages.filter(m => m.locationName === currentLocation.name)
      : messages;
    const list = bridgePool.length >= 4 ? bridgePool : messages;
    const maxCount = Math.min(5, list.length);
    if (maxCount === 0) return [];

    // shuffleKey에 따라 패턴 0~5 중 하나를 선택
    const patternIndex = shuffleKey % BOTTLE_RESPAWN_PATTERNS.length;
    const currentPattern = BOTTLE_RESPAWN_PATTERNS[patternIndex];

    // 시작 메시지 인덱스도 shuffleKey에 따라 고르게 분산
    const startIndex = (shuffleKey * 3 + patternIndex) % list.length;
    const selected = [];

    for (let i = 0; i < maxCount; i++) {
      const item = list[(startIndex + i) % list.length];
      const pos = currentPattern[i % currentPattern.length];
      selected.push({
        ...item,
        position: { top: pos.top, left: pos.left },
        animationDelay: pos.animationDelay,
        animationClass: pos.animationClass
      });
    }

    return selected;
  }, [messages, currentLocation, shuffleKey]);

  return (
    <LetterContext.Provider
      value={{
        step,
        setStep,
        currentLocation,
        isLocating,
        locatingBridgeName,
        messages,
        filteredMessages,
        activeStreamBottles,
        selectedMessage,
        isSubmitting,
        toast,
        filterType,
        setFilterType,
        isDrawerOpen,
        setIsDrawerOpen,
        isShuffling,
        isDeparting,
        shufflePhase,
        shuffleKey,
        shuffleStream,
        enterBridge,
        goToMap,
        selectedMapSpot,
        setSelectedMapSpot,
        startLocationCheck,
        resetLocation,
        openBottle,
        closeToRiver,
        openWrite,
        submitLetter,
        reactToMessage,
        triggerToast,
        isDailyGuideOpen,
        openDailyGuide,
        closeDailyGuide,
        topDailyLetter,
        weeklyTopic: WEEKLY_TOPIC,
        isSurveyModalOpen,
        closeSurveyModal,
        handleParticipateSurvey
      }}
    >
      {children}
    </LetterContext.Provider>
  );
}
