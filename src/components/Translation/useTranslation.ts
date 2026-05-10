// src/hooks/useTranslation.ts

import { useState, useEffect } from 'react';
import { translateText } from './translationService';

export const useTranslation = (text: string, targetLang: string, sourceLang: string = 'en') => {
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text || targetLang === sourceLang) {
      setTranslated(text);
      return;
    }

    setLoading(true);
    translateText(text, targetLang, sourceLang)
      .then((result) => {
        setTranslated(result);
        setLoading(false);
      })
      .catch(() => {
        setTranslated(text); // Fallback to original
        setLoading(false);
      });
  }, [text, targetLang, sourceLang]);

  return { translated, loading };
};