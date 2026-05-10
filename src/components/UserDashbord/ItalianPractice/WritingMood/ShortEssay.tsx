import React, { useState } from 'react';
import { CheckCircle, FileText, Loader2 } from 'lucide-react';
import { ShortEssayApiResponse } from './types';

interface ShortEssayProps {
  exercise: ShortEssayApiResponse;
  prompt?: string;
  onSubmit: (answer: string, score: number) => void;
  showTranslation?: boolean;
}

const ShortEssay: React.FC<ShortEssayProps> = ({ 
  exercise, 
  prompt, 
  onSubmit,
  showTranslation = false 
}) => {
  const [essay, setEssay] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isItalian, setIsItalian] = useState<boolean | null>(null);
  const [isDummyData, setIsDummyData] = useState<boolean>(false);

  const wordCount = essay.trim() === '' ? 0 : essay.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 120;
  const maxWords = 150;

  // Detect dummy data patterns (comma-separated random characters)
  const detectDummyData = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;
    
    // Split by commas
    const segments = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    // Need at least 3 segments to be considered dummy data
    if (segments.length < 3) return false;
    
    // Check if segments look like random/dummy data
    let dummySegmentCount = 0;
    
    for (const segment of segments) {
      // Remove any trailing punctuation
      const cleanSegment = segment.replace(/[.,!?;:()[\]{}'"]+$/, '');
      
      // Check if segment looks like dummy data:
      // 1. No spaces (random characters usually don't have spaces)
      // 2. Mostly consonants or repeated characters
      // 3. Very short or very long random strings
      // 4. Contains patterns like "cccccccc", "yyyyyyyyy", "jjjjjjj"
      
      const hasSpaces = /\s/.test(cleanSegment);
      const isRepeatedChars = /^([a-z])\1{3,}$/i.test(cleanSegment); // 4+ repeated chars
      const hasManyConsonants = /^[bcdfghjklmnpqrstvwxyz]{5,}$/i.test(cleanSegment); // 5+ consonants in a row
      const isRandomPattern = /^[a-z]{3,15}$/i.test(cleanSegment) && !hasSpaces && 
                              (cleanSegment.length < 4 || /([a-z])\1{2,}/i.test(cleanSegment) || 
                              /^[bcdfghjklmnpqrstvwxyz]+$/i.test(cleanSegment));
      
      // If it matches dummy data patterns and doesn't look like Italian
      if (!hasSpaces && (isRepeatedChars || hasManyConsonants || isRandomPattern)) {
        // Double check: if it contains Italian characters or looks like a real word, skip
        const hasItalianChars = /[àèéìòù]/.test(cleanSegment);
        const looksLikeWord = /[aeiou]{2,}/i.test(cleanSegment); // Has vowel clusters (more likely real words)
        
        if (!hasItalianChars && !looksLikeWord) {
          dummySegmentCount++;
        }
      }
    }
    
    // If 3 or more segments look like dummy data, return true
    return dummySegmentCount >= 3;
  };

  // Italian language detection function
  const isItalianText = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;
    
    const trimmedText = text.trim().toLowerCase();
    
    // Common Italian characters (accented vowels)
    const italianChars = /[àèéìòù]/;
    
    // Common Italian words/articles/pronouns
    const commonItalianWords = [
      'il', 'la', 'lo', 'gli', 'le', 'un', 'una', 'uno', 'dei', 'delle', 'degli',
      'sono', 'è', 'sei', 'siamo', 'siete', 'sono',
      'ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno',
      'mio', 'mia', 'miei', 'mie', 'tuo', 'tua', 'tuoi', 'tue',
      'suo', 'sua', 'suoi', 'sue', 'nostro', 'nostra', 'nostri', 'nostre',
      'vostro', 'vostra', 'vostri', 'vostre', 'loro',
      'che', 'chi', 'cosa', 'come', 'dove', 'quando', 'perché',
      'e', 'o', 'ma', 'però', 'anche', 'pure', 'solo', 'soltanto',
      'molto', 'molta', 'molti', 'molte', 'poco', 'poca', 'pochi', 'poche',
      'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'quelli', 'quelle',
      'in', 'di', 'a', 'da', 'con', 'su', 'per', 'tra', 'fra',
      'famiglia', 'madre', 'padre', 'fratello', 'sorella', 'nonno', 'nonna',
      'zio', 'zia', 'cugino', 'cugina', 'figlio', 'figlia', 'genitori',
      'alto', 'alta', 'basso', 'bassa', 'simpatico', 'simpatica', 'gentile',
      'vivere', 'abitare', 'lavorare', 'studiare', 'amare', 'piacere'
    ];
    
    // Check for Italian characters
    const hasItalianChars = italianChars.test(trimmedText);
    
    // Check for common Italian words (need at least 3 matches for short text, more for longer)
    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    const italianWordMatches = words.filter(word => {
      // Remove punctuation for matching
      const cleanWord = word.replace(/[.,!?;:()[\]{}'"]/g, '');
      return commonItalianWords.includes(cleanWord);
    }).length;
    
    // Check for Italian-specific patterns
    // Italian articles before nouns (il/la/lo + noun)
    const articlePattern = /\b(il|la|lo|gli|le|un|una|uno)\s+[a-zàèéìòù]+/i;
    const hasArticlePattern = articlePattern.test(trimmedText);
    
    // Italian verb endings (are, ere, ire)
    const verbEndingPattern = /\b[a-zàèéìòù]+(are|ere|ire|ato|ato|ito|endo|ando)\b/i;
    const hasVerbEndings = verbEndingPattern.test(trimmedText);
    
    // Calculate Italian indicators
    const minWordsForValidation = Math.min(10, words.length);
    const requiredMatches = Math.max(2, Math.floor(minWordsForValidation * 0.2)); // At least 20% of words should be Italian
    
    // If text is very short, be more lenient
    if (words.length < 5) {
      return hasItalianChars || italianWordMatches >= 1 || hasArticlePattern;
    }
    
    // For longer text, require more indicators
    const indicators = [
      hasItalianChars,
      italianWordMatches >= requiredMatches,
      hasArticlePattern,
      hasVerbEndings
    ];
    
    // Need at least 2 indicators for longer text
    const indicatorCount = indicators.filter(Boolean).length;
    return indicatorCount >= 2 || (hasItalianChars && italianWordMatches >= 1);
  };

  const calculateScore = () => {
    // First check if text is dummy data
    // if (detectDummyData(essay)) {
    //   return 0; // Return 0 if text is dummy data
    // }
    
    // Then check if text is Italian
    if (!isItalianText(essay)) {
      return 0; // Return 0 if text is not Italian
    }
    
    let baseScore = 70;
    
    if (wordCount >= minWords && wordCount <= maxWords) {
      baseScore += 20;
    } else if (wordCount >= minWords - 20 && wordCount < minWords) {
      baseScore += 10;
    } else if (wordCount > maxWords) {
      baseScore += 15;
    } else {
      baseScore += 5;
    }
    
    const variation = Math.floor(Math.random() * 21) - 10;
    return Math.min(100, Math.max(40, baseScore + variation));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    try {
      // Call onSubmit which will trigger AI evaluation
      await Promise.resolve(onSubmit(essay, calculatedScore));
    } catch (error) {
      console.error("Error submitting essay:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTips = () => {
    if (!exercise.tips) return [];
    
    return exercise.tips.map(tip => 
      showTranslation ? tip.english_tip : tip.italian_tip
    );
  };

  const tips = getTips();

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Short Essay
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {prompt || 'Write a short essay on the given topic'}
        </p>
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Currently viewing tips in: <span className="font-medium">
            {showTranslation ? "English" : "Italian"}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Writing Task
          </h3>
          
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
              <p className="text-lg text-gray-900 dark:text-white mb-2">
                <strong>Topic:</strong> Write a short essay based on the prompt
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {exercise.prompt}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Minimum Words</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{minWords}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maximum Words</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{maxWords}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 px-3 py-2 mb-2 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <span>{showTips ? '▼' : '▶'}</span>
                {showTips ? 'Hide Writing Tips' : 'Show Writing Tips'}
              </button>
              
              {showTips && tips.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Writing Tips ({showTranslation ? 'English' : 'Italian'}):
                  </h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Essay (Write in Italian):
              </label>
              <span className={`text-sm ${
                wordCount < minWords ? 'text-red-600 dark:text-red-400' :
                wordCount > maxWords ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {wordCount} words
              </span>
            </div>
            
            <textarea
              value={essay}
              onChange={(e) => {
                const newValue = e.target.value;
                setEssay(newValue);
                // Check for dummy data and Italian (only if there's enough text)
                if (newValue.trim().length >= 10) {
                  const isDummy = detectDummyData(newValue);
                  setIsDummyData(isDummy);
                  if (!isDummy) {
                    setIsItalian(isItalianText(newValue));
                  } else {
                    setIsItalian(false);
                  }
                } else {
                  setIsDummyData(false);
                  setIsItalian(null);
                }
              }}
              placeholder="Write your essay in Italian here. Try to write between 120-150 words..."
              rows={8}
              disabled={isSubmitted || isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none resize-y transition-all duration-200 ${
                isSubmitted
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                  : (isDummyData || (isItalian === false && essay.trim().length >= 10))
                  ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              }`}
            />
            
            {/* Dummy data error */}
            {isDummyData && essay.trim().length >= 10 && !isSubmitted && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  ❌ Error: Dummy data detected (random characters separated by commas). Please write a proper essay in Italian. Dummy data will receive a score of 0.
                </p>
              </div>
            )}
            
            {/* Italian language validation warning */}
            {!isDummyData && isItalian === false && essay.trim().length >= 10 && !isSubmitted && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Warning: The text does not appear to be in Italian. Please write your essay in Italian. Non-Italian text will receive a score of 0.
                </p>
              </div>
            )}
            
            {!isDummyData && isItalian === true && essay.trim().length >= 10 && !isSubmitted && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Text appears to be in Italian
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Minimum: {minWords} words</span>
              <span>Maximum: {maxWords} words</span>
            </div>
            
            {wordCount > 0 && (
              <div className={`text-sm p-3 rounded-lg ${
                wordCount < minWords
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : wordCount > maxWords
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}>
                {wordCount < minWords
                  ? `${minWords - wordCount} more ${minWords - wordCount === 1 ? 'word' : 'words'} needed to reach the minimum`
                  : wordCount > maxWords
                  ? `${wordCount - maxWords} ${wordCount - maxWords === 1 ? 'word' : 'words'} over the limit`
                  : 'Perfect word count! Your essay is within the required range.'}
              </div>
            )}
          </div>
        </div>

        {score !== null && (
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              {score === 0 ? (
                <span className="text-2xl">❌</span>
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              )}
              <span className={`text-xl font-semibold ${
                score === 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                Score: {score}%
              </span>
            </div>
            
            <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  score === 0
                    ? 'bg-red-500'
                    : 'bg-gradient-to-r from-purple-400 to-pink-500'
                }`}
                style={{ width: `${score === 0 ? 0 : score}%` }}
              ></div>
            </div>
            
            <p className={`mt-3 text-sm ${
              score === 0
                ? 'text-red-600 dark:text-red-400 font-medium'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {score === 0 
                ? isDummyData
                  ? '❌ Score: 0% - Dummy data detected. Please write a proper essay in Italian to receive a score.'
                  : '❌ Score: 0% - The text is not in Italian. Please write your essay in Italian to receive a score.'
                : score >= 90 ? 'Excellent writing skills! 🎉' :
                 score >= 75 ? 'Good job! Your essay is well-written.' :
                 score >= 60 ? 'Not bad. Work on structure and vocabulary.' :
                 'Keep practicing. Focus on essay structure.'}
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!essay.trim() || isSubmitted || isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
              !essay.trim() || isSubmitted || isSubmitting
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Submitting...
              </>
            ) : isSubmitted ? (
              'AI is evaluating your essay...'
            ) : (
              'Submit Essay'
            )}
          </button>
          
          {!essay.trim() && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              Please write your essay before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortEssay;

 