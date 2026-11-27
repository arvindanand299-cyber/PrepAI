"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Monitor,
  StopCircle,
  Download,
  Trash2,
  Circle,
  Video,
} from "lucide-react";

export function ScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setShowDownloadDialog(true);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
      setIsRecording(false);

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          alert(
            "Screen recording permission was denied. Please allow access to your screen to record."
          );
        } else if (error.name === "NotFoundError") {
          alert(
            "No screen sharing source was found. Please make sure you have a display to share."
          );
        } else if (error.name === "NotReadableError") {
          alert(
            "Could not access your screen. Please check your hardware and try again."
          );
        } else {
          alert(
            `An error occurred while trying to start screen recording: ${error.message}`
          );
        }
      } else {
        alert(
          "An unexpected error occurred while trying to start screen recording. Please try again."
        );
      }
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Error stopping screen recording:", error);
      setError(
        "An error occurred while trying to stop screen recording. Please try again."
      );
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(chunksRef.current, {
      type: "video/webm",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    setShowDownloadDialog(false);
  };

  const discardRecording = () => {
    chunksRef.current = [];
    setShowDownloadDialog(false);
  };

  return (
    <>
      {/* Recording Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        className={
          isRecording
            ? "mr-2 border-red-200 bg-red-50 text-red-600 shadow-sm hover:border-red-300 hover:bg-red-100 hover:text-red-700"
            : "mr-2 border-indigo-200 bg-white text-indigo-600 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        }
      >
        {isRecording ? (
          <>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording

            <Circle className="ml-2 h-2.5 w-2.5 fill-red-500 text-red-500" />
          </>
        ) : (
          <>
            <Monitor className="mr-2 h-4 w-4" />
            Record Screen
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Download Dialog */}
      <AlertDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
      >
        <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl">

          {/* Header Accent */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

          <div className="p-6">
            <AlertDialogHeader>
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Video className="h-6 w-6" />
              </div>

              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                Screen Recording Completed
              </AlertDialogTitle>

              <AlertDialogDescription className="pt-1 leading-6 text-slate-500">
                Your interview screen recording is ready. Would you like to
                download it or discard it?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 gap-2 sm:gap-2">
              <AlertDialogCancel
                onClick={discardRecording}
                className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Discard
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={downloadRecording}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}