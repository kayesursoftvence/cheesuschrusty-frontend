/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LessonType } from "../types";
import { useLazyGetNextLessonQuery } from "@/redux/features/lesson/lessonPractice/lessonPracticeApi";
import { useLazyGetLessonQuestionSetQuery } from "@/redux/features/lesson/lessonQuestion/lessonQuestionSetApi";

const SKILL_TO_LESSON_TYPE: Record<string, LessonType> = {
  Reading: LessonType.READING,
  Listening: LessonType.LISTENING,
  Writing: LessonType.WRITING,
  Speaking: LessonType.SPEAKING,
};

export const usePracticeFlow = (refetchAnalytics: () => void) => {
  const navigate = useNavigate();
  const [getNextLesson] = useLazyGetNextLessonQuery();
  const [getLessonQuestionSet] = useLazyGetLessonQuestionSetQuery();

  const [flowState, setFlowState] = useState({
    loadingSkill: null as string | null,
    showLevelSelector: null as string | null,
    sessionLevels: {} as Record<string, string>,
  });

  const handleLevelSelection = useCallback((skill: string, level: string) => {
    setFlowState(p => ({ ...p, sessionLevels: { ...p.sessionLevels, [skill]: level } }));
  }, []);

  const executePracticeStart = useCallback(async (skill: string, level: string) => {
    const type = SKILL_TO_LESSON_TYPE[skill] || LessonType.READING;
    setFlowState(p => ({ ...p, loadingSkill: skill }));

    try {
      const lessonResult = await getNextLesson({ type, level }).unwrap();
      const lessonId = lessonResult?.data?.id;

      if (!lessonId) throw new Error("No lessons available for this level.");

      navigate(`/user/practice/${type.toLowerCase()}?level=${level}`, { 
        state: { lessonId: String(lessonId), lessonType: type }
      });

      setFlowState(p => ({ ...p, showLevelSelector: null }));
      refetchAnalytics();
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || "Failed to start practice.");
    } finally {
      setFlowState(p => ({ ...p, loadingSkill: null }));
    }
  }, [getNextLesson, getLessonQuestionSet, navigate]);

  const handlePracticeStart = useCallback(async (skill: string) => {
    if (flowState.showLevelSelector !== skill) {
      return setFlowState(p => ({ ...p, showLevelSelector: skill }));
    }

    const level = flowState.sessionLevels[skill];
    if (!level) return toast.error("Please select a level first.");

    console.log("[PracticeFlow]", skill, level);
    await executePracticeStart(skill, level);
  }, [flowState.showLevelSelector, flowState.sessionLevels, executePracticeStart]);

  const setShowLevelSelector = useCallback((val: string | null) => {
    setFlowState(p => ({ ...p, showLevelSelector: val }));
  }, []);

  return { ...flowState, setShowLevelSelector, handleLevelSelection, handlePracticeStart };
};
