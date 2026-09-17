import { useContext } from 'react';
import { LetterContext } from '../context/createLetterContext';

export function useLetter() {
  const context = useContext(LetterContext);
  if (!context) {
    throw new Error('useLetter must be used within a LetterProvider');
  }
  return context;
}
