// src/utils/translationService.ts

const GOOGLE_TRANSLATE_API_KEY = process.env.VITE_GOOGLE_TRANSLATE_API_KEY || 'ec9d043fabd8de53bafc0883dd237ad7a31d0a9f';
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export const translateText = async (
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> => {
  if (!text || targetLang === sourceLang) {
    return text;
  }

  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

export const translateMultiple = async (
  texts: string[],
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string[]> => {
  if (targetLang === sourceLang) {
    return texts;
  }

  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations.map((t: TranslationResponse) => t.translatedText);
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts on error
  }
};