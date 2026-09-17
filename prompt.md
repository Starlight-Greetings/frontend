# 프로젝트 개요: 도림천 병편지 (별빛내린천 디지털 타임캡슐)
- 슬로건: "도림천을 걷는 너에게, 어제의 내가 띄우는 한 줄 위로"
- 기획 의도: 관악구 도림천(별빛내린천)을 걷는 청년/1인가구 산책러들을 위한 위치 기반 익명 롤링페이퍼. 피로감 없는 느슨한 정서적 연대를 지향함.
- 핵심 특징: 앱 설치나 회원가입 없이 스팟(다리)의 QR 코드로 접속해 모바일 웹으로 즉시 이용.

# 기술 스택
- React (Vite)
- Tailwind CSS (v4)
- 모바일 웹뷰(App-like UX) 환경을 타겟팅

# 개발 및 리팩토링 요구사항
현재 코드는 하나의 파일(App.jsx)에 모든 로직과 UI가 섞여 있어 부실합니다. 다음 지침에 따라 프론트엔드 아키텍처를 세부적으로 꼼꼼하게 설계하고 코드를 작성해주세요.

1. **컴포넌트 분리 (Componentization)**
   - 화면 및 기능별로 폴더 구조를 나누고 컴포넌트를 분리하세요.
   - 예시: `components/layout/Header.jsx`, `components/features/RiverBackground.jsx`, `components/features/BottleItem.jsx`, `pages/IntroLocationCheck.jsx`, `pages/RiverView.jsx` 등.

2. **UI/UX 디테일 고도화 (Glassmorphism & App-like)**
   - 모바일 환경에 맞게 최상위 컨테이너에 `max-w-md`, `h-screen`, `overflow-hidden`을 적용하여 브라우저의 기본 스크롤을 방지하고 네이티브 앱처럼 동작하게 하세요.
   - `public/image_e57129.jpg`를 전체 배경 이미지로 사용하고, 텍스트 가독성을 위해 어두운 그라데이션 오버레이(Glassmorphism)를 정교하게 적용하세요.
   - 이모지(🍾, ❤️, ✨) 대신 가급적 SVG 아이콘(Lucide React 등)을 활용해 UI를 더 세련되게 다듬거나, 이모지를 쓰더라도 애니메이션(둥둥 떠다니는 물결 효과, hover 시 glow 효과)을 부드럽게 적용하세요.

3. **상태 관리 및 플로우 제어**
   - 현재 단계(intro -> river -> read -> write)를 제어하는 상태 관리 로직을 깔끔하게 커스텀 훅(Custom Hook)이나 Context API로 분리해 유지보수성을 높이세요.
   - 150자 글자 수 제한, 금칙어 필터링 안내 문구 등 입력 폼(textarea)의 UI 상태(Focus, Error, Validation)를 디테일하게 구현하세요.

4. **사용자 인터랙션 강화**
   - QR 인증 시 로딩 스피너, 편지를 물에 띄울 때의 부드러운 페이드아웃 애니메이션 등 화면 전환 시의 트랜지션을 추가하세요.