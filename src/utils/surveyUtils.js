/**
 * 도림천 네이버 폼 설문조사 유틸리티
 */

export const NAVER_SURVEY_URL = 'https://naver.me/xfboPA29';

// 설문조사 안내팝업 노출 여부 체크 (사용자당 단 1회만 노출)
export function isSurveyAsked() {
  try {
    return localStorage.getItem('dorimcheon_survey_asked') === 'true';
  } catch (e) {
    return false;
  }
}

// 설문조사 안내 완료 저장
export function markSurveyAsked() {
  try {
    localStorage.setItem('dorimcheon_survey_asked', 'true');
  } catch (e) {
    console.error('Failed to save survey status', e);
  }
}

// 네이버 폼 새 창으로 열기
export function openSurveyForm() {
  window.open(NAVER_SURVEY_URL, '_blank', 'noopener,noreferrer');
}
