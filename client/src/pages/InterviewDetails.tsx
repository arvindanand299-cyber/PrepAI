import React, { useEffect, useState } from "react";
import { Interview, Question } from "../types/global";
import Rating from "../components/Rating";
import Loader from "../components/Loader/Loader";
import { getInterviewByID } from "@/api/mockinterview.api";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Target,
  TrendingUp,
  Clock3,
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  Sparkles,
  Code2,
  Brain,
  Layers3,
  MessageSquareText,
  CircleCheck,
  AlertCircle,
  FileText,
} from "lucide-react";

type ExtendedInterview = Interview & {
  codingQuestions?: Question[];
};

interface QuestionListProps {
  title: string;
  questions: Question[];
  icon: React.ReactNode;
  accent: string;
  numberColor: string;
}

const QuestionList: React.FC<QuestionListProps> = ({
  title,
  questions,
  icon,
  accent,
  numberColor,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!questions || questions.length === 0) {
    return null;
  }

  const getTextAnswer = (answer?: string) => {
    if (!answer) {
      return "";
    }

    return answer
      .replace("Text Response: ", "")
      .split("\nCode Response:")[0]
      .trim();
  };

  const getCodeAnswer = (answer?: string) => {
    if (!answer || !answer.includes("Code Response:")) {
      return "";
    }

    return answer
      .split("Code Response:")[1]
      ?.trim();
  };

  return (
    <section className="mt-10">
      {/* Section heading */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h3>

            <p className="mt-0.5 text-sm text-slate-500">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, index) => {
          const isOpen = openIndex === index;

          const textAnswer = getTextAnswer(q.answer);
          const codeAnswer = getCodeAnswer(q.answer);

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                isOpen
                  ? "border-indigo-200 shadow-md"
                  : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
              }`}
            >
              {/* Question button */}
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                {/* Number */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${numberColor}`}
                >
                  {index + 1}
                </div>

                {/* Question */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-6 text-slate-800">
                    {q.question}
                  </p>
                </div>

                {/* Chevron */}
                <div
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-indigo-500" : ""
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/70 px-5 pb-5 pt-5">
                  <div className="grid gap-4 lg:grid-cols-2">

                    {/* Candidate answer */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                          <MessageSquareText className="h-4 w-4 text-blue-600" />
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          Your Answer
                        </p>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {textAnswer || "No answer was provided."}
                      </p>
                    </div>

                    {/* AI feedback */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <Sparkles className="h-4 w-4 text-indigo-600" />
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          AI Feedback
                        </p>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {q.review || "No feedback is available yet."}
                      </p>
                    </div>
                  </div>

                  {/* Coding answer */}
                  {codeAnswer && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                        <Code2 className="h-4 w-4 text-indigo-400" />

                        <span className="text-sm font-medium text-slate-200">
                          Submitted Code
                        </span>
                      </div>

                      <pre className="overflow-x-auto p-5 text-sm leading-6 text-slate-300">
                        <code>{codeAnswer}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export function InterviewDetails() {
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] =
    useState<ExtendedInterview>();

  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // LOAD INTERVIEW
  // ==========================================

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await getInterviewByID(id || "");

        setInterview(response);
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            Interview not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We could not find the interview you are trying to
            review.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const rating = interview.overallRating || 0;

  const codingQuestions =
    interview.codingQuestions || [];

  const dsaQuestions =
    interview.dsaQuestions || [];

  const technicalQuestions =
    interview.technicalQuestions || [];

  const coreSubjectQuestions =
    interview.coreSubjectQuestions || [];

  const totalQuestions =
    dsaQuestions.length +
    technicalQuestions.length +
    coreSubjectQuestions.length +
    codingQuestions.length;

  const answeredQuestions = [
    ...dsaQuestions,
    ...technicalQuestions,
    ...coreSubjectQuestions,
    ...codingQuestions,
  ].filter(
    (question) =>
      question.answer &&
      question.answer.trim() !== ""
  ).length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* ======================================
          TOP AREA
      ======================================= */}

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* ====================================
            HEADER
        ===================================== */}

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI Interview Review
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {interview.jobRole} Interview
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Review your answers, AI feedback, and overall
                interview performance.
              </p>

            </div>

            {/* Experience */}
            <div className="w-fit rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3">
              <p className="text-xs font-medium text-indigo-500">
                Experience Level
              </p>

              <p className="mt-1 text-sm font-semibold text-indigo-700">
                {interview.experienceLevel}
              </p>
            </div>

          </div>

          {/* Basic information */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Company */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Target Company
              </p>

              <p className="mt-1 text-base font-semibold capitalize text-slate-900">
                {interview.targetCompany || "Not specified"}
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Clock3 className="h-4 w-4 text-blue-600" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Interview Duration
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {interview.duration || "-"} minutes
              </p>
            </div>

            {/* Questions */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Questions Reviewed
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {answeredQuestions}/{totalQuestions}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================
            SCORE HERO
        ===================================== */}

        <div className="relative mb-6 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm sm:p-8">

          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="relative">

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Overall Performance
                </h2>

                <p className="text-sm text-slate-500">
                  Your AI-generated interview assessment
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-center">

              {/* Score */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-white/80 p-6">

                <p className="text-6xl font-bold tracking-tight text-slate-900">
                  {rating}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  out of 5
                </p>

              </div>

              {/* Review */}
              <div>

                <Rating
                  experienceLevel={
                    interview.experienceLevel || ""
                  }
                  rating={rating}
                />

                <div className="mt-5 rounded-2xl border border-indigo-100 bg-white/70 p-5">

                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />

                    <span className="text-sm font-semibold text-slate-900">
                      AI Summary
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-600">
                    {interview.overallReview ||
                      "No overall review is available yet."}
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ====================================
            STRENGTHS + IMPROVEMENTS
        ===================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Strengths */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Strengths
                </h2>

                <p className="text-sm text-slate-500">
                  What you should continue building on
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Review your answers marked positively by the AI.
                </p>
              </div>

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Continue developing clear technical
                  understanding and problem-solving skills.
                </p>
              </div>

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Keep practicing the topics where your
                  answers received positive feedback.
                </p>
              </div>

            </div>

          </div>

          {/* Areas to improve */}
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 sm:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                <Target className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Areas to Improve
                </h2>

                <p className="text-sm text-slate-500">
                  Focus areas for your next interview
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Review questions where AI feedback indicates
                  missing or incomplete information.
                </p>
              </div>

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Practice explaining technical concepts with
                  examples and edge cases.
                </p>
              </div>

              <div className="flex gap-3 rounded-xl bg-white/70 p-4">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Improve answers that were unclear or incomplete.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ====================================
            DETAILED AI REVIEW
        ===================================== */}

        <section className="mt-10">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Detailed AI Review
              </h2>

              <p className="text-sm text-slate-500">
                A detailed summary of your interview performance
              </p>
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {interview.overallReview ||
                "No detailed review is available yet."}
            </p>

          </div>

        </section>

        {/* ====================================
            QUESTION REVIEW
        ===================================== */}

        <div className="mt-12">

          <div className="mb-2">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Question Review
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Open any question to review your answer and
              AI-generated feedback.
            </p>
          </div>

          {/* DSA */}
          <QuestionList
            title="DSA Questions"
            questions={dsaQuestions}
            icon={
              <Brain className="h-5 w-5 text-indigo-600" />
            }
            accent="bg-indigo-50"
            numberColor="bg-indigo-50 text-indigo-600"
          />

          {/* Technical */}
          <QuestionList
            title="Technical Questions"
            questions={technicalQuestions}
            icon={
              <Layers3 className="h-5 w-5 text-blue-600" />
            }
            accent="bg-blue-50"
            numberColor="bg-blue-50 text-blue-600"
          />

          {/* Core */}
          <QuestionList
            title="Core Subject Questions"
            questions={coreSubjectQuestions}
            icon={
              <BriefcaseBusiness className="h-5 w-5 text-emerald-600" />
            }
            accent="bg-emerald-50"
            numberColor="bg-emerald-50 text-emerald-600"
          />

          {/* Coding */}
          <QuestionList
            title="Coding Questions"
            questions={codingQuestions}
            icon={
              <Code2 className="h-5 w-5 text-purple-600" />
            }
            accent="bg-purple-50"
            numberColor="bg-purple-50 text-purple-600"
          />

        </div>

        {/* ====================================
            BOTTOM ACTION
        ===================================== */}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Ready for another attempt?
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Keep practicing to improve your interview performance.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}

export default InterviewDetails;