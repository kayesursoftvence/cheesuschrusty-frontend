/* ──────────────────────────────────────────────────────────────
   Unified normalised content type & single normalize() entry point
   ────────────────────────────────────────────────────────────── */

// Added "mcq" and others to align with your detection logic
export type ContentKind = "questionSet" | "mcq" | "speaking" | "writing";

export interface NormalizedContent {
  kind: ContentKind;

  header: {
    level: string;
    skill: string;
    topic: string;
    domain: string;
    taskId: string;
    layout: string; // Added this as it was missing from the interface
    provider: string;
    lessonTitle: string;
    difficulty: string;
    taskTime: number;
  };

  stimulus: {
    title: string;
    text: string;
    wordCount: number;
  };

  imageUrl: string | null;
  instructions: string;

  questions: {
    id: string;
    text: string;
    type: string;
    options: { id: string; text: string }[];
  }[];

  answers: Record<string, string>;

  metadata: {
    isTimed: boolean;
    taskTime: number;
    totalPossible: number;
  };
}

/* ── internal helpers ─────────────────────────────────────── */

function resolvePayload(res: any): any | null {
  if (!res) return null;
  
  // Handle case where res might be the nested data object already
  const c = res.data?.content || res.data || res;

  if (res.data?.questionSets?.[0]?.content) {
    return res.data.questionSets[0].content;
  }

  if (c.student_handout || c.teacher_pack || c.instructions || c.questions) {
    return c;
  }

  const candidates = [
    res.data?.data?.content,
    res.data?.data,
    res.content,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      (candidate.student_handout ||
        candidate.teacher_pack ||
        candidate.instructions ||
        candidate.questions)
    ) {
      return candidate;
    }
  }

  return null;
}

function detectKind(
  header: Record<string, any>,
  questions: { type: string; options: any[] }[],
  c: Record<string, any>,
  teacherPack: Record<string, any>
): ContentKind {
  const skill = (header.skill || "").toLowerCase();

  if (skill === "speaking") return "speaking";
  if (skill === "writing") return "writing";

  const types = new Set(questions.map((q) => q.type));
  if (types.has("SPEAKING")) return "speaking";
  if (types.has("WRITING")) return "writing";
  
  // Improved check: if it has multiple types or specific tags, it's a question set
  if (types.has("MATCHING") || types.has("GAP_FILL")) return "questionSet";

  const answerKey: Record<string, any> = teacherPack?.key?.answer_key || {};
  const hasMatchingAnswers = Object.values(answerKey).some((v: any) =>
    String(v?.answer || "").includes(",")
  );
  if (hasMatchingAnswers) return "questionSet";

  if (teacherPack?.key?.time_metadata) return "writing";
  if (c.image_url || header.image_url) return "speaking";

  if (questions.some((q) => q.options?.length > 0)) return "mcq";
  if (skill === "reading" || skill === "listening") return "questionSet";

  return "mcq";
}

function parseAnswers(answerKey: Record<string, any>): Record<string, string> {
  const answers: Record<string, string> = {};

  for (const [id, v] of Object.entries(answerKey)) {
    const ans: string = (v as any)?.answer ?? "";

    if (ans.includes(",")) {
      for (const pair of ans.split(",")) {
        const [left, right] = pair.trim().split("-");
        if (left && right) answers[left.trim()] = right.trim();
      }
    } else {
      answers[id] = ans;
    }
  }

  return answers;
}

/* ── public API ───────────────────────────────────────────── */

export default function normalize(res: any): NormalizedContent | null {
  if (!res) return null;

  const c = resolvePayload(res);

  if (!c) {
    console.warn("normalize: unrecognisable payload shape", res);
    return null;
  }

  const studentHandout = c.student_handout || c;
  const teacherPack = c.teacher_pack || c;
  const header = c.header || res.header || {};

  const rawQuestions: any[] = studentHandout.questions || c.questions || [];
  const questions = rawQuestions.map((q: any) => ({
    id: String(q.id ?? ""),
    text: q.text ?? "",
    type: (q.type || "").toUpperCase(),
    options: q.options || [],
  }));

  const answerKey: Record<string, any> = teacherPack?.key?.answer_key || {};
  const answers = parseAnswers(answerKey);
  const kind = detectKind(header, questions, c, teacherPack);

  const timeMeta = teacherPack?.key?.time_metadata || {};
  const calibration = c.calibration_metrics || teacherPack?.key?.calibration_metrics || {};

  const stimulus = {
    title: teacherPack?.content?.stimulus?.title || c.stimulus?.title || "",
    text: teacherPack?.content?.stimulus?.text || c.stimulus?.text || "",
    wordCount: Number(teacherPack?.content?.word_count || c.word_count || 0),
  };

  const imageUrl =
    header.image_url ||
    teacherPack?.content?.stimulus?.image_url ||
    c.image_url ||
    null;

  return {
    kind,
    header: {
      level: header.level || "",
      skill: header.skill || "",
      topic: header.topic || "",
      domain: header.domain || "",
      taskId: header.task_id || "",
      // Fix: Safely access layout using optional chaining and local calibration variable
      layout: calibration.task_type || res?.data?.content?.calibration_metrics?.task_type || "",
      provider: header.provider || "",
      lessonTitle: header.lesson_title || "",
      difficulty: header.difficulty || "",
      taskTime: Number(header.task_time || 0),
    },
    stimulus,
    imageUrl,
    instructions: studentHandout.instructions || c.instructions || "",
    questions,
    answers,
    metadata: {
      isTimed: ["true", "yes"].includes(String(timeMeta.is_timed || "").toLowerCase()),
      taskTime: Number(timeMeta.task_time || 0),
      totalPossible: Number(calibration.total_possible || 1),
    },
  };
}