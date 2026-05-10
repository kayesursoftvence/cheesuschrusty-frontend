/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReadingQuestion } from "./types";

export const processReadingData = (questionSetData: any) => {
  console.log("[processReadingData] Input data:", questionSetData);
  if (!questionSetData || !questionSetData.success) {
    console.warn("[processReadingData] Data missing or success=false");
    return null;
  }

  const content = questionSetData.data?.content;
  console.log("[processReadingData] Extracted content:", content);
  
  const handout = content?.student_handout || content?.PART_2_STUDENT_HANDOUT || content['PART 2: STUDENT_HANDOUT (PRINTABLE)'] || content?.content ||  content ;
  const teacherPack = content?.teacher_pack || content?.PART_1_TEACHER_PACK || content['PART 1: TEACHER_PACK (SECURE)'];

  console.log("[processReadingData] Handout:", !!handout, "TeacherPack:", !!teacherPack);

  if (!handout) {
    console.warn("[processReadingData] Handout is missing from content");
    return null;
  }

  // 1. Extract Texts
  const rawTexts = handout?.stimulus || handout?.texts || handout?.Texts || handout?.TEXTS || '';
  let textList: any[] = [];
  
  if (Array.isArray(rawTexts)) {
    textList = rawTexts;
  } else if (rawTexts && typeof rawTexts === 'object') {
    textList = Object.entries(rawTexts).map(([key, value]: [string, any]) => ({
      ...value,
      letter: key.replace('text_', '').toUpperCase()
    }));
  }

  // 2. Extract Statements/Questions
  const rawStatements = handout.questions || 
                        handout.statements || 
                        handout.Statements || 
                        handout.Questions ||
                        handout.italian_questions ||
                        handout.evaluation_questions ||
                        content.questions ||
                        content.Statements;
                        
  const statementList = Array.isArray(rawStatements) ? rawStatements : (rawStatements ? Object.values(rawStatements) : []);

  let italianPassage = "";
  const englishPassage = handout.Instructions || handout.instructions || handout.text || handout.Text || "";
  let questions: ReadingQuestion[] = [];

  // Handle matching exercise structure (Multiple texts)
  if (textList.length > 0 && (handout?.stimulus || handout.statements || handout.Statements || handout.questions)) {
    italianPassage = textList.map((item: any, idx: number) => {
      const letter = item.letter || String.fromCharCode(65 + idx);
      const title = item.Title || item.title || "";
      const text = item.content || item.Text || item.text || (typeof item === 'string' ? item : "");
      return `TEXT ${letter}${title ? `: ${title}` : ""}\n${text}`;
    }).join('\n\n');

    const options = textList.map((item: any, idx: number) => ({
      letter: item.letter || String.fromCharCode(65 + idx),
      text: item.Title || item.title || `Text ${item.letter || String.fromCharCode(65 + idx)}`
    }));

    const keyMap = teacherPack?.key || teacherPack?.Key || teacherPack?.answer_key || {};
    const matches = Array.isArray(keyMap.matches) ? keyMap.matches : [];

    questions = statementList.map((stmt: string, index: number) => {
      const stmtId = String(index + 1);
      
      let stmtText = stmt;
      if (typeof stmt === 'object' && stmt !== null) {
        stmtText = (stmt as any).text || (stmt as any).question || (stmt as any).statement || "";
      }

      // Clean up statement text: "1. Statement _____" -> "Statement"
      const cleanStmt = typeof stmtText === 'string' 
        ? stmtText.replace(/^\d+[.)]\s*/, '').replace(/\s*_{2,}$/, '').trim()
        : "";

      let correct = "A";
      
      if (matches.length > 0) {
        const match = matches.find((m: any) => 
          (m.statement && (m.statement.includes(cleanStmt) || cleanStmt.includes(m.statement))) ||
          m.id === stmtId ||
          m.id === index + 1
        );
        if (match) {
          correct = match.correct_text || match.correct || match.answer;
        }
      } else {
        const directMatch = keyMap[`statement_${stmtId}`] || keyMap[stmtId];
        if (directMatch) {
          correct = typeof directMatch === 'object' ? directMatch.correct : directMatch;
        } else {
          const contentArray = teacherPack?.CONTENT || teacherPack?.content || [];
          const firstItem = Array.isArray(contentArray) ? contentArray[0] : contentArray;
          if (firstItem?.Key && firstItem.Key[stmtId]) {
            correct = firstItem.Key[stmtId];
          }
        }
      }

      return {
        id: index + 1,
        question: cleanStmt,
        answers: options,
        correctAnswer: correct
      };
    });
  } 
  // Handle standard passage structure
  else {
    // Support more paths for the main text
    const pText = handout.text || 
                  handout.Text || 
                  handout.italian_passage || 
                  handout.content?.text ||
                  teacherPack?.content?.text ||
                  teacherPack?.script?.content ||
                  (typeof rawTexts === 'string' ? rawTexts : "");
                  
    italianPassage = pText || "";
    
    if (statementList.length > 0) {
      questions = statementList.map((q: any, index: number) => {
        const options = q.options ? Object.entries(q.options).map(([letter, text]: [string, any]) => ({
          letter,
          text: String(text)
        })) : [];

        let correctAnswer = "A";
        const key = q.id || String(index + 1);
        const keyMap = teacherPack?.key || teacherPack?.answer_key || {};
        
        if (keyMap.answers && keyMap.answers[key]) {
          const ans = keyMap.answers[key];
          correctAnswer = typeof ans === 'string' ? ans.charAt(0) : "A";
        } else if (keyMap[key]?.correct_answer) {
          correctAnswer = keyMap[key].correct_answer;
        } else if (typeof keyMap[key] === 'string') {
           correctAnswer = keyMap[key];
        }

        return {
          id: q.id || index + 1,
          question: q.question || q.text || (typeof q === 'string' ? q : ""),
          answers: options,
          correctAnswer: correctAnswer
        };
      });
    }
  }

  return {
    italianPassage,
    englishPassage,
    questions,
    readingData: questionSetData.data
  };
};
