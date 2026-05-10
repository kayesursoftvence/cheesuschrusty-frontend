import { SpeakingPractice } from '../test.types';

export function normalizeSpeakingPractice(res: any): SpeakingPractice | null {
  if (!res) return null;

  console.log("Normalizing Speaking res:", res);

  // Robust parsing: search for the content payload
  let c = res.data?.content || res.data || res;

  if (res.data?.questionSets && res.data.questionSets[0]?.content) {
    c = res.data.questionSets[0].content;
  } else if (!c.instructions && !c.questions) {
    if (res.data?.data?.content) {
      c = res.data.data.content;
    } else if (res.data?.data) {
      c = res.data.data;
    } else if (res.content) {
      c = res.content;
    }
  }

  if (!c || (!c.instructions && !c.questions && !c.student_handout)) {
    console.warn("Could not find standard speaking question structure in:", res);
    return null;
  }

  // Handle differences in payload shape (might be grouped in teacher_pack/student_handout or flat)
  const studentHandout = c.student_handout || c;
  const teacherPack = c.teacher_pack || c;
  const header = c.header || res.header || {};
  
  const questionsList = studentHandout.questions || c.questions || [];
  const question = questionsList[0] || {
    id: "1",
    text: studentHandout.instructions || c.instructions || "",
    type: "SPEAKING"
  };

  // Find image URL – it might be in header, stimulus, or top level
  const imageUrl = header.image_url || teacherPack.content?.stimulus?.image_url || c.image_url || null;

  return {
    header: {
      level: header.level || "",
      skill: header.skill || "",
      topic: header.topic || "",
      domain: header.domain || "",
      taskId: header.task_id || "S-01",
      provider: header.provider || ""
    },
    imageUrl: imageUrl, 
    instructions: studentHandout.instructions || c.instructions || "",
    question: {
      id: question.id,
      text: question.text,
      type: (question.type || "SPEAKING").toUpperCase()
    },
    metadata: {
      totalPossible: Number(c.calibration_metrics?.total_possible || teacherPack.key?.calibration_metrics?.total_possible || 1)
    }
  };
}
