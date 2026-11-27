import React, { useEffect, useState } from "react";
import InterviewCard from "../components/InterviewCard";
import Loader from "../components/Loader/Loader";
import Hero from "../components/Hero";

import { getAllInterviews } from "@/api/mockinterview.api";
import Navbar from "@/components/Navbar";
import { getUser } from "@/api/user.api";

import { useNotification } from "@/components/Notifications/NotificationContext";
import { Notification } from "@/vite-env";
import { useNavigate } from "react-router-dom";

import {
  Brain,
  Trophy,
  Code2,
  TrendingUp,
  BarChart3,
  History,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        const response = await getAllInterviews();
        setInterviews(response);

        setLoading(false);
      } catch (error) {
        console.error(error);

        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "error",
          message: "Unable to load dashboard",
        };

        addNotification(newNotification);

        navigate("/login");
      }
    };

    loadDashboard();
  }, []);

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
  // STATISTICS
  // ==========================================

  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (interview) =>
      interview.overallRating !== undefined &&
      interview.overallRating !== null &&
      interview.overallRating > 0
  );

  const averageScore =
    completedInterviews.length > 0
      ? (
          completedInterviews.reduce(
            (sum, interview) =>
              sum + Number(interview.overallRating || 0),
            0
          ) / completedInterviews.length
        ).toFixed(1)
      : "0.0";

  const bestScore =
    completedInterviews.length > 0
      ? Math.max(
          ...completedInterviews.map((interview) =>
            Number(interview.overallRating || 0)
          )
        ).toFixed(1)
      : "0.0";

  // IMPORTANT:
  // Count coding questions too.
  const totalQuestions = interviews.reduce((total, interview) => {
    return (
      total +
      (interview.dsaQuestions?.length || 0) +
      (interview.technicalQuestions?.length || 0) +
      (interview.coreSubjectQuestions?.length || 0) +
      (interview.codingQuestions?.length || 0)
    );
  }, 0);

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      <main className="container mx-auto px-4 pb-12 pt-28 md:px-8">

        {/* =====================================
            WELCOME
        ====================================== */}

        <section className="mb-10">

          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />

            <p className="text-sm font-medium tracking-normal text-slate-600">
              Welcome back
            </p>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {user?.name || "Candidate"}
          </h1>

          <p className="mt-2 text-base font-normal leading-6 text-slate-600">
            Prepare smarter. Practice better. Perform with confidence.
          </p>

        </section>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Interviews Taken */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium tracking-normal text-slate-600">
                  Interviews Taken
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {totalInterviews}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>

            </div>

          </div>

          {/* Average Score */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium tracking-normal text-slate-600">
                  Average Score
                </p>

                <h2 className="mt-2 flex items-baseline text-3xl font-bold tracking-tight text-slate-900">
                  {averageScore}

                  <span className="ml-1 text-base font-semibold text-slate-400">
                    /5
                  </span>
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>

            </div>

          </div>

          {/* Best Score */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium tracking-normal text-slate-600">
                  Best Score
                </p>

                <h2 className="mt-2 flex items-baseline text-3xl font-bold tracking-tight text-slate-900">
                  {bestScore}

                  <span className="ml-1 text-base font-semibold text-slate-400">
                    /5
                  </span>
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>

            </div>

          </div>

          {/* Questions Practiced */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium tracking-normal text-slate-600">
                  Questions Practiced
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {totalQuestions}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <Code2 className="h-6 w-6 text-purple-600" />
              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section className="mb-10">

          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm font-normal text-slate-600">
              Start a new interview or review your latest performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Create Interview */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md md:col-span-2">
              <Hero />
            </div>

            {/* Performance Review */}

            <button
              onClick={() => {
                const latestInterview = interviews[0];

                if (latestInterview?._id) {
                  navigate(
                    `/interviewdetails/${latestInterview._id}`
                  );
                }
              }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <BarChart3
                  className="h-6 w-6 text-purple-600"
                />
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Performance Review
              </h3>

              <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                Review your previous interview performance
                and AI feedback.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-purple-600">
                View Review

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>

            </button>

          </div>

        </section>

        {/* =====================================
            PERFORMANCE OVERVIEW
        ====================================== */}

        <section className="mb-10">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Performance Overview
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-600">
                Track your interview preparation progress.
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <BarChart3 className="h-5 w-5 text-slate-500" />
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

              {/* Technical */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-700">
                    Technical
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    Track
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-2 w-[70%] rounded-full bg-blue-500" />
                </div>

              </div>

              {/* DSA */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-700">
                    DSA
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    Track
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-2 w-[60%] rounded-full bg-purple-500" />
                </div>

              </div>

              {/* Core Subjects */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-700">
                    Core Subjects
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    Track
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-2 w-[75%] rounded-full bg-emerald-500" />
                </div>

              </div>

            </div>

            <p className="mt-6 text-xs font-normal leading-5 text-slate-500">
              Detailed performance analysis will appear
              after completing interviews and receiving AI
              feedback.
            </p>

          </div>

        </section>

        {/* =====================================
            RECENT INTERVIEWS
        ====================================== */}

        <section>

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-600">
                Review your previous interview attempts.
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <History className="h-5 w-5 text-slate-500" />
            </div>

          </div>

          {/* No interviews */}

          {interviews.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Brain
                  className="h-7 w-7 text-slate-500"
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No interviews yet
              </h3>

              <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                Start your first mock interview to begin
                tracking your performance.
              </p>

            </div>
          )}

          {/* Interview cards */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {interviews.length > 0 &&
              interviews.map((interview, index) => (
                <InterviewCard
                  key={interview._id || index}
                  interview={interview}
                />
              ))}

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;