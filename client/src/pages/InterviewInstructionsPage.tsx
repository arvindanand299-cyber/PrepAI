import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader/Loader";

import {
  getInterviewByID,
  editInterview,
} from "@/api/mockinterview.api";

import { generateQuestions } from "@/api/gemini.api";
import { useNotification } from "@/components/Notifications/NotificationContext";

import {
  MockInterview,
  Notification,
} from "@/vite-env";

import {
  Clock,
  Briefcase,
  Building2,
  Code2,
  Play,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

const InterviewInstructionsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const [interview, setInterview] =
    useState<MockInterview | null>(null);

  // ==========================================
  // LOAD INTERVIEW
  // ==========================================

  useEffect(() => {
    const loadInterview = async () => {
      try {
        if (!id) {
          throw new Error("Interview ID is missing");
        }

        const data = await getInterviewByID(id);

        if (!data) {
          throw new Error("Interview not found");
        }

        setInterview(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading interview:", error);

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
  }, [id, navigate, addNotification]);

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const handleStartInterview = async () => {
    if (!id || !interview) {
      return;
    }

    if (starting) {
      return;
    }

    try {
      setStarting(true);

      console.log("=======================================");
      console.log("Starting interview...");
      console.log("Interview ID:", id);
      console.log("Duration:", interview.duration || 20);

      // ======================================
      // Generate Questions
      // ======================================

      console.log("Generating questions...");

      const response = await generateQuestions({
        interviewID: id,
      });

      console.log("Gemini response:", response.data);

      // ======================================
      // Extract Questions
      // ======================================

      const dsaQuestions =
        response.data?.dsaQuestions || [];

      const technicalQuestions =
        response.data?.techStackQuestions || [];

      const coreSubjectQuestions =
        response.data?.coreSubjectQuestions || [];

      const codingQuestions =
        response.data?.codingQuestions || [];

      const totalQuestions =
        dsaQuestions.length +
        technicalQuestions.length +
        coreSubjectQuestions.length +
        codingQuestions.length;

      console.log(
        "DSA Questions:",
        dsaQuestions.length
      );

      console.log(
        "Technical Questions:",
        technicalQuestions.length
      );

      console.log(
        "Core Questions:",
        coreSubjectQuestions.length
      );

      console.log(
        "Total Questions:",
        totalQuestions
      );

      console.log(
        "Coding Questions:",
        codingQuestions.length
      );

      // ======================================
      // Make sure questions exist
      // ======================================

      if (totalQuestions === 0) {
        throw new Error(
          "Gemini did not generate any interview questions"
        );
      }

      // ======================================
      // Save Questions
      // ======================================

      const updatedInterview: MockInterview = {
        ...interview,

        dsaQuestions,

        technicalQuestions,

        coreSubjectQuestions,

        codingQuestions,

        overallRating: 0,

        overallReview: "",
      };

      console.log(
        "Saving questions to database..."
      );

      const savedInterview = await editInterview(
        id,
        updatedInterview
      );

      console.log(
        "Interview saved:",
        savedInterview
      );

      // ======================================
      // Success notification
      // ======================================

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Interview started successfully",
      });

      console.log("Moving to Question 1...");
      console.log("=======================================");

      // ======================================
      // GO TO QUESTION 1
      // ======================================

      navigate(`/interview/${id}/question/1`);
    } catch (error: any) {
      console.error(
        "======================================="
      );

      console.error(
        "ERROR STARTING INTERVIEW:",
        error
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      console.error(
        "======================================="
      );

      addNotification({
        id: Date.now().toString(),
        type: "error",
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to start interview",
      });

      setStarting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative z-10">
          <Loader />
        </div>
      </div>
    );
  }

  // ==========================================
  // NO INTERVIEW
  // ==========================================

  if (!interview) {
    return null;
  }

  // ==========================================
  // DURATION
  // ==========================================

  const duration = interview.duration || 20;

  // ==========================================
  // QUESTION COUNT
  // ==========================================

  const expectedQuestions =
    duration === 10
      ? 8
      : duration === 30
      ? 22
      : 15;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">

      {/* Background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-purple-200/30 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center">

        <Card className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-indigo-100/50 backdrop-blur-xl">

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 px-6 py-8 text-white sm:px-8 sm:py-10">

            {/* Header glow */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />

            <div className="relative flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
                <BrainCircuit className="h-8 w-8 text-white" />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-100" />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                    PREP-AI
                  </span>
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Ready for Your Interview?
                </h1>

                <p className="mt-1 text-sm text-indigo-100">
                  Review the details before you begin.
                </p>
              </div>
            </div>
          </div>

          {/* ================================= */}
          {/* CONTENT */}
          {/* ================================= */}

          <div className="p-6 sm:p-8">

            {/* ================================= */}
            {/* INTERVIEW DETAILS */}
            {/* ================================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Job Role */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-indigo-200 hover:shadow-md">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Briefcase className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    Job Role
                  </p>
                </div>

                <p className="text-lg font-bold text-slate-900">
                  {interview.jobRole}
                </p>
              </div>

              {/* Experience */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-purple-200 hover:shadow-md">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Code2 className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    Experience Level
                  </p>
                </div>

                <p className="text-lg font-bold text-slate-900">
                  {interview.experienceLevel}
                </p>
              </div>

              {/* Company */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-blue-200 hover:shadow-md">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    Target Company
                  </p>
                </div>

                <p className="text-lg font-bold text-slate-900">
                  {interview.targetCompany}
                </p>
              </div>

              {/* Duration */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-amber-200 hover:shadow-md">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    Interview Duration
                  </p>
                </div>

                <p className="text-lg font-bold text-slate-900">
                  {duration} Minutes
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Approximately{" "}
                  {expectedQuestions} questions
                </p>
              </div>
            </div>

            {/* ================================= */}
            {/* SKILLS */}
            {/* ================================= */}

            <div className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 p-5">

              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Technologies & Skills
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Topics that may be covered during your interview
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm sm:flex">
                  <Code2 className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {interview.skills &&
                interview.skills.length > 0 ? (
                  interview.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No skills specified
                  </span>
                )}
              </div>
            </div>

            {/* ================================= */}
            {/* INSTRUCTIONS */}
            {/* ================================= */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50/70">

              <div className="border-b border-indigo-100 px-6 py-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Interview Instructions
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Keep these points in mind during your interview
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 px-6 py-5 text-sm text-slate-600">

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    Answer each question clearly and honestly.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    Your answers will be saved as you move through
                    the interview.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    You can type your answers directly on each
                    question page.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    The interview contains{" "}
                    <span className="font-semibold text-indigo-600">
                      {expectedQuestions} questions
                    </span>
                    .
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    Gemini will evaluate your answers after
                    completion.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <span>
                    You will receive an overall performance review,
                    rating, strengths and areas for improvement.
                  </span>
                </li>
              </ul>
            </div>

            {/* ================================= */}
            {/* START BUTTON */}
            {/* ================================= */}

            <Button
              onClick={handleStartInterview}
              disabled={starting}
              className="mt-7 h-14 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {starting ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />

                  Generating Interview Questions...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Play className="h-5 w-5 fill-current" />

                  Start {duration}-Minute Interview
                </span>
              )}
            </Button>

            {/* ================================= */}
            {/* BACK BUTTON */}
            {/* ================================= */}

            <Button
              variant="ghost"
              disabled={starting}
              onClick={() => navigate("/dashboard")}
              className="mt-3 h-11 w-full rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />

              Back to Dashboard
            </Button>

            {/* Footer note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5" />

              AI-powered interview experience
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewInstructionsPage;