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

  let c = res.data?.content || res.data || res;

  if (res.data?.questionSets && res.data.questionSets[0]?.content) {
    c = res.data.questionSets[0].content;
  } else if (!c.instructions && !c.questions && !c.student_handout) {
    if (res.data?.data?.content) {
      c = res.data.data.content;
    } else if (res.data?.data) {
      c = res.data.data;
    } else if (res.content) {
      c = res.content;
    }
  }

  if (!c || (!c.instructions && !c.questions && !c.student_handout)) {
    console.warn("Could not find standard MCQ structure in:", res);
    return null;
  }

  const studentHandout = c.student_handout || c;
  const teacherPack = c.teacher_pack || c;
  const header = c.header || res.header || {};
  
  const answerKey = teacherPack.key?.answer_key || {};
  const answers: Record<string, string> = {};

  Object.entries(answerKey).forEach(([id, v]: any) => {
    answers[id] = v.answer || "";
  });

  const questions = (studentHandout.questions || c.questions || []).map((q: any) => ({
    id: q.id,
    text: q.text,
    type: (q.type || "MCQ").toUpperCase(),
    options: q.options || []
  }));

  return {
    header: {
      level: header.level || "",
      skill: header.skill || "",
      topic: header.topic || "",
      domain: header.domain || "",
      taskId: header.task_id || "M-01",
      provider: header.provider || ""
    },
    stimulus: {
      title: teacherPack.content?.stimulus?.title || c.stimulus?.title || "",
      text: teacherPack.content?.stimulus?.text || c.stimulus?.text || ""
    },
    instructions: studentHandout.instructions || c.instructions || "",
    questions,
    answers
  };
}
