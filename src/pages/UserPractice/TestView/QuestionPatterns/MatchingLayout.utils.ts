import { MatchingPractice } from '../test.types';

export function normalizeQuestionSet(res: any): MatchingPractice | null {
  if (!res) return null;

  console.log("Normalizing res:", res);

  // The goal is to find the object that contains student_handout and teacher_pack
  // These are sometimes at the top level of the body, sometimes in .data, sometimes in .data.content
  let c = res.data?.content || res.data || res;

  if (!c.student_handout || !c.teacher_pack) {
    // Try deeper search if the first guess failed
    if (res.data?.data?.content?.student_handout) {
      c = res.data.data.content;
    } else if (res.data?.data?.student_handout) {
      c = res.data.data;
    } else if (res.content?.student_handout) {
      c = res.content;
    }
  }

  if (!c || !c.student_handout || !c.teacher_pack) {
    console.warn("Could not find standard question structure in:", res);
    // If it's a very thin structure, maybe it's just questions?
    if (!c.questions && !c.student_handout?.questions) return null;
  }

  const studentHandout = c.student_handout || c;
  const teacherPack = c.teacher_pack || {};
  const header = c.header || res.header || {};

  const answerKey = teacherPack.key?.answer_key || {};
  const answers: Record<string, string> = {};

  Object.entries(answerKey).forEach(([id, v]: any) => {
    const ans = v.answer || "";

    if (ans.includes(",")) {
      ans.split(",").forEach((p: string) => {
        const parts = p.trim().split("-");
        if (parts.length === 2) {
          answers[parts[0]] = parts[1];
        }
      });
    } else {
      answers[id] = ans;
    }
  });

  return {
    header: {
      level: header.level || "",
      skill: header.skill || "",
      topic: header.topic || "",
      domain: header.domain || "",
      taskId: header.task_id || "",
      provider: header.provider || "",
      lessonTitle: header.lesson_title || "",
      difficulty: header.difficulty || "",
      taskTime: Number(header.task_time || 0)
    },

    stimulus: {
      title: teacherPack.content?.stimulus?.title || "",
      text: teacherPack.content?.stimulus?.text || "",
      wordCount: Number(teacherPack.content?.word_count || 0)
    },

    instructions: studentHandout.instructions || "",

    questions: (studentHandout.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      type: (q.type || "").toUpperCase(),
      options: q.options || []
    })),

    answers
  };
}
