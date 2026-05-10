import { WritingPractice } from '../test.types';

export function normalizeWritingPractice(res: any): WritingPractice | null {
  if (!res) return null;

  console.log("Normalizing Writing res:", res);

  // Robust parsing similar to MatchingLayout
  let c = res.data?.content || res.data || res;

  // Sometimes the data is wrapped in questionSets array (as seen in older structure)
  if (res.data?.questionSets && res.data.questionSets[0]?.content) {
    c = res.data.questionSets[0].content;
  } else if (!c.student_handout || !c.teacher_pack) {
    if (res.data?.data?.content?.student_handout) {
      c = res.data.data.content;
    } else if (res.data?.data?.student_handout) {
      c = res.data.data;
    } else if (res.content?.student_handout) {
      c = res.content;
    }
  }

  if (!c || !c.student_handout || !c.teacher_pack) {
    console.warn("Could not find standard writing question structure in:", res);
    if (!c.questions && !c.student_handout?.questions) return null;
  }

  const studentHandout = c.student_handout || c;
  const teacherPack = c.teacher_pack || {};
  const header = c.header || res.header || {};
  const metadata = teacherPack.key?.time_metadata || {};

  const question = studentHandout.questions?.[0] || {
    id: "1",
    text: studentHandout.instructions || "",
    type: "WRITING"
  };

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
      text: teacherPack.content?.stimulus?.text || ""
    },
    instructions: studentHandout.instructions || "",
    question: {
      id: question.id,
      text: question.text,
      type: (question.type || "WRITING").toUpperCase()
    },
    metadata: {
      isTimed:
        String(metadata.is_timed || "").toLowerCase() === "true" ||
        String(metadata.is_timed || "").toLowerCase() === "yes",
      taskTime: Number(metadata.task_time || 0)
    }
  };
}
