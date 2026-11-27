"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Camera,
  SquareMIcon as MicSquare,
  Power,
  Video,
  VideoOff,
} from "lucide-react";
import { Timer } from "./InterviewInterface/Timer";
import { ExitButton } from "./InterviewInterface/ExitButton";
import { ScreenRecorder } from "./InterviewInterface/ScreenRecorder";
import { useNavigate } from "react-router-dom";
import AudioVisualizer from "@/components/InterviewInterface/AudioVisualizer";
import { MockInterview, Question } from "@/vite-env";
import CodeEditor from "./CodeEdior/CodeEditor";
import Loader from "./Loader/Loader";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { Notification } from "@/vite-env";
import { generateReview } from "@/api/gemini.api";

interface InterviewInterfaceProps {
  interviewDetails: MockInterview;
}

interface QuestionWithType extends Question {
  type: "coreSubjectQuestions" | "technicalQuestions" | "dsaQuestions" | "codingQuestions";
}

const InterviewInterface: React.FC<InterviewInterfaceProps> = ({
  interviewDetails,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isInterviewStarted, setIsInterviewStarted] = useState(!false);
  const [showDialog, setShowDialog] = useState(!true);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const [Questions, setQuestions] = useState<QuestionWithType[]>([]);
  const maxQuestions = Questions.length || 0;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCurrentAnswerSaved, setIsCurrentAnswerSaved] = useState(false);

  const AZURE_SUBSCRIPTION_KEY = import.meta.env.VITE_AZURE_SUBSCRIPTION_KEY;
  const AZURE_REGION = import.meta.env.VITE_AZURE_REGION;

  const [transcript, setTranscript] = useState(
    "Speech-to-text content will appear here.."
  );

  const [partialTranscript, setPartialTranscript] = useState("");
  // const [language, setLanguage] = useState("en-US");
  const language = "en-US";
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);

  const [codeResponse, setCodeResponse] = useState("");
  const [savedInterviewData, setSavedInterviewData] =
    useState<MockInterview>(interviewDetails);

  const { addNotification } = useNotification();

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleSetNextQuestion = async () => {
    if (isCurrentAnswerSaved) {
      if (currentQuestion < maxQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // console.log(interviewDetails);
        setTranscript("");
        setPartialTranscript("");
        setCodeResponse("");
        setIsCurrentAnswerSaved(false);
      } else {
        // console.log(interviewDetails);
        try {
          setLoading(true);
          const generateReviewResponse = await generateReview({
            InterviewDetailsObject: savedInterviewData,
          });
          if (generateReviewResponse) {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error(error);
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: "error",
            message: "Failed to generate review",
          };
          addNotification(newNotification);
        }
      }
    } else {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "error",
        message: "Saved Current Response to move to next Question",
      };
      addNotification(newNotification);
    }
  };

  // const handleSetPreviousQuestion = () => {
  //   if (currentQuestion > 0) {
  //     setCurrentQuestion(currentQuestion - 1);
  //   }
  // };

  const startRecognition = () => {
    if (!AZURE_SUBSCRIPTION_KEY || !AZURE_REGION) {
      alert("Azure credentials are missing.");
      return;
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      AZURE_SUBSCRIPTION_KEY,
      AZURE_REGION
    );
    speechConfig.speechRecognitionLanguage = language;

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    recognizerRef.current = recognizer;

    setIsCurrentAnswerSaved(false);
    setTranscript("");
    setPartialTranscript("");
    // setIsListening(true);

    recognizer.recognizing = (sender, event) => {
      sender;

      setPartialTranscript(event.result.text);
    };

    recognizer.recognized = (sender, event) => {
      sender;
      if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        let finalText = event.result.text;
        // if (language === "hi-IN") {
        //   console.log("Transliterating Hindi text...");
        //   finalText = transliterate(finalText);
        // }
        setIsCurrentAnswerSaved(false);
        setTranscript((prev) => `${prev} ${finalText}`.trim());
        setPartialTranscript("");
      }
    };

    recognizer.startContinuousRecognitionAsync();
  };

  const stopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        recognizerRef.current?.close();
        recognizerRef.current = null;
        // setIsListening(false);
      });
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      startRecognition();
    } else {
      setIsRecording(false);
      stopRecognition();
    }
  };

  const handleEditorOpen = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  useEffect(() => {
    const handleQuestions = async () => {
      const coreSubjectQuestions =
        interviewDetails.coreSubjectQuestions?.map((q) => ({
          ...q,
          type: "coreSubjectQuestions" as const,
        })) || [];

      const technicalQuestions =
        interviewDetails.technicalQuestions?.map((q) => ({
          ...q,
          type: "technicalQuestions" as const,
        })) || [];

      const dsaQuestions =
        interviewDetails.dsaQuestions?.map((q) => ({
          ...q,
          type: "dsaQuestions" as const,
        })) || [];

      const codingQuestions =
        (interviewDetails as any).codingQuestions?.map((q: any) => ({
          ...q,
          type: "codingQuestions" as const,
        })) || [];

      const allQuestions: QuestionWithType[] = [
        ...technicalQuestions,
        ...coreSubjectQuestions,
        ...dsaQuestions,
        ...codingQuestions,
      ];
      console.log("========== INTERVIEW DATA ==========");
console.log("DSA:", dsaQuestions.length);
console.log("Technical:", technicalQuestions.length);
console.log("Core:", coreSubjectQuestions.length);
console.log("Coding:", codingQuestions.length);
console.log(
  "TOTAL:",
  dsaQuestions.length +
    technicalQuestions.length +
    coreSubjectQuestions.length +
    codingQuestions.length
);
console.log("Full interviewDetails:", interviewDetails);
console.log("====================================");

      // console.log(allQuestions);
      setQuestions(allQuestions);
      setLoading(false);
    };

    handleQuestions();
  }, []);

  const handleSaveResponse = () => {
    const allResponse = `Text Response: ${transcript}\nCode Response: ${codeResponse}`;
    const currentQuestionObj = Questions[currentQuestion];
    const category = currentQuestionObj.type;

    if (category === "technicalQuestions") {
      const updatedTechnicalQuestions = (
        savedInterviewData as any
      ).technicalQuestions.map((q: Question) => {
        if (q.question === currentQuestionObj.question) {
          return { ...q, answer: allResponse };
        }
        return q;
      });

      setSavedInterviewData((prevDetails) => ({
        ...prevDetails,
        technicalQuestions: updatedTechnicalQuestions,
      }));
    } else if (category === "coreSubjectQuestions") {
      const updatedCoreSubjectQuestions = (
        savedInterviewData as any
      ).coreSubjectQuestions.map((q: Question) => {
        if (q.question === currentQuestionObj.question) {
          return { ...q, answer: allResponse };
        }
        return q;
      });

      setSavedInterviewData((prevDetails) => ({
        ...prevDetails,
        coreSubjectQuestions: updatedCoreSubjectQuestions,
      }));
    } else if (category === "dsaQuestions") {
      const updatedDsaQuestions = (savedInterviewData as any).dsaQuestions.map(
        (q: Question) => {
          if (q.question === currentQuestionObj.question) {
            return { ...q, answer: allResponse };
          }
          return q;
        }
      );

      setSavedInterviewData((prevDetails) => ({
        ...prevDetails,
        dsaQuestions: updatedDsaQuestions,
      }));
    } else if (category === "codingQuestions") {
      const updatedCodingQuestions =
        ((savedInterviewData as any).codingQuestions || []).map(
          (q: any) => {
            if (q.question === currentQuestionObj.question) {
              return { ...q, answer: codeResponse, code: codeResponse };
            }
            return q;
          }
        );

      setSavedInterviewData((prevDetails) => ({
        ...prevDetails,
        codingQuestions: updatedCodingQuestions,
      } as MockInterview));
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "info",
      message: "Saved Successfully",
    };
    addNotification(newNotification);
    setIsCurrentAnswerSaved(true);
    // Optionally, you can add a notification or log to confirm the save
    // console.log(`Response saved for ${category}`);
    // console.log(savedInterviewData);
  };

  if (!isInterviewStarted)
    return (
      <div className="">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Interview</DialogTitle>
            </DialogHeader>
            <p>Do you want to start the interview?</p>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => navigate("/dashboard")}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  console.log("Interview is started");
                  setIsInterviewStarted(true);
                  setShowDialog(false);
                }}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );

  if (loading)
    return (
      <div className="">
        <Loader />
      </div>
    );
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-[#4AE087] via-[#84B7D4] to-[#9D7AEA] bg-clip-text text-transparent">
            AI-Powered
          </span>
          <span className="text-white"> Mock Interview</span>
        </h1>
        <div className="flex items-center">
          <ScreenRecorder />
          <Button
            className="h-[35px]"
            variant="outline"
            onClick={handleEditorOpen}
          >{`${
            isEditorOpen ? "Close Code Editor" : "Open Code Editor"
          }`}</Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Question and Response Area */}
        <div className="space-y-6">
          {Questions.length > 0 && (
            <>
              <Card className="p-6 bg-zinc-800/50 border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Question {currentQuestion + 1} of {maxQuestions}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm">
                    {Questions[currentQuestion].type === "codingQuestions"
                      ? "Coding"
                      : Questions[currentQuestion].type === "dsaQuestions"
                      ? "DSA"
                      : Questions[currentQuestion].type === "technicalQuestions"
                      ? "Technical"
                      : "Core"}
                  </span>
                </div>

                {Questions[currentQuestion].type === "codingQuestions" ? (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {(Questions[currentQuestion] as any).title || "Coding Problem"}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 rounded bg-zinc-700 text-zinc-200 text-sm">
                          Technology: {(Questions[currentQuestion] as any).technology || "Programming"}
                        </span>
                        <span className="px-3 py-1 rounded bg-zinc-700 text-zinc-200 text-sm">
                          Difficulty: {(Questions[currentQuestion] as any).difficulty || "Medium"}
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-200 whitespace-pre-wrap">
                      {Questions[currentQuestion].question}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-zinc-900/70 p-4">
                        <h4 className="font-semibold text-white mb-2">Input Format</h4>
                        <p className="text-zinc-400 whitespace-pre-wrap">
                          {(Questions[currentQuestion] as any).inputFormat || "Not specified"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-zinc-900/70 p-4">
                        <h4 className="font-semibold text-white mb-2">Output Format</h4>
                        <p className="text-zinc-400 whitespace-pre-wrap">
                          {(Questions[currentQuestion] as any).outputFormat || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {Array.isArray((Questions[currentQuestion] as any).examples) &&
                      (Questions[currentQuestion] as any).examples.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">Examples</h4>
                          <div className="space-y-2">
                            {(Questions[currentQuestion] as any).examples.map(
                              (example: any, index: number) => (
                                <div key={index} className="rounded-lg bg-zinc-950 p-3 font-mono text-sm">
                                  <div className="text-zinc-400">
                                    Input: <span className="text-white">{example.input}</span>
                                  </div>
                                  <div className="text-zinc-400 mt-1">
                                    Output: <span className="text-white">{example.output}</span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div>
                      <h4 className="font-semibold text-white mb-2">Your Code</h4>
                      <textarea
                        value={codeResponse}
                        onChange={(e) => {
                          setCodeResponse(e.target.value);
                          setIsCurrentAnswerSaved(false);
                        }}
                        placeholder={`Write your ${(Questions[currentQuestion] as any).technology || "programming"} solution here...`}
                        className="w-full min-h-[260px] rounded-lg bg-zinc-950 border border-zinc-700 text-white p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-300 whitespace-pre-wrap">
                    {Questions[currentQuestion].question}
                  </p>
                )}

                <div className="w-full mt-5 flex justify-end">
                  <div className="gap-2">
                    <Button
                      onClick={handleSaveResponse}
                      className={`mt-2 ${isCurrentAnswerSaved ? "bg-amber-900" : "bg-amber-600"} mr-2`}
                    >
                      {isCurrentAnswerSaved ? "Saved" : "Save Response"}
                    </Button>
                    <Button
                      onClick={handleSetNextQuestion}
                      className={`mt-2 ${currentQuestion === maxQuestions - 1 ? "bg-gray-700" : "bg-green-600"} hover:bg-green-800`}
                    >
                      {currentQuestion === maxQuestions - 1 ? "Submit" : "Next"}
                    </Button>
                  </div>
                </div>
              </Card>

              {Questions[currentQuestion].type !== "codingQuestions" && (
                <>
                  <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[200px]">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Text Response</h2>
                    <div className="text-zinc-400 italic whitespace-pre-wrap">
                      {transcript || "Record your answer using the Record button."}
                    </div>
                  </Card>
                  <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[150px]">
                    <h2 className="text-xl font-semibold text-white mb-4">Code Submission</h2>
                    <textarea
                      value={codeResponse}
                      onChange={(e) => setCodeResponse(e.target.value)}
                      placeholder="Optional code response..."
                      className="w-full min-h-[120px] bg-zinc-800 text-white p-3 rounded"
                    />
                  </Card>
                </>
              )}
            </>
          )}
        </div>

        {/* Right Side - Camera and Controls */}
        <div className="space-y-4">
          <Card className="aspect-video relative bg-zinc-800/50 border-zinc-700 overflow-hidden">
            {isCameraOn && hasPermission ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                {hasPermission === false ? (
                  <p className="text-red-500">Camera permission denied</p>
                ) : (
                  <Camera className="w-16 h-16 text-zinc-600" />
                )}
              </div>
            )}
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              variant={isCameraOn ? "default" : "destructive"}
              size="lg"
              onClick={toggleCamera}
              className="w-40"
            >
              {isCameraOn ? (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Camera On
                </>
              ) : (
                <>
                  <VideoOff className="mr-2 h-4 w-4" />
                  Camera Off
                </>
              )}
            </Button>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="lg"
              onClick={handleRecording}
              className="w-40"
            >
              {isRecording ? (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <MicSquare className="mr-2 h-4 w-4" />
                  Record
                </>
              )}
            </Button>
          </div>
          <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[70px]">
            <div className="text-zinc-400">{partialTranscript}</div>
          </Card>
          <Card className="p-6 bg-zinc-800/50 border-zinc-700 min-h-[70px]">
            {isRecording && <AudioVisualizer />}
          </Card>
        </div>
      </div>
      <Timer duration={interviewDetails.duration} />
<ExitButton />
      <ExitButton />
      {isEditorOpen && <CodeEditor />}
    </div>
  );
};

export default InterviewInterface;
