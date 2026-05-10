// SingleTranslateButton.tsx - COPY THIS ENTIRE FILE
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define languages
type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh' | 'ru' | 'ar' | 'hi';

interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

// All available languages
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
 
  
];

const SingleTranslateButton: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);

  // API Key - PUT YOUR KEY HERE
  const API_KEY = 'ec9d043fabd8de53bafc0883dd237ad7a31d0a9f';

  // Load saved language on startup
  useEffect(() => {
    const savedLang = localStorage.getItem('website_language') as LanguageCode;
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      setCurrentLanguage(savedLang);
      if (savedLang !== 'en') {
        // Auto-translate if saved language is not English
        setTimeout(() => translatePage(), 1000);
      }
    }
  }, []);

  // Function to translate text using Google API
  const translateText = async (text: string, targetLang: LanguageCode): Promise<string> => {
    if (!text.trim() || targetLang === 'en') return text;
    
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        {
          q: text,
          target: targetLang,
          format: 'text',
        },
        {
          params: { key: API_KEY },
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Function to translate a single HTML element
  const translateElement = async (element: HTMLElement): Promise<void> => {
    // Skip if element should not be translated
    if (element.hasAttribute('data-no-translate')) return;

    // Translate text content
    if (element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE) {
      const originalText = element.textContent?.trim() || '';
      if (originalText.length > 1) {
        try {
          const translated = await translateText(originalText, currentLanguage);
          element.textContent = element.textContent?.replace(originalText, translated) || '';
        } catch {
          // Silently fail
        }
      }
    }

    // Translate input placeholders and button text
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder && placeholder.trim()) {
        const translated = await translateText(placeholder, currentLanguage);
        element.setAttribute('placeholder', translated);
      }
    }

    if (element instanceof HTMLButtonElement && element.textContent?.trim()) {
      const buttonText = element.textContent.trim();
      if (buttonText.length > 1) {
        const translated = await translateText(buttonText, currentLanguage);
        element.textContent = element.textContent.replace(buttonText, translated);
      }
    }

    // Translate alt text for images
    if (element instanceof HTMLImageElement) {
      const alt = element.getAttribute('alt');
      if (alt && alt.trim()) {
        const translated = await translateText(alt, currentLanguage);
        element.setAttribute('alt', translated);
      }
    }

    // Translate title attributes
    const title = element.getAttribute('title');
    if (title && title.trim()) {
      const translated = await translateText(title, currentLanguage);
      element.setAttribute('title', translated);
    }

    // Recursively translate children
    const children = Array.from(element.children) as HTMLElement[];
    for (const child of children) {
      await translateElement(child);
    }
  };

  // Main function to translate entire page
  const translatePage = async (): Promise<void> => {
    if (currentLanguage === 'en') {
      // If switching back to English, reload page
      window.location.reload();
      return;
    }

    setIsTranslating(true);

    try {
      // Get all elements that might contain text
      const textElements = Array.from(document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, label, figcaption, blockquote, cite, a:not([data-no-translate])'
      )) as HTMLElement[];

      // Also get form elements
      const formElements = Array.from(document.querySelectorAll(
        'input, textarea, button, select, option'
      )) as HTMLElement[];

      const allElements = [...textElements, ...formElements];

      // Filter out elements inside excluded parents
      const elementsToTranslate = allElements.filter(el => {
        let parent = el.parentElement;
        while (parent) {
          if (parent.hasAttribute('data-no-translate')) return false;
          parent = parent.parentElement;
        }
        return true;
      });

      // Remove duplicates
      const uniqueElements = Array.from(new Set(elementsToTranslate));

      // Translate in batches of 5 to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < uniqueElements.length; i += batchSize) {
        const batch = uniqueElements.slice(i, i + batchSize);
        await Promise.all(batch.map(el => translateElement(el)));
        
        // Small delay between batches
        if (i + batchSize < uniqueElements.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Translate page title
      if (document.title) {
        const translatedTitle = await translateText(document.title, currentLanguage);
        document.title = translatedTitle;
      }

      // Translate meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const content = metaDescription.getAttribute('content');
        if (content) {
          const translated = await translateText(content, currentLanguage);
          metaDescription.setAttribute('content', translated);
        }
      }

      console.log(`🌐 Website translated to ${currentLanguage}!`);

    } catch {
      console.error('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Change language and auto-translate if enabled
  const handleLanguageChange = async (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('website_language', lang);
    setIsMenuOpen(false);

    if (isAutoMode && lang !== 'en') {
      await translatePage();
    }
  };

  // Toggle translation mode
  const toggleTranslationMode = () => {
    setIsAutoMode(!isAutoMode);
  };

  // Get current language object
  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage);

  // If in English and auto-mode is on, show simple button
  if (currentLanguage === 'en' && isAutoMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>Translate</span>
        </button>

        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <div className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Select Language</h3>
                  <button
                    onClick={toggleTranslationMode}
                    className={`px-3 py-1 text-sm rounded-full ${isAutoMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {isAutoMode ? 'Auto' : 'Manual'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {isAutoMode 
                    ? 'Page will auto-translate when you select a language'
                    : 'Click "Translate Now" after selecting language'}
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {LANGUAGES.filter(lang => lang.code !== 'en').map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors mb-1"
                  >
                    <span className="text-2xl mr-3">{language.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-800">{language.nativeName}</div>
                      <div className="text-sm text-gray-500">{language.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // If not in English, show current language with translate button
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-2">
        {!isAutoMode && currentLanguage !== 'en' && (
          <button
            onClick={translatePage}
            disabled={isTranslating}
            className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl disabled:opacity-70 transition-all"
          >
            {isTranslating ? 'Translating...' : 'Translate Now'}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isTranslating}
            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70"
          >
            {isTranslating ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">{currentLang?.flag}</span>
                <span>{currentLang?.nativeName}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              <div className="absolute right-0 bottom-full mb-3 w-72 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">Change Language</h3>
                    <button
                      onClick={toggleTranslationMode}
                      className={`px-3 py-1 text-sm rounded-full ${isAutoMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {isAutoMode ? 'Auto' : 'Manual'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Current: {currentLang?.nativeName}
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto p-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center w-full p-3 rounded-lg mb-1 transition-colors ${
                        currentLanguage === language.code
                          ? 'bg-blue-100 border border-blue-200'
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-2xl mr-3">{language.flag}</span>
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${
                          currentLanguage === language.code ? 'text-blue-700' : 'text-gray-800'
                        }`}>
                          {language.nativeName}
                        </div>
                        <div className="text-sm text-gray-500">{language.name}</div>
                      </div>
                      {currentLanguage === language.code && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      handleLanguageChange('en');
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                  >
                    Reset to English
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTranslateButton;