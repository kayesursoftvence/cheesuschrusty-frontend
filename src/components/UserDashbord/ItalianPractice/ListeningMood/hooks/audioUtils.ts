/* eslint-disable @typescript-eslint/no-explicit-any */
import { ListeningContent, QuestionSetData } from '../types';

/**
 * Extract text to convert to audio from listening data
 */
export function getTextToConvert(
  listeningData: QuestionSetData | null,
  questions: any[],
  currentQuestionIndex: number,
  showQuestionList: boolean
): string {


  console.log(listeningData)
  console.log(questions)
  console.log(currentQuestionIndex)
  console.log(showQuestionList)


  if (!listeningData?.content) {
    console.warn("[Dubbing] getTextToConvert: No listening data content found");
    return '';
  }
  
  const content = listeningData.content as ListeningContent;
  const teacherPack = content.teacher_pack;
  const script = teacherPack?.content?.dialogues || teacherPack?.content || teacherPack?.SCRIPT || teacherPack?.['CONTENT/SCRIPT'];
  
  console.log("[Dubbing] Raw script data:", script);

  const extractText = (item: any): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && item.script) return item.script;
    return '';
  };

  let text = "";
  if (!showQuestionList && questions[currentQuestionIndex]) {
    // console.log("[Dubbing] getTextToConvert: Individual question mode, index:", currentQuestionIndex);
    if (Array.isArray(script) && script[currentQuestionIndex]) {
      text = extractText(script[currentQuestionIndex]);
    }
  } else {
    // console.log("[Dubbing] getTextToConvert: Full script mode");
    if (Array.isArray(script)) {
      text = script.map(extractText).filter(Boolean).join(' ');
    } else {
      text = extractText(script);
    }
  }

  console.log("[Dubbing] getTextToConvert: Resulting text length:", text.length, text.substring(0, 50) + "...");
  return text;
}




// Function that takes only dialogues array as parameter
export interface Dialogue {
  id?: number;
  title?: string;
  script?: string;
}

export function getConvertableText(dialogues: Dialogue[] | null | undefined): string | null {
  // Check if dialogues exist and is a non-empty array
  if (!Array.isArray(dialogues) || dialogues.length === 0) {
    return null;
  }

  let resultText = '';
  let count = 0;

  dialogues.forEach((dialogue, index) => {
    if (!dialogue || typeof dialogue !== 'object') return;

    const { title, script } = dialogue;

    if (typeof script === 'string' && script.trim() !== '') {
      const dialogueText = script.trim();

      if (title && title.trim() !== '') {
        resultText += `${title.trim()}:\n${dialogueText}`;
      } else {
        resultText += dialogueText;
      }

      count++;

      // Add double line breaks between dialogues (except after the last one)
      if (index < dialogues.length - 1) {
        resultText += '\n\n';
      }
    }
  });

  return count > 0 ? resultText : null;
}

// Alternative: More robust version with better title handling
export interface NormalizedDialogue {
  id: number;
  title?: string;
  script: string;
}

export function getDialoguesText(dialogues: NormalizedDialogue[] | null | undefined): string | null {
  if (!Array.isArray(dialogues) || dialogues.length === 0) {
    return null;
  }

  let combinedScript = '';
  let hasContent = false;

  dialogues.forEach((item, index) => {
    if (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'script' in item &&
      typeof item.script === 'string' &&
      item.script.trim() !== ''
    ) {
      const scriptText = item.script.trim();
      let titleText = '';

      if ('title' in item && item.title && item.title.trim() !== '') {
        titleText = item.title.trim() + ':\n';
      }

      combinedScript += titleText + scriptText;
      hasContent = true;

      // Add double line break between dialogues except last
      if (index < dialogues.length - 1) {
        combinedScript += '\n\n';
      }
    }
  });

  return hasContent ? combinedScript : null;
}
