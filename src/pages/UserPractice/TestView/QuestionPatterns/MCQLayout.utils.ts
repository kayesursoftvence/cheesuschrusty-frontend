export interface MCQPractice {
  header: {
    level: string
    skill: string
    topic: string
    domain: string
    taskId: string
    provider: string
  }
  stimulus: {
    title: string
    text: string
  }
  instructions: string
  questions: {
    id: string
    text: string
    type: string
    options: {
      id: string
      text: string
    }[]
  }[]
  answers: Record<string, string>
}

export function normalizeMCQPractice(res: any): MCQPractice | null {
  if (!res) return null;

  console.log("Normalizing MCQ res:", res);

  const data = res.data || res;
  const content = data.content || data;
  const studentHandout = content.student_handout || content;
  const teacherPack = content.teacher_pack || content;
  const metadata = content.metadata || header || {};
  const header = content.header || data.header || {};

  if (!content || (!content.instructions && !content.questions && !studentHandout.questions)) {
    console.warn("Could not find standard MCQ structure in:", res);
    return null;
  }

  // Normalize Answers
  const answerKey = teacherPack.answer_key || teacherPack.key?.answer_key || {};
  const answers: Record<string, string> = {};

  Object.entries(answerKey).forEach(([id, v]: any) => {
    // Handle both {answer: "A"} and just "A"
    answers[id] = typeof v === 'object' ? v.answer : v;
  });

  // Normalize Questions
  const questions = (studentHandout.questions || content.questions || []).map((q: any, idx: number) => {
    const qId = q.id || q.number || String(idx + 1);
    const qText = q.prompt || q.text || q.question || "";
    
    // Normalize Options from Record<string, string> to {id, text}[]
    let normalizedOptions = [];
    if (Array.isArray(q.options)) {
      normalizedOptions = q.options.map((opt: any, optIdx: number) => {
        if (typeof opt === 'string') return { id: String.fromCharCode(65 + optIdx), text: opt };
        return { id: opt.id || opt.key || String.fromCharCode(65 + optIdx), text: opt.text || opt.label || "" };
      });
    } else if (typeof q.options === 'object') {
      normalizedOptions = Object.entries(q.options).map(([key, val]: [string, any]) => ({
        id: key,
        text: val
      }));
    }

    return {
      id: qId,
      text: qText,
      type: (q.type || "MCQ").toUpperCase(),
      options: normalizedOptions
    };
  });

  // Normalize Stimulus
  const stimulusRaw = studentHandout.stimulus || content.stimulus || "";
  const stimulusText = typeof stimulusRaw === 'string' ? stimulusRaw : stimulusRaw.text || "";
  const stimulusTitle = typeof stimulusRaw === 'object' ? stimulusRaw.title : "";

  return {
    header: {
      level: metadata.level || header.level || "",
      skill: metadata.skill || header.skill || "",
      topic: metadata.topic || header.topic || "",
      domain: metadata.domain || header.domain || "",
      taskId: metadata.task_id || header.task_id || "M-01",
      provider: metadata.provider || header.provider || ""
    },
    stimulus: {
      title: stimulusTitle,
      text: stimulusText
    },
    instructions: studentHandout.instructions || content.instructions || "",
    questions,
    answers
  };
}
