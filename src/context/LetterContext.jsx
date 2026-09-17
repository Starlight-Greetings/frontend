import { useState, useCallback, useMemo } from 'react';
import { LetterContext } from './createLetterContext';
import { LOCATIONS } from '../data/locations';
import { INITIAL_MESSAGES, WEEKLY_TOPIC } from '../data/mockMessages';
import { isDailyTopGuideSeenToday, markDailyTopGuideSeenToday } from '../utils/dateUtils';
import { isSurveyAsked, markSurveyAsked, openSurveyForm } from '../utils/surveyUtils';

// 4~5개 병의 자연스러운 수면 분산 좌표 프리셋
const BOTTLE_POSITIONS = [
  { top: '24%', left: '18%', animationDelay: '0s' },
  { top: '46%', left: '66%', animationDelay: '1.1s' },
  { top: '68%', left: '26%', animationDelay: '0.5s' },
  { top: '35%', left: '52%', animationDelay: '1.7s' },
  { top: '78%', left: '60%', animationDelay: '0.9s' }
];

export function LetterProvider({ children }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'river' | 'read' | 'write'
  const [currentLocation, setCurrentLocation] = useState(null);
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

  // 대규모 편지 관리: 필터 및 서랍(바텀시트), 셔플 상태
  const [filterType, setFilterType] = useState('all'); // 'all' | 'my-bridge' | 'popular' | 'recent'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  // 토스트 메시지 상태
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const triggerToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  }, []);

  // 1. QR 인증 및 위치 체크
  const startLocationCheck = useCallback((locKey) => {
    const targetLoc = LOCATIONS[locKey];
    if (!targetLoc) return;

    setLocatingBridgeName(targetLoc.name);
    setIsLocating(true);

    setTimeout(() => {
      setCurrentLocation(targetLoc);
      setIsLocating(false);
      setStep('river');
      triggerToast(`📍 ${targetLoc.name} 스팟에 접속했습니다.`, 'info');
    }, 1400);
  }, [triggerToast]);

  // 다리 재설정 (인트로로 복귀)
  const resetLocation = useCallback(() => {
    setStep('intro');
  }, []);

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

  // 7. 물결 젓기 (셔플) 기능
  const shuffleStream = useCallback(() => {
    if (isShuffling) return;
    setIsShuffling(true);

    setTimeout(() => {
      setShuffleKey(prev => prev + 1);
      setIsShuffling(false);
      triggerToast('🌊 물결을 저어 새로운 유리병들을 건져 올렸습니다.', 'info');
    }, 500);
  }, [isShuffling, triggerToast]);

  // 8. 필터링된 전체 목록 계산 (오늘의 별빛안부 & 주제별 별빛안부 정교 지원)
  const filteredMessages = useMemo(() => {
    let list = [...messages];
    if (filterType === 'weekly-topic') {
      list = list.filter(m => m.isWeeklyTopic);
    } else if (filterType === 'star-greeting') {
      list.sort((a, b) => (b.reacts.cheer || 0) - (a.reacts.cheer || 0));
    } else if (filterType === 'my-bridge' && currentLocation) {
      list = list.filter(m => m.locationName === currentLocation.name);
    } else if (filterType === 'popular') {
      list.sort((a, b) => (b.reacts.cheer * 2 + b.reacts.heart) - (a.reacts.cheer * 2 + a.reacts.heart));
    }
    // 기본은 최신 등록순
    return list;
  }, [messages, filterType, currentLocation]);

  // 9. 화면에 동시 노출할 엄선된 4~5개 유리병 계산 (강물 뷰)
  const activeStreamBottles = useMemo(() => {
    const list = filteredMessages.length > 0 ? filteredMessages : messages;
    const maxCount = Math.min(5, list.length);
    if (maxCount === 0) return [];

    // shuffleKey에 따라 윈도우 슬라이싱
    const startIndex = (shuffleKey * 4) % list.length;
    const selected = [];

    for (let i = 0; i < maxCount; i++) {
      const item = list[(startIndex + i) % list.length];
      const pos = BOTTLE_POSITIONS[i % BOTTLE_POSITIONS.length];
      selected.push({
        ...item,
        position: { top: pos.top, left: pos.left },
        animationDelay: pos.animationDelay
      });
    }

    return selected;
  }, [filteredMessages, messages, shuffleKey]);

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
        shuffleStream,
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
