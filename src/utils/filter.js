// 금칙어 및 비방성 키워드 리스트 (산책로의 따뜻한 정서 유지를 위한 필터링)
const FORBIDDEN_WORDS = [
  '바보',
  '멍청이',
  '병신',
  '씨발',
  '시발',
  '개새끼',
  '존나',
  '죽어',
  '꺼져',
  '미친',
  '새끼',
  '쓰레기',
  '닥쳐',
  '지랄'
];

/**
 * 텍스트 내 금칙어 포함 여부 검사
 * @param {string} text 
 * @returns {{ isValid: boolean, matchedWord: string | null, errorMsg: string | null }}
 */
export function validateLetterContent(text) {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      matchedWord: null,
      errorMsg: '내용을 한 글자 이상 작성해주세요.'
    };
  }

  const cleanText = text.replace(/\s+/g, '');
  for (const word of FORBIDDEN_WORDS) {
    if (text.includes(word) || cleanText.includes(word)) {
      return {
        isValid: false,
        matchedWord: word,
        errorMsg: `따뜻한 위로의 공간입니다. 부적절한 단어('${word}')가 포함되어 있어요.`
      };
    }
  }

  if (text.length > 150) {
    return {
      isValid: false,
      matchedWord: null,
      errorMsg: '최대 150자까지 작성할 수 있습니다.'
    };
  }

  return {
    isValid: true,
    matchedWord: null,
    errorMsg: null
  };
}
