import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewByID } from "@/api/mockinterview.api";
import { generateReview } from "@/api/gemini.api";
import Loader from "@/components/Loader/Loader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { MockInterview, Notification } from "@/vite-env";
import {
  CheckCircle,
  Sparkles,
  Clock3,
  BrainCircuit,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const InterviewCompletedPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [generatingReview, setGeneratingReview] = useState(true);
  const [interview, setInterview] = useState<MockInterview | null>(null);

  useEffect(() => {
    const completeInterview = async () => {
      try {
        if (!id) {
          throw new Error("Interview ID is missing");
        }

        const interviewData = await getInterviewByID(id);

        setInterview(interviewData);
        setLoading(false);

        setGeneratingReview(true);

        await generateReview({
          InterviewDetailsObject: interviewData,
        });

        setGeneratingReview(false);

        addNotification({
          id: Date.now().toString(),
          type: "success",
          message: "Your interview performance has been evaluated!",
        });
      } catch (error) {
        console.error("Error completing interview:", error);

        const notification: Notification = {
          id: Date.now().toString(),
          type: "error",
          message: "Unable to generate interview review",
        };

        addNotification(notification);

        setGeneratingReview(false);
        setLoading(false);
      }
    };

    completeInterview();
  }, [id]);

  /*
   * Loading interview
   */
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative">
          <Loader />
        </div>
      </div>
    );
  }

  /*
   * AI is generating the review
   */
  if (generatingReview) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-6 py-10">
        {/* Background glow */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

        <Card className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 text-center text-slate-900 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl">
          {/* Gradient accent */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

          <div className="p-10 sm:p-14 lg:p-16">
            {/* AI Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-indigo-300/30 blur-xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200">
                  <BrainCircuit className="h-12 w-12 text-white" />
                </div>

                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                  <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mx-auto max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <Sparkles className="h-4 w-4" />
                AI Performance Analysis
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Interview Completed
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                Your answers have been submitted successfully. PREP-AI is now
                analyzing your interview performance.
              </p>
            </div>

            {/* Loading Status */}
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Loader />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-900">
                    AI is analyzing your performance...
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Reviewing your answers and preparing your feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              This may take a few seconds.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * Review successfully generated
   */
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-6 py-10 lg:px-12">
      {/* Background decorations */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />

      <Card className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white/95 text-center text-slate-900 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl">
        {/* Gradient header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 px-8 py-10 text-white sm:px-12">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-purple-300/20 blur-2xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
              PREP-AI
            </p>

            <p className="mt-2 text-sm text-indigo-100/90">
              AI-Powered Interview Preparation
            </p>
          </div>
        </div>

        <div className="p-10 sm:p-14 lg:p-16">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-200/50 blur-xl" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-green-100 ring-8 ring-emerald-50">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Interview Completed!
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Your interview has been successfully evaluated by AI. Your
            personalized performance review is ready.
          </p>

          {/* Interview Information */}
          {interview?.duration && (
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/70 p-6 shadow-sm">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Clock3 className="h-6 w-6" />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-slate-500">
                    Interview Duration
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {interview.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-4">
            <Button
              onClick={() => navigate(`/interviewdetails/${id}`)}
              className="group h-13 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-200"
            >
              <span>View Performance Review</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="h-13 w-full rounded-xl border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>

          {/* Bottom status */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            AI evaluation completed successfully
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InterviewCompletedPage;