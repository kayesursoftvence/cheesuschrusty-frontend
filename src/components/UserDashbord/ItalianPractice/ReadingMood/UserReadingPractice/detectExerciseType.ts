export enum ExerciseType {
  MATCHING = 'MATCHING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_GAP = 'FILL_GAP',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ORDERING = 'ORDERING',
  UNKNOWN = 'UNKNOWN',
}

export default function detectExerciseType(instruction?: string): ExerciseType {
  if (!instruction) return ExerciseType.UNKNOWN;

  const text = instruction.toLowerCase();

  // MATCHING: match + statements + letters/numbers
  const isMatching =
    text.includes('match') &&
    text.includes('statement') &&
    (
      /\([a-d](\s*[-,]\s*[a-d])+\)/i.test(text) ||
      text.includes('texts') ||
      text.includes('write the letter')
    );
  if (isMatching) return ExerciseType.MATCHING;

  // MULTIPLE_CHOICE: choose the correct answer, options A/B/C/D
  const isMultipleChoice =
    text.includes('choose the correct answer') ||
    text.includes('select the correct option') ||
    text.includes('a, b, c, d');
  if (isMultipleChoice) return ExerciseType.MULTIPLE_CHOICE;

  // TRUE_FALSE: true or false statements
  const isTrueFalse =
    text.includes('true or false') ||
    text.includes('decide if the statement is true or false');
  if (isTrueFalse) return ExerciseType.TRUE_FALSE;

  // FILL_GAP: fill in the blank, missing word
  const isFillGap =
    text.includes('fill in the blank') ||
    text.includes('missing word') ||
    text.includes('complete the sentence');
  if (isFillGap) return ExerciseType.FILL_GAP;

  // SHORT_ANSWER: answer the question briefly
  const isShortAnswer =
    text.includes('answer the question') ||
    text.includes('in a few words') ||
    text.includes('short answer');
  if (isShortAnswer) return ExerciseType.SHORT_ANSWER;

  // ORDERING: put things in order
  const isOrdering =
    text.includes('put the sentences in order') ||
    text.includes('arrange the steps') ||
    text.includes('order the paragraphs');
  if (isOrdering) return ExerciseType.ORDERING;

  // fallback
  return ExerciseType.UNKNOWN;
}
