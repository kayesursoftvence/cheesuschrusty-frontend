/**
 * Google Translate API utility
 * Translates text content using Google Translate API
 * ONLY supports English (en) and Italian (it)
 */

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const FALLBACK_API_URL = 'https://api.mymemory.translated.net/get';

// Language code mapping - ONLY English and Italian
const LANGUAGE_CODES: Record<string, string> = {
  en: 'en',
  it: 'it',
};

/**
 * Validate language code - only allows English (en) or Italian (it)
 */
function validateLanguage(lang: string): string {
  if (lang === 'en' || lang === 'it') {
    return lang;
  }
  return 'en'; // Default to English if invalid
}

/**
 * Translate text using Google Translate API
 */
export async function translateText(
  text: string,
  targetLang: string = 'it',
  sourceLang: string = 'en'
): Promise<string> {
  if (!text || text.trim() === '') return text;
  
  const validTargetLang = validateLanguage(targetLang);
  const validSourceLang = validateLanguage(sourceLang);
  
  if (validTargetLang === validSourceLang) return text;

  if (!API_KEY) {
    return translateTextFallback(text, validTargetLang, validSourceLang);
  }

  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_URL}?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: LANGUAGE_CODES[validTargetLang] || validTargetLang,
          source: LANGUAGE_CODES[validSourceLang] || validSourceLang,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText;
    
    if (translatedText) {
      return translatedText;
    }
    
    throw new Error('No translation returned from API');
  } catch (error) {
    console.error('Google Translate API error:', error);
    return translateTextFallback(text, validTargetLang, validSourceLang);
  }
}

/**
 * Fallback translation using MyMemory API
 */
