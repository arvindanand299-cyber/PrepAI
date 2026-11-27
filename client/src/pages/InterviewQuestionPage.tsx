import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  getInterviewByID,
  editInterview,
} from "@/api/mockinterview.api";

import Loader from "@/components/Loader/Loader";

import { useNotification } from "@/components/Notifications/NotificationContext";

import {
  MockInterview,
  Question,
  Notification,
} from "@/vite-env";

interface QuestionWithType extends Question {
  type:
    | "coreSubjectQuestions"
    | "technicalQuestions"
    | "dsaQuestions"
    | "codingQuestions";
}

const InterviewQuestionPage = () => {
  const { id, questionNumber } = useParams<{
    id: string;
    questionNumber: string;
  }>();

  const navigate = useNavigate();

  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);

  const [interview, setInterview] =
    useState<MockInterview | null>(null);

  const [questions, setQuestions] =
    useState<QuestionWithType[]>([]);

  const [answer, setAnswer] = useState("");

  const currentIndex = Math.max(
    Number(questionNumber || 1) - 1,
    0
  );

  // ============================================
  // LOAD INTERVIEW
  // ============================================

  useEffect(() => {
    const loadInterview = async () => {
      try {
        if (!id) {
          throw new Error("Interview ID is missing");
        }

        const data = await getInterviewByID(id);

        // Technical Questions
        const technicalQuestions: QuestionWithType[] =
          data.technicalQuestions?.map(
            (question: Question) => ({
              ...question,
              type: "technicalQuestions",
            })
          ) || [];

        // Core Subject Questions
        const coreQuestions: QuestionWithType[] =
          data.coreSubjectQuestions?.map(
            (question: Question) => ({
              ...question,
              type: "coreSubjectQuestions",
            })
          ) || [];

        // DSA Questions
        const dsaQuestions: QuestionWithType[] =
          data.dsaQuestions?.map(
            (question: Question) => ({
              ...question,
              type: "dsaQuestions",
            })
          ) || [];

        // Coding Questions
        const codingQuestions: QuestionWithType[] =
          data.codingQuestions?.map(
            (question: Question) => ({
              ...question,
              type: "codingQuestions",
            })
          ) || [];

        // ============================================
        // COMBINE ALL QUESTIONS
        // ============================================

        const allQuestions: QuestionWithType[] = [
          ...technicalQuestions,
          ...coreQuestions,
          ...dsaQuestions,
          ...codingQuestions,
        ];

        console.log("Technical Questions:", technicalQuestions);
        console.log("Core Questions:", coreQuestions);
        console.log("DSA Questions:", dsaQuestions);
        console.log("Coding Questions:", codingQuestions);
        console.log("TOTAL QUESTIONS:", allQuestions.length);

        setInterview(data);

        setQuestions(allQuestions);

        // Get current question
        const currentQuestion =
          allQuestions[currentIndex];

        // Load previously saved answer
        if (currentQuestion?.answer) {
          setAnswer(
            currentQuestion.answer
              .replace("Text Response: ", "")
              .split("\nCode Response:")[0]
          );
        } else {
          setAnswer("");
        }

        setLoading(false);
      } catch (error) {
        console.error(error);

        const notification: Notification = {
          id: Date.now().toString(),
          type: "error",
          message: "Unable to load interview",
        };

        addNotification(notification);

        navigate("/dashboard");
      }
    };

    loadInterview();
  }, [id, currentIndex]);

  // ============================================
  // SAVE ANSWER
  // ============================================

  const saveAnswer = async () => {
    if (!interview || !id) {
      return false;
    }

    const currentQuestion =
      questions[currentIndex];

    if (!currentQuestion) {
      return false;
    }

    const updatedAnswer =
      `Text Response: ${answer}\nCode Response: `;

    const updatedInterview: MockInterview = {
      ...interview,
    };

    // ============================================
    // TECHNICAL
    // ============================================

    if (
      currentQuestion.type ===
      "technicalQuestions"
    ) {
      updatedInterview.technicalQuestions =
        interview.technicalQuestions?.map(
          (question) =>
            question.question ===
            currentQuestion.question
              ? {
                  ...question,
                  answer: updatedAnswer,
                }
              : question
        );
    }

    // ============================================
    // CORE SUBJECTS
    // ============================================

    if (
      currentQuestion.type ===
      "coreSubjectQuestions"
    ) {
      updatedInterview.coreSubjectQuestions =
        interview.coreSubjectQuestions?.map(
          (question) =>
            question.question ===
            currentQuestion.question
              ? {
                  ...question,
                  answer: updatedAnswer,
                }
              : question
        );
    }

    // ============================================
    // DSA
    // ============================================

    if (
      currentQuestion.type ===
      "dsaQuestions"
    ) {
      updatedInterview.dsaQuestions =
        interview.dsaQuestions?.map(
          (question) =>
            question.question ===
            currentQuestion.question
              ? {
                  ...question,
                  answer: updatedAnswer,
                }
              : question
        );
    }

    // ============================================
    // CODING
    // ============================================

    if (
      currentQuestion.type ===
      "codingQuestions"
    ) {
      updatedInterview.codingQuestions =
        interview.codingQuestions?.map(
          (question) =>
            question.question ===
            currentQuestion.question
              ? {
                  ...question,
                  answer: updatedAnswer,
                }
              : question
        );
    }

    // ============================================
    // SAVE TO BACKEND
    // ============================================

    try {
      const savedInterview =
        await editInterview(
          id,
          updatedInterview
        );

      setInterview(savedInterview);

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Answer saved successfully",
      });

      return true;
    } catch (error) {
      console.error(error);

      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Failed to save answer",
      });

      return false;
    }
  };

  // ============================================
  // NEXT QUESTION
  // ============================================

  const handleNext = async () => {
    const saved = await saveAnswer();

    if (!saved) {
      return;
    }

    if (
      currentIndex <
      questions.length - 1
    ) {
      navigate(
        `/interview/${id}/question/${
          currentIndex + 2
        }`
      );
    } else {
      navigate(
        `/interview/${id}/completed`
      );
    }
  };

  // ============================================
  // PREVIOUS QUESTION
  // ============================================

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(
        `/interview/${id}/question/${
          currentIndex
        }`
      );
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // ============================================
  // NO QUESTIONS
  // ============================================

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="p-8 bg-white border border-slate-200 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-slate-900">
            No questions available
          </h2>

          <Button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion =
    questions[currentIndex];

  if (!currentQuestion) {
    return null;
  }

  // ============================================
  // QUESTION TYPE
  // ============================================

  const getQuestionTypeLabel = () => {
    switch (currentQuestion.type) {
      case "technicalQuestions":
        return "Technical";

      case "coreSubjectQuestions":
        return "Core Subject";

      case "dsaQuestions":
        return "DSA";

      case "codingQuestions":
        return "Coding";

      default:
        return "Interview";
    }
  };

  // ============================================
  // QUESTION PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              PREP-AI Interview
            </h1>

            <p className="text-sm text-slate-500">
              {interview?.jobRole ||
                "Technical Interview"}
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500">
            Question {currentIndex + 1} /{" "}
            {questions.length}
          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ================= PROGRESS ================= */}

        <div className="mb-8">

          <div className="flex justify-between text-sm mb-2">

            <span className="text-slate-600 font-medium">
              Interview Progress
            </span>

            <span className="text-slate-500">
              {Math.round(
                ((currentIndex + 1) /
                  questions.length) *
                  100
              )}
              %
            </span>

          </div>

          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

        {/* ================= QUESTION ================= */}

        <Card className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                currentQuestion.type ===
                "codingQuestions"
                  ? "bg-purple-50 text-purple-700 border-purple-100"
                  : currentQuestion.type ===
                    "dsaQuestions"
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : currentQuestion.type ===
                    "technicalQuestions"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}
            >
              {getQuestionTypeLabel()}
            </span>

            {currentQuestion.technology && (
              <span className="text-sm text-slate-500">
                {currentQuestion.technology}
              </span>
            )}

          </div>

          <h2 className="text-2xl font-semibold leading-relaxed text-slate-900">
            {currentQuestion.question}
          </h2>

        </Card>

        {/* ================= ANSWER ================= */}

        <Card className="bg-white border border-slate-200 shadow-md rounded-2xl p-8">

          <div className="mb-4">

            <div className="flex items-center justify-between">

              <h3 className="text-xl font-semibold text-slate-900">
                Your Answer
              </h3>

              {currentQuestion.type ===
                "codingQuestions" && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  Coding Question
                </span>
              )}

            </div>

            <p className="text-sm text-slate-500 mt-1">
              {currentQuestion.type ===
              "codingQuestions"
                ? "Write your solution below."
                : "Type your answer below. You can edit it before moving to the next question."}
            </p>

          </div>

          {/* ================= TEXTAREA ================= */}

          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            placeholder={
              currentQuestion.type ===
              "codingQuestions"
                ? "Write your code or solution here..."
                : "Type your answer here..."
            }
            className={`w-full min-h-[220px] rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 resize-none text-base p-4 outline-none transition ${
              currentQuestion.type ===
              "codingQuestions"
                ? "font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                : "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />

          {/* ================= BUTTONS ================= */}

          <div className="flex justify-between items-center mt-6">

            {/* Previous */}

            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={handlePrevious}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Previous
            </Button>

            {/* Next */}

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm"
            >
              {currentIndex ===
              questions.length - 1
                ? "Finish Interview"
                : "Save & Next"}
            </Button>

          </div>

        </Card>

      </main>
    </div>
  );
};

export default InterviewQuestionPage;