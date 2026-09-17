/**
 * 한국 표준시(KST: UTC+9) 기준 날짜 및 타이머 유틸리티
 */

// KST Date 객체 가져오기
export function getKSTDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (9 * 60 * 60 * 1000));
}

// YYYY-MM-DD 형식 KST 날짜 문자열
export function getKSTDateString() {
  const kst = getKSTDate();
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 포맷팅된 KST 날짜 문자열 (예: 2026년 9월 17일)
export function getFormattedKSTDate() {
  const kst = getKSTDate();
  const year = kst.getFullYear();
  const month = kst.getMonth() + 1;
  const day = kst.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

// 어제 KST 포맷팅 문자열 (예: 9월 16일 어제 기준)
export function getFormattedKSTYesterdayDate() {
  const kst = getKSTDate();
  const yesterday = new Date(kst.getFullYear(), kst.getMonth(), kst.getDate() - 1);
  const month = yesterday.getMonth() + 1;
  const day = yesterday.getDate();
  return `${month}월 ${day}일`;
}

// 다음 00:00 KST 갱신까지 남은 시간 계산 (시:분:초)
export function getTimeUntilKSTMidnight() {
  const kst = getKSTDate();
  const tomorrowKST = new Date(kst.getFullYear(), kst.getMonth(), kst.getDate() + 1, 0, 0, 0);
  const diffMs = tomorrowKST.getTime() - kst.getTime();

  if (diffMs <= 0) return { hours: 0, minutes: 0, seconds: 0 };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// 일일 가이드 확인 여부 체크 (KST 날짜 기준)
export function isDailyTopGuideSeenToday() {
  try {
    const savedDate = localStorage.getItem('dorimcheon_daily_top_guide_seen_date');
    return savedDate === getKSTDateString();
  } catch (e) {
    return false;
  }
}

// 일일 가이드 확인 완료 저장 (KST 날짜 기준)
export function markDailyTopGuideSeenToday() {
  try {
    localStorage.setItem('dorimcheon_daily_top_guide_seen_date', getKSTDateString());
  } catch (e) {
    console.error('Failed to save guide seen status to localStorage', e);
  }
}
