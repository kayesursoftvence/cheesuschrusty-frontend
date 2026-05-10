/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* ======================================================
   CEFR Levels & Question Classification
====================================================== */

export type CEFRLevel = "A1" | "A2" | "B1" | "C1" | "C2"

export enum ListeningQuestionType {
  FACTUAL = "FACTUAL",
  DETAIL = "DETAIL",
  PRACTICAL_INFERENCE = "PRACTICAL_INFERENCE",
  ABSTRACT_REASONING = "ABSTRACT_REASONING",
  OPINION_ATTITUDE = "OPINION_ATTITUDE"
}

/* ======================================================
   Type Definitions for API Response
====================================================== */

interface ApiResponseHeader {
  level?: unknown;
  domain?: unknown;
  topic?: unknown;
  provider?: unknown;
  task_id?: unknown;
}

interface StudentHandoutContent {
  instructions?: unknown;
  questions?: unknown;
}

interface TeacherPackContent {
  content?: unknown;
  dialogues?: unknown;
}

interface ApiContent {
  header?: ApiResponseHeader;
  student_handout?: StudentHandoutContent;
  teacher_pack?: TeacherPackContent;
  questions?: unknown;
  dialogues?: unknown;
  instructions?: unknown;
}

interface ApiResponseData {
  content?: ApiContent;
  lessonId?: unknown; 
}

interface ApiResponseStructure {
  data?: ApiResponseData;
}

/* ======================================================
   Canonical UI Models
====================================================== */

export interface NormalizedOption {
  key: "A" | "B" | "C" | "D"
  text: string
}

export interface NormalizedQuestion {
  id: number
  text: string
  options: NormalizedOption[]
  questionType: ListeningQuestionType
}

export interface NormalizedDialogue {
  id: number
  title?: string
  script: string
}

export interface ListeningTaskUIModel {
  level: CEFRLevel
  domain: string
  topic: string
  instructions: string

  lessonId: number | string;

  dialogues: NormalizedDialogue[]
  questions: NormalizedQuestion[]

  meta: {
    provider: string
    taskId: string
    estimatedDuration: string
  }
}

/* ======================================================
   Internal Constants
====================================================== */

const QUESTION_TYPE_BY_LEVEL: Record<CEFRLevel, ListeningQuestionType> = {
  A1: ListeningQuestionType.FACTUAL,
  A2: ListeningQuestionType.DETAIL,
  B1: ListeningQuestionType.PRACTICAL_INFERENCE,
  C1: ListeningQuestionType.ABSTRACT_REASONING,
  C2: ListeningQuestionType.OPINION_ATTITUDE
}

const VALID_OPTION_KEYS = ["A", "B", "C", "D"] as const

/* ======================================================
   Utility Guards
====================================================== */

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const assertCEFRLevel = (level: unknown): CEFRLevel => {
  if (
    level === "A1" ||
    level === "A2" ||
    level === "B1" ||
    level === "C1" ||
    level === "C2"
  ) {
    return level
  }
  throw new Error(`Invalid CEFR level: ${String(level)}`)
}

/* ======================================================
   Option Normalizers
====================================================== */

const normalizeOptionsFromArray = (
  options: unknown[]
): NormalizedOption[] => {
  return options.map((opt) => {
    if (!isObject(opt)) {
      throw new Error("Invalid option format (array)")
    }

    // Handle missing label/id gracefully
    const key = String(opt.label || opt.id || opt.key || "")
    if (!VALID_OPTION_KEYS.includes(key as any)) {
      // Generate a valid key based on index instead of throwing
      const validKey = VALID_OPTION_KEYS[options.indexOf(opt)] || "A"
      return {
        key: validKey,
        text: String(opt.text || opt.value || "")
      }
    }

    return {
      key: key as "A" | "B" | "C" | "D",
      text: String(opt.text || opt.value || "")
    }
  })
}

const normalizeOptionsFromObject = (
  options: Record<string, unknown>
): NormalizedOption[] => {
  return Object.entries(options).map(([key, value], index) => {
    if (!VALID_OPTION_KEYS.includes(key as any)) {
      // Generate valid key instead of throwing
      const validKey = VALID_OPTION_KEYS[index] || "A"
      return {
        key: validKey,
        text: String(value)
      }
    }

    return {
      key: key as "A" | "B" | "C" | "D",
      text: String(value)
    }
  })
}

/* ======================================================
   Dialogue Normalizer
====================================================== */

const normalizeDialogues = (teacherContent: unknown): NormalizedDialogue[] => {
  if (!isObject(teacherContent)) return []

  // Variant A: dialogues: []
  if (Array.isArray(teacherContent.dialogues)) {
    return teacherContent.dialogues.map((d: any, index: number) => ({
      // Handle missing id
      id: Number(d.id) || index + 1,
      title: d.title ? String(d.title) : undefined,
      script: String(d.script || "")
    }))
  }

  // Variant B: dialogue_1, dialogue_2 ...
  return Object.entries(teacherContent)
    .filter(([key]) => key.startsWith("dialogue_"))
    .map(([_, value], index) => {
      if (!isObject(value)) {
        throw new Error("Invalid dialogue object")
      }

      return {
        id: index + 1,
        title: value.title ? String(value.title) : undefined,
        script: String(value.script || "")
      }
    })
}

