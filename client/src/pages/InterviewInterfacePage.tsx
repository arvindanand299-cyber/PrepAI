import { editInterview, getInterviewByID } from "@/api/mockinterview.api";
import InterviewInterface from "@/components/InterviewInterface";
import Loader from "@/components/Loader/Loader";
import { useEffect, useState } from "react";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { MockInterview, Notification } from "@/vite-env";
import { useParams } from "react-router-dom";
import { generateQuestions } from "@/api/gemini.api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InterviewInstructions from "@/components/InterviewInterface/InterviewInstructionsComponent";
import {
  Maximize,
  ShieldCheck,
  Sparkles,
  Monitor,
} from "lucide-react";

const InterviewInterfacePage = () => {
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const [interviewData, setInterviewData] =
    useState<MockInterview>();

  const [isFullScreen, setIsFullScreen] =
    useState<boolean>(!!document.fullscreenElement);

  const [isInterviewStarted, setIsInterviewStarted] =
    useState(false);

  // ==========================================
  // LOAD INTERVIEW + GENERATE QUESTIONS
  // ==========================================

  useEffect(() => {
    const startInterview = async () => {
      try {
        if (!id) {
          throw new Error("Interview ID is missing");
        }

        const formData = {
          interviewID: id,
        };

        // Get interview from database
        const interviewData =
          await getInterviewByID(id);

        // Generate all interview questions
        const response =
          await generateQuestions(formData);

        console.log(
          "Generated DSA questions:",
          response.data.dsaQuestions
        );

        console.log(
          "Generated Technical questions:",
          response.data.techStackQuestions
        );

        console.log(
          "Generated Core questions:",
          response.data.coreSubjectQuestions
        );

        console.log(
          "Generated Coding questions:",
          response.data.codingQuestions
        );

        // ==========================================
        // SAVE GENERATED QUESTIONS
        // ==========================================

        interviewData.dsaQuestions =
          response.data.dsaQuestions;

        interviewData.coreSubjectQuestions =
          response.data.coreSubjectQuestions;

        interviewData.technicalQuestions =
          response.data.techStackQuestions;

        // IMPORTANT:
        // Save coding questions too
        interviewData.codingQuestions =
          response.data.codingQuestions || [];

        // Reset review
        interviewData.overallRating = 0;
        interviewData.overallReview = "";

        // ==========================================
        // DEBUG TOTAL
        // ==========================================

        const totalQuestions =
          (interviewData.dsaQuestions?.length || 0) +
          (interviewData.technicalQuestions?.length || 0) +
          (interviewData.coreSubjectQuestions?.length || 0) +
          (interviewData.codingQuestions?.length || 0);

        console.log(
          "======================================"
        );

        console.log(
          "DSA:",
          interviewData.dsaQuestions?.length || 0
        );

        console.log(
          "Technical:",
          interviewData.technicalQuestions?.length || 0
        );

        console.log(
          "Core:",
          interviewData.coreSubjectQuestions?.length || 0
        );

        console.log(
          "Coding:",
          interviewData.codingQuestions?.length || 0
        );

        console.log(
          "TOTAL QUESTIONS:",
          totalQuestions
        );

        console.log(
          "======================================"
        );

        // ==========================================
        // SAVE TO DATABASE
        // ==========================================

        const editedInterview =
          await editInterview(
            id,
            interviewData
          );

        setInterviewData(editedInterview);

        // Enter fullscreen
        enterFullScreen();

        setLoading(false);
      } catch (error) {
        console.error(
          "Error starting interview:",
          error
        );

        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "error",
          message: "Interview not found",
        };

        addNotification(newNotification);

        setTimeout(() => {
          window.location.href = "/dashboard";
          setLoading(false);
        }, 5000);
      }
    };

    startInterview();
  }, [id, addNotification]);

  // ==========================================
  // FULLSCREEN LISTENER
  // ==========================================

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(
        !!document.fullscreenElement
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullScreenChange
    );

    document.addEventListener(
      "webkitfullscreenchange",
      handleFullScreenChange
    );

    document.addEventListener(
      "mozfullscreenchange",
      handleFullScreenChange
    );

    document.addEventListener(
      "MSFullscreenChange",
      handleFullScreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );

      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );

      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );

      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);

  // ==========================================
  // ENTER FULLSCREEN
  // ==========================================

  const enterFullScreen = () => {
    const elem =
      document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const handleStartInterview = () => {
    enterFullScreen();
    setIsInterviewStarted(true);
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">

        {/* Background glows */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <Loader />
        </div>

      </div>
    );
  }

  // ==========================================
  // INTERVIEW INSTRUCTIONS
  // ==========================================

  if (!isInterviewStarted) {
    return (
      <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">

        {/* Background glows */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/30 blur-3xl" />

        {/* Subtle grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative z-10 w-full">
          <InterviewInstructions
            onStartInterview={handleStartInterview}
          />
        </div>

      </div>
    );
  }

  // ==========================================
  // ACTIVE INTERVIEW
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-200/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/10 blur-3xl" />

      </div>

      {/* ======================================
          FULLSCREEN WARNING
      ====================================== */}

      {!isFullScreen && (
        <div className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950/80 px-4 backdrop-blur-lg">

          {/* Background glows */}

          <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

          {/* Warning Card */}

          <Card className="relative mx-4 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-900 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

            <div className="p-7 sm:p-10">

              {/* Icon */}

              <div className="mb-7 flex justify-center">
                <div className="relative">

                  <div className="absolute inset-0 rounded-3xl bg-indigo-400/30 blur-2xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/30">
                    <Maximize className="h-9 w-9 text-white" />
                  </div>

                </div>
              </div>

              {/* Badge */}

              <div className="mb-5 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Fullscreen Required
                </div>
              </div>

              {/* Heading */}

              <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Return to Fullscreen
              </h2>

              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-6 text-slate-500 sm:text-base">
                Your interview requires fullscreen mode
                to provide a focused and secure interview
                environment.
              </p>

              {/* Information */}

              <div className="mt-7 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-indigo-100">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Interview paused
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Re-enter fullscreen mode to continue
                      your interview.
                    </p>
                  </div>

                </div>

              </div>

              {/* Button */}

              <Button
                type="button"
                onClick={enterFullScreen}
                className="mt-7 h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              >
                <Maximize className="mr-2 h-5 w-5" />
                Enter Fullscreen
              </Button>

              {/* Security note */}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />

                <span>
                  PREP-AI secure interview environment
                </span>
              </div>

            </div>

          </Card>
        </div>
      )}

      {/* ======================================
          INTERVIEW INTERFACE
      ====================================== */}

      {!loading && interviewData && (
        <div className="relative z-10">
          <InterviewInterface
            interviewDetails={interviewData}
          />
        </div>
      )}

    </div>
  );
};

export default InterviewInterfacePage;