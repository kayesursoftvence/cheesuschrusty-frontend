/**
 * Get display text for an answer, with fallback
 */
export function getAnswerText(answer: string): string {
  return answer || "No answer provided";
}

/**
 * Extract option letter (A, B, C, D) from answer text
 */
export function getOptionLetter(text: string): string {
  const match = text.match(/^([A-D])\./);
  return match ? match[1] : "?";
}
