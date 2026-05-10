import type { JSX } from "react";
import { Link } from "react-router-dom";

type StudentAnswers = { [questionId: string]: string; };
interface SubmitProps {
                        studentAnswers: StudentAnswers;
                        lessonId?: number;
                      }
export default function Submit({ studentAnswers, lessonId }: SubmitProps): JSX.Element {
  const serializedAnswers = Object.entries(studentAnswers).map(([seq, ans])=>`${seq}:${ans}`).join(",");
  return (
    <Link to={`/user/practice/performance/${lessonId ?? ""}?ans=${encodeURIComponent(serializedAnswers)}&type=reading`} 
      className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors">
      Submit
    </Link>
  );
}