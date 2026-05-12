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

  const data = res.data || res;
  const content = data.content || data;
  const studentHandout = content.student_handout || content;
  const teacherPack = content.teacher_pack || content;
  const metadata = content.metadata || content.header || data.header || {};
  const header = content.header || data.header || metadata || {};

  if (!content || (!content.instructions && !content.questions && !studentHandout.questions)) {
    console.warn("normalize: unrecognisable payload shape", res);
    return null;
  }

  const rawQuestions: any[] = studentHandout.questions || content.questions || [];
  const questions = rawQuestions.map((q: any, idx: number) => {
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
      id: String(q.id || q.number || idx + 1),
      text: q.prompt || q.text || q.question || "",
      type: (q.type || "MCQ").toUpperCase(),
      options: normalizedOptions,
    };
  });

  const answerKey: Record<string, any> = teacherPack?.answer_key || teacherPack?.key?.answer_key || {};
  const answers = parseAnswers(answerKey);
  const kind = detectKind(header, questions, content, teacherPack);

  const timeMeta = teacherPack?.key?.time_metadata || {};
  const calibration = content.calibration_metrics || teacherPack?.key?.calibration_metrics || {};

  // Normalize Stimulus
  const stimulusRaw = studentHandout.stimulus || content.stimulus || "";
  const stimulusText = typeof stimulusRaw === 'string' ? stimulusRaw : stimulusRaw.text || "";
  const stimulusTitle = typeof stimulusRaw === 'object' ? stimulusRaw.title : "";
  const wordCount = Number(teacherPack.word_count || teacherPack.content?.word_count || content.word_count || 0);

  const stimulus = {
    title: stimulusTitle,
    text: stimulusText,
    wordCount: wordCount || stimulusText.split(' ').length,
  };

  const imageUrl =
    header.image_url ||
    teacherPack?.content?.stimulus?.image_url ||
    content.image_url ||
    null;

  return {
    kind,
    header: {
      level: metadata.level || header.level || "",
      skill: metadata.skill || header.skill || "",
      topic: metadata.topic || header.topic || "",
      domain: metadata.domain || header.domain || "",
      taskId: metadata.task_id || header.task_id || "",
      layout: metadata.task_type || calibration.task_type || "",
      provider: metadata.provider || header.provider || "",
      lessonTitle: header.lesson_title || metadata.lesson_title || "",
      difficulty: metadata.difficulty || header.difficulty || "",
      taskTime: Number(metadata.timer || header.task_time || 0),
    },
    stimulus,
    imageUrl,
    instructions: studentHandout.instructions || content.instructions || "",
    questions,
    answers,
    metadata: {
      isTimed: !!(metadata.timer || timeMeta.is_timed),
      taskTime: Number(metadata.timer || timeMeta.task_time || 0),
      totalPossible: Number(calibration.total_possible || questions.length),
    },
  };
}