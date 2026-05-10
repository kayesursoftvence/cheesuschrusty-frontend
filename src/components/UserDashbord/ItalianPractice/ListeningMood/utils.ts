/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionSetData, Question, ListeningContent, QuestionOption } from "./types";

export const getOptionLetter = (answerText: string): string => {
  if (!answerText) return '';
  const match = answerText.match(/^([A-D])\./);
  return match ? match[1] : answerText.charAt(0);
};

export const processQuestionsFromData = (data: QuestionSetData): Question[] => {
  console.log("[DataTrace] 6. Entering processQuestionsFromData with data:", data);
  if (!data || !data.content) {
    console.error("[DataTrace] 6a. No data or content found", data);
    return [];
  }
  const content = data.content as ListeningContent;
  console.log("[DataTrace] 7. Extracted content:", content);
  console.log("[DataTrace] 7a. Content keys:", Object.keys(content || {}));
  
  const studentHandout = content.student_handout || content.PART_2_STUDENT_HANDOUT || (content as any).STUDENT_HANDOUT ||(content as any).studentHandout ||  content['PART 2: STUDENT_HANDOUT (PRINTABLE)'] ; 
  console.log("[DataTrace] 8. studentHandout selected:", studentHandout);

  if (!studentHandout) {
    console.error("[DataTrace] 8a. No student handout found in content keys:", Object.keys(content || {}));
    return [];
  }

  // Try multiple locations for questions; accept arrays, maps, or nested content
  let studentQuestions: any = (studentHandout as any).Questions || (studentHandout as any).questions || (studentHandout as any).STU_QUESTIONS || (studentHandout as any).questions_map || (studentHandout as any).Questions_map || (studentHandout as any).question_set || (studentHandout as any).items || (studentHandout as any).content?.questions || (studentHandout as any).content?.Questions || (studentHandout as any).content?.items;

  // If questions are provided as an object map (e.g. {"1": {...}, "2": {...}}), convert to ordered array
  if (studentQuestions && typeof studentQuestions === 'object' && !Array.isArray(studentQuestions)) {
    const keys = Object.keys(studentQuestions);
    // If numeric-like keys, sort numerically
    const numericKeys = keys.every(k => /^\d+$/.test(k));
    if (numericKeys) {
      studentQuestions = keys.sort((a, b) => Number(a) - Number(b)).map(k => studentQuestions[k]);
    } else {
      // Otherwise just take values in insertion order
      studentQuestions = Object.values(studentQuestions);
    }
  }

  // If a single string was provided, wrap it into an array
  if (studentQuestions && typeof studentQuestions === 'string') {
    studentQuestions = [studentQuestions];
  }
  

  const teacherPack = content.teacher_pack || content.PART_1_TEACHER_PACK || (content as any).TEACHER_PACK || content['PART 1: TEACHER_PACK (SECURE)'];

  // teacherKey may be an array or an object map (e.g. {"1": "Correct Answer: A..."})
  // New format: teacher_pack.key.answers is an array with {question_id, correct, rationale}
  const teacherKeyRaw = teacherPack?.key?.answers || teacherPack?.KEY || teacherPack?.answer_key?.KEY || teacherPack?.key || teacherPack?.answer_key || [];
  const teacherKeyIsArray = Array.isArray(teacherKeyRaw);

  console.log("[DataTrace] 9. studentQuestions:", studentQuestions);
  console.log("[DataTrace] 10. teacherPack:", teacherPack);
  console.log("[DataTrace] 11. teacherKeyRaw:", teacherKeyRaw);

  if (!studentQuestions || !Array.isArray(studentQuestions)) {
    console.error("[DataTrace] 8c. No Questions array found in studentHandout keys:", Object.keys(studentHandout || {}));
    return [];
  }

  return studentQuestions.map((studentQ: any, index: number) => {
    // studentQ may be a string (question text) or an object
    // New format uses 'text' field for question text
    const qText = typeof studentQ === 'string' ? studentQ : (studentQ.text || studentQ.Question || studentQ.question || "");

    // Resolve teacher answer value for this question:
    // - If teacherKeyRaw is an array, try to find matching entry by question text
    // - If teacherKeyRaw is an object map keyed by index ("1","2"), try to read by index+1
    // - If values are strings like "Correct Answer: A (...)" use them directly
    let teacherAnswer: any = null;
    if (teacherKeyIsArray) {
      // New format: answers array with {question_id, correct, rationale}
      teacherAnswer = (teacherKeyRaw as any[]).find((item: any) => 
        item.question_id === studentQ.id || 
        item.question_id === (index + 1) ||
        (item.Question || item.question || item.question_text) === qText || 
        String(item).includes(qText)
      );
    } else if (teacherKeyRaw && typeof teacherKeyRaw === 'object') {
      // try by numeric index (1-based)
      const byIndex = teacherKeyRaw[index + 1] || teacherKeyRaw[String(index + 1)];
      if (byIndex !== undefined) teacherAnswer = byIndex;
      // try by dialogue or key if present
      if (!teacherAnswer && studentQ?.__key && teacherKeyRaw[studentQ.__key]) teacherAnswer = teacherKeyRaw[studentQ.__key];
      if (!teacherAnswer) {
        // fallback: search values for a match by question text
        const found = Object.values(teacherKeyRaw).find((v: any) => String(v).includes(qText));
        if (found) teacherAnswer = found;
      }
    }

    // Options may be provided as an array or as an object map {A: 'text', B: 'text'}
    const rawOptions = (typeof studentQ === 'string') ? [] : (studentQ.Options || studentQ.options || studentQ.Options || studentQ.options_map || {});
    let options: QuestionOption[] = [];
    if (Array.isArray(rawOptions)) {
      options = rawOptions.map((option: any) => {
        // Handle case where option is an object
        if (typeof option === 'object' && option !== null) {
          // New format: {text: "...", label: "A"}
          if (option.text !== undefined) {
            return { english: String(option.text || ''), italian: String(option.text || '') };
          }
          // If it has english/italian keys, use them directly
          if (option.english || option.italian) {
            return { english: String(option.english || option.italian || ''), italian: String(option.italian || option.english || '') };
          }
          // If it has letter keys (A, B, C, D), extract the first value
          const keys = Object.keys(option);
          if (keys.length > 0) {
            const value = String(option[keys[0]] || '');
            return { english: value, italian: value };
          }
          return { english: '', italian: '' };
        }
        // Handle string options
        const optStr = String(option);
        const match = optStr.match(/^([A-D])\.\s*(.*)/);
        const text = match ? match[2] : optStr;
        return { english: text, italian: text };
      });
    } else if (rawOptions && typeof rawOptions === 'object') {
      // Convert option map (A/B/C/D) to ordered array
      const ordered = ['A','B','C','D'];
      options = ordered.reduce((acc: QuestionOption[], key) => {
        if (rawOptions[key]) acc.push({ english: String(rawOptions[key]), italian: String(rawOptions[key]) });
        return acc;
      }, []);
    }
    
    let correctAnswer = '';
    // teacherAnswer may be an object or a direct string like "Correct Answer: A (...)"
    // New format: teacherAnswer.correct is the letter (e.g., "A", "B", "C", "D")
    const teacherAnswerText = (typeof teacherAnswer === 'string') 
      ? teacherAnswer 
      : (teacherAnswer?.correct || teacherAnswer?.Answer || teacherAnswer?.answer || teacherAnswer?.correct_answer || studentQ.correct || studentQ.Correct || "");
    
    if (teacherAnswerText) {
      // If teacherAnswerText is a single letter (A, B, C, D), use it directly
      if (/^[A-D]$/i.test(teacherAnswerText)) {
        correctAnswer = teacherAnswerText.toUpperCase();
      } else {
        // Otherwise try to match by text content
        const correctOptionIndex = options.findIndex(opt => {
          const optionText = opt.english.toLowerCase();
          const cleanCorrectText = String(teacherAnswerText).toLowerCase().replace(/\.$/, '').trim();
          return optionText.includes(cleanCorrectText) || 
                 cleanCorrectText.includes(optionText) ||
                 optionText === cleanCorrectText;
        });
        correctAnswer = correctOptionIndex >= 0 ? String.fromCharCode(65 + correctOptionIndex) : '';
      }
    }
    
    return {
      id: studentQ.id || index + 1,
      english_question: qText,
      italian_question: qText,
      options: options,
      selectedAnswer: null,
      correctAnswer: correctAnswer || (options.length > 0 ? 'A' : '')
    };
  });
};

export const isAnswerCorrect = (question: Question, teacherAnswerText: string | undefined): boolean => {
  if (!question.selectedAnswer || !teacherAnswerText) return false;
  
  const selectedOptionLetter = getOptionLetter(question.selectedAnswer);
  const selectedOptionIndex = selectedOptionLetter.charCodeAt(0) - 65;
  const selectedOption = question.options[selectedOptionIndex];
  
  if (selectedOption) {
    const selectedText = selectedOption.english.toLowerCase();
    const correctText = teacherAnswerText.toLowerCase().replace(/\.$/, '');
    return selectedText.includes(correctText) || 
           correctText.includes(selectedText) ||
           selectedText === correctText;
  }
  
  return false;
};