/* ======================================================
   Question Normalizer
====================================================== */

const normalizeQuestions = (
  rawQuestions: unknown,
  level: CEFRLevel
): NormalizedQuestion[] => {
  // Handle cases where rawQuestions might not be an array
  if (!Array.isArray(rawQuestions)) {
    // Try to extract questions from object format
    if (isObject(rawQuestions)) {
      // Check if it's an object with question_1, question_2, etc.
      const questionEntries = Object.entries(rawQuestions)
        .filter(([key]) => key.startsWith('question_'))
        .sort(([keyA], [keyB]) => {
          const numA = parseInt(keyA.match(/\d+/)?.[0] || '0', 10)
          const numB = parseInt(keyB.match(/\d+/)?.[0] || '0', 10)
          return numA - numB
        })
        .map(([_, q]) => q)
      
      if (questionEntries.length > 0) {
        return questionEntries.map((q, index) => normalizeQuestion(q, index, level))
      }
    }
    throw new Error("Questions must be provided as an array or question objects")
  }

  return rawQuestions.map((q, index) => normalizeQuestion(q, index, level))
}

// Helper function to normalize a single question
const normalizeQuestion = (
  q: unknown,
  index: number,
  level: CEFRLevel
): NormalizedQuestion => {
  if (!isObject(q)) {
    throw new Error(`Question ${index + 1} is not a valid object`)
  }

  // Variant A: Direct question with options array or object
  if (("text" in q || "question" in q) && "options" in q) {
    const questionText = q.text || q.question
    if (!questionText) {
      throw new Error(`Question ${index + 1} missing text`)
    }

    if (!q.options) {
      throw new Error(`Question ${index + 1} missing options`)
    }

    return {
      id: Number(q.id || q.question_id || index + 1),
      text: String(questionText),
      options: Array.isArray(q.options) 
        ? normalizeOptionsFromArray(q.options)
        : normalizeOptionsFromObject(q.options as Record<string, unknown>),
      questionType: QUESTION_TYPE_BY_LEVEL[level]
    }
  }

  // Variant C: object-wrapped question (C2)
  const entries = Object.entries(q)
  if (entries.length === 0) {
    throw new Error("Empty question object")
  }

  // Fixed: Use _ for unused key parameter
  const [_, value] = entries[0]
  if (!isObject(value)) {
    throw new Error("Invalid wrapped question")
  }

  return {
    id: index + 1,
    text: String(value.text || value.question || ""),
    options: normalizeOptionsFromObject(
      value.options as Record<string, unknown>
    ),
    questionType: QUESTION_TYPE_BY_LEVEL[level]
  }
}

/* ======================================================
   Duration Estimator
====================================================== */

const estimateDuration = (level: CEFRLevel): string => {
  switch (level) {
    case "A1":
      return "2–3 minutes"
    case "A2":
      return "3–4 minutes"
    case "B1":
      return "4–5 minutes"
    case "C1":
      return "6–7 minutes"
    case "C2":
      return "7–10 minutes"
    default:
      return "5 minutes" // Fallback
  }
}

/* ======================================================
   🎯 FINAL NORMALIZER FUNCTION
====================================================== */

export default function normalizeListeningTask(
  apiResponse: unknown
): ListeningTaskUIModel {
  // First, assert it's an object
  if (!isObject(apiResponse)) {
    throw new Error("Invalid API response")
  }

  console.log(apiResponse)

  // Safely cast to our known structure
  const response = apiResponse as ApiResponseStructure
  const data = response.data
  
  if (!isObject(data)) {
    throw new Error("Missing data in API response")
  }

  const content = data.content as ApiContent | undefined
  
  if (!isObject(content)) {
    throw new Error("Missing content in API response")
  }

  const header = content.header as ApiResponseHeader | undefined
  const studentHandout = content.student_handout as StudentHandoutContent | undefined
  const teacherPack = content.teacher_pack as TeacherPackContent | undefined

  // Check if header exists
  if (!isObject(header)) {
    throw new Error("Missing header in content")
  }

  const level = assertCEFRLevel(header.level)

  // Prepare dialogues source
  let dialoguesSource: unknown = []
  if (isObject(teacherPack)) {
    dialoguesSource = teacherPack.content || teacherPack.dialogues
  } else if (content.dialogues) {
    dialoguesSource = content.dialogues
  }

  // Prepare questions source
  let questionsSource: unknown = []
  if (isObject(studentHandout)) {
    questionsSource = studentHandout.questions
  } else if (content.questions) {
    questionsSource = content.questions
  }

  // Prepare instructions
  let instructions = ""
  if (isObject(studentHandout) && studentHandout.instructions) {
    instructions = String(studentHandout.instructions)
  } else if (content.instructions) {
    instructions = String(content.instructions)
  }

  return {
    level,
    domain: String(header.domain || ""),
    topic: String(header.topic || ""),
    instructions: instructions,
    lessonId: (apiResponse as any)?.data?.lessonId,
    dialogues: normalizeDialogues(dialoguesSource),
    questions: normalizeQuestions(questionsSource, level),

    meta: {
      provider: String(header.provider || ""),
      taskId: String(header.task_id || ""),
      estimatedDuration: estimateDuration(level)
    }
  }
}