async function translateTextFallback(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  try {
    const response = await fetch(
      `${FALLBACK_API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error('Fallback translation error:', error);
    return text;
  }
}

/**
 * Translate all text content on the page - translates the whole website
 */
export async function translatePage(
  targetLang: string = 'it',
  sourceLang: string = 'en'
): Promise<void> {
  const validTargetLang = validateLanguage(targetLang);
  const validSourceLang = validateLanguage(sourceLang);
  
  if (validTargetLang === validSourceLang) return;

  // Get ALL text elements on the entire page
  const selectors = [
    'p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'button', 'label', 'li', 'td', 'th', 'dd', 'dt',
    'input[placeholder]', 'textarea[placeholder]', 'select option',
    '[title]', '[aria-label]', 'figcaption', 'caption', 'strong', 'em', 'b', 'i',
    'small', 'sub', 'sup', 'mark', 'del', 'ins'
  ].join(', ');

  const textElements = document.querySelectorAll(selectors);
  const translatePromises: Promise<void>[] = [];
  const processedTexts = new Set<string>();

  const shouldTranslate = (element: Element): boolean => {
    if (element.hasAttribute('data-no-translate')) return false;
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      const parent = element.parentElement;
      if (!parent || window.getComputedStyle(parent).display === 'none') {
        return false;
      }
    }
    
    return true;
  };

  textElements.forEach((element) => {
    if (!shouldTranslate(element)) return;

    // Handle input/textarea placeholders
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element.placeholder) {
        const placeholder = element.placeholder.trim();
        if (placeholder && placeholder.length > 0 && !processedTexts.has(placeholder)) {
          processedTexts.add(placeholder);
          translatePromises.push(
            translateText(placeholder, validTargetLang, validSourceLang).then((translated) => {
              if (element.placeholder === placeholder) {
                element.placeholder = translated;
              }
            })
          );
        }
      }
      return;
    }

    // Handle select options
    if (element instanceof HTMLOptionElement) {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 200 && !processedTexts.has(text)) {
        processedTexts.add(text);
        translatePromises.push(
          translateText(text, validTargetLang, validSourceLang).then((translated) => {
            if (element.textContent?.trim() === text) {
              element.textContent = translated;
            }
          })
        );
      }
      return;
    }

    // Handle title and aria-label attributes
    ['title', 'aria-label'].forEach((attr) => {
      if (element.hasAttribute(attr)) {
        const attrValue = element.getAttribute(attr);
        if (attrValue && attrValue.trim().length > 0 && attrValue.length < 200 && !processedTexts.has(attrValue)) {
          processedTexts.add(attrValue);
          translatePromises.push(
            translateText(attrValue, validTargetLang, validSourceLang).then((translated) => {
              if (element.getAttribute(attr) === attrValue) {
                element.setAttribute(attr, translated);
              }
            })
          );
        }
      }
    });

    // Handle text content - preserve all styles, only change text
    const hasTextChildren = Array.from(element.children).some(
      (child) => {
        const childText = child.textContent?.trim();
        return childText && childText.length > 0;
      }
    );

    if (!hasTextChildren || (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE)) {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 500) {
        if (text.length < 2 && /^[^a-zA-ZÀ-ÿ]/.test(text)) return;
        
        if (processedTexts.has(text)) return;

        // Skip URLs, emails, and special patterns
        if (/^(https?:\/\/|www\.|mailto:|#)/.test(text)) return;
        if (/^\d+$/.test(text) && text.length < 10) return;

        processedTexts.add(text);
        translatePromises.push(
          translateText(text, validTargetLang, validSourceLang).then((translated) => {
            if (element.textContent?.trim() === text) {
              // Store ALL computed styles BEFORE translation to preserve them exactly
              const computedStyle = window.getComputedStyle(element);
              const originalStyles = {
                fontSize: computedStyle.fontSize,
                fontFamily: computedStyle.fontFamily,
                fontWeight: computedStyle.fontWeight,
                fontStyle: computedStyle.fontStyle,
                color: computedStyle.color,
                lineHeight: computedStyle.lineHeight,
                letterSpacing: computedStyle.letterSpacing,
                textTransform: computedStyle.textTransform,
              };
              
              // Only change text content - nothing else
              element.textContent = translated;
              
              // Immediately restore original styles to prevent any CSS changes
              if (element instanceof HTMLElement) {
                // Use requestAnimationFrame to ensure styles are applied after text change
                requestAnimationFrame(() => {
                  const currentStyle = window.getComputedStyle(element);
                  // Only apply if style actually changed (to avoid unnecessary inline styles)
                  if (currentStyle.fontSize !== originalStyles.fontSize) {
                    element.style.fontSize = originalStyles.fontSize;
                  }
                  if (currentStyle.fontFamily !== originalStyles.fontFamily) {
                    element.style.fontFamily = originalStyles.fontFamily;
                  }
                  if (currentStyle.fontWeight !== originalStyles.fontWeight) {
                    element.style.fontWeight = originalStyles.fontWeight;
                  }
                  if (currentStyle.color !== originalStyles.color) {
                    element.style.color = originalStyles.color;
                  }
                });
              }
            }
          })
        );
      }
    }
  });

  // Process translations in batches
  const batchSize = 15;
  for (let i = 0; i < translatePromises.length; i += batchSize) {
    const batch = translatePromises.slice(i, i + batchSize);
    await Promise.all(batch);
    if (i + batchSize < translatePromises.length) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Retry for dynamically added content - preserve all styles
  setTimeout(() => {
    const remainingElements = document.querySelectorAll(selectors);
    remainingElements.forEach((element) => {
      if (!shouldTranslate(element)) return;
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 500 && !processedTexts.has(text)) {
        translateText(text, validTargetLang, validSourceLang).then((translated) => {
          if (element.textContent?.trim() === text) {
            // Store computed styles BEFORE translation
            const computedStyle = window.getComputedStyle(element);
            const originalStyles = {
              fontSize: computedStyle.fontSize,
              fontFamily: computedStyle.fontFamily,
              fontWeight: computedStyle.fontWeight,
              color: computedStyle.color,
            };
            
            // Only change text content
            element.textContent = translated;
            
            // Restore original styles if they changed
            if (element instanceof HTMLElement) {
              requestAnimationFrame(() => {
                const currentStyle = window.getComputedStyle(element);
                if (currentStyle.fontSize !== originalStyles.fontSize) {
                  element.style.fontSize = originalStyles.fontSize;
                }
                if (currentStyle.fontFamily !== originalStyles.fontFamily) {
                  element.style.fontFamily = originalStyles.fontFamily;
                }
                if (currentStyle.fontWeight !== originalStyles.fontWeight) {
                  element.style.fontWeight = originalStyles.fontWeight;
                }
                if (currentStyle.color !== originalStyles.color) {
                  element.style.color = originalStyles.color;
                }
              });
            }
          }
        }).catch(() => {});
      }
    });
  }, 500);
}

