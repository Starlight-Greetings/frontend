import { LetterProvider } from './context/LetterContext';
import { useLetter } from './hooks/useLetter';
import RiverBackground from './components/features/RiverBackground';
import Header from './components/common/Header';
import Toast from './components/common/Toast';
import IntroLocationCheck from './pages/IntroLocationCheck';
import RiverView from './pages/RiverView';
import ReadLetterModal from './pages/ReadLetterModal';
import WriteLetterModal from './pages/WriteLetterModal';
import DailyTopGuideModal from './pages/DailyTopGuideModal';
import SurveyPromptModal from './pages/SurveyPromptModal';
import LetterListDrawer from './components/features/LetterListDrawer';

function MainScreen() {
  const { step } = useLetter();

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] text-white overflow-hidden flex flex-col relative font-sans select-none shadow-2xl bg-slate-950">
      {/* 1. 도림천 야경 & 물결 배경 레이어 */}
      <RiverBackground />

      {/* 2. 전역 토스트 알림 */}
      <Toast />

      {/* 3. 어제 일간 1위 온기 편지 가이드 튜토리얼 (일일 첫 접속자 필독) */}
      <DailyTopGuideModal />

      {/* 4. 편지 작성 후 최초 1회만 제공되는 설문조사 안내 모달 */}
      <SurveyPromptModal />

      {/* 4. 헤더 (타이틀 & 다리 스팟 인디케이터 & 1위 가이드) */}
      <Header />

      {/* 5. 메인 컨텐츠 영역 */}
      <main className="flex-1 relative z-10 flex flex-col overflow-hidden">
        {step === 'intro' ? (
          <IntroLocationCheck />
        ) : (
          <>
            {/* 기본 강물 뷰 */}
            <RiverView />

            {/* 편지 읽기 모달 */}
            {step === 'read' && <ReadLetterModal />}

            {/* 편지 쓰기 모달 */}
            {step === 'write' && <WriteLetterModal />}

            {/* 전체 편지 서랍장 (바텀시트) */}
            <LetterListDrawer />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LetterProvider>
      <MainScreen />
    </LetterProvider>
  );
}