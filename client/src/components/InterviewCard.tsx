import React, { useState } from "react";
import Rating from "./Rating";
import { Interview } from "../types/global";
import { useNavigate } from "react-router-dom";
import { deleteInterview } from "@/api/mockinterview.api";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { Notification } from "@/vite-env";
import { Trash2, X } from "lucide-react";

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // TAKE / CONTINUE INTERVIEW
  // =====================================================

  const handleTakeInterviewClick = () => {
    navigate(`/interview/${interview._id}/instructions`);
  };

  // =====================================================
  // VIEW REVIEW
  // =====================================================

  const handleViewDetailsClick = () => {
    navigate(`/interviewdetails/${interview._id}`);
  };

  // =====================================================
  // DELETE INTERVIEW
  // =====================================================

  const handleDeleteInterview = async () => {
    try {
      setDeleting(true);

      await deleteInterview(interview._id);

      const notification: Notification = {
        id: Date.now().toString(),
        type: "success",
        message: "Interview deleted successfully",
      };

      addNotification(notification);

      setShowDeleteConfirmation(false);

      // Refresh dashboard after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting interview:", error);

      const notification: Notification = {
        id: Date.now().toString(),
        type: "error",
        message: "Failed to delete interview",
      };

      addNotification(notification);

      setDeleting(false);
    }
  };

  return (
    <>
      {/* =====================================================
          INTERVIEW CARD
      ===================================================== */}

      <div className="relative group flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl hover:shadow-lg transition-shadow duration-300">
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <div className="relative h-56 m-2.5 overflow-hidden rounded-lg">
          <img
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform group-hover:scale-110"
            src="/interview1.png"
            alt="Interview"
          />
        </div>

        {/* =====================================================
            INCOMPLETE INTERVIEW OVERLAY

            pointer-events-none allows clicks to pass through
            to View Review / Take Again / Delete Interview.

            Only the Take Interview button receives clicks.
        ===================================================== */}

        {interview.overallRating === 0 && (
          <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-4 rounded-xl pointer-events-none">
            <p className="text-lg font-semibold mb-3 text-center">
              You have not completed the interview
            </p>

            <button
              type="button"
              onClick={handleTakeInterviewClick}
              className="pointer-events-auto bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Take Interview
            </button>
          </div>
        )}

        {/* =====================================================
            DETAILS
        ===================================================== */}

        <div className="p-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h6 className="mb-2 text-slate-900 text-xl font-semibold">
                {interview.jobRole}
              </h6>

              <p className="text-sm text-slate-500">
                {interview.targetCompany}
              </p>
            </div>

            {/* Duration */}

            {interview.duration && (
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full whitespace-nowrap font-medium">
                {interview.duration} min
              </span>
            )}
          </div>

          {/* Review */}

          <p className="text-slate-600 leading-normal font-light mt-3 line-clamp-3">
            {interview.overallReview ||
              "No performance review available yet. Complete the interview to receive your AI performance analysis."}
          </p>
        </div>

        {/* =====================================================
            RATING
        ===================================================== */}

        <div className="px-4 py-4 border-t border-slate-100">
          <Rating
            experienceLevel={interview.experienceLevel}
            rating={interview.overallRating}
          />
        </div>

        {/* =====================================================
            ACTION BUTTONS

            Delete is ALWAYS available.
        ===================================================== */}

        <div className="pt-2 pb-4 px-4 flex flex-col gap-2 rounded-b-xl">
          {/* View Review + Take Again */}

          <div className="flex gap-2">
            {/* View Review */}

            <button
              type="button"
              onClick={handleViewDetailsClick}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              View Review
            </button>

            {/* Take Again */}

            <button
              type="button"
              onClick={handleTakeInterviewClick}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-slate-700 rounded-md hover:bg-slate-800 transition-colors"
            >
              Take Again
            </button>
          </div>

          {/* =====================================================
              DELETE BUTTON

              This is outside the incomplete interview condition,
              so it appears for EVERY interview.
          ===================================================== */}

          <button
            type="button"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={deleting}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 bg-red-50 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete Interview"}
          </button>
        </div>
      </div>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6">
            {/* Close */}

            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={deleting}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Delete Icon */}

            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>

            {/* Title */}

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Delete Interview?
            </h2>

            {/* Description */}

            <p className="text-slate-600 text-sm leading-relaxed">
              Are you sure you want to delete your{" "}
              <span className="text-slate-900 font-medium">
                {interview.jobRole}
              </span>{" "}
              interview?
            </p>

            <p className="text-red-600 text-sm mt-3">
              This action cannot be undone.
            </p>

            {/* =================================================
                MODAL BUTTONS
            ================================================= */}

            <div className="flex gap-3 mt-6">
              {/* Cancel */}

              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-2.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Confirm Delete */}

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteInterview}
                className="flex-1 px-4 py-2.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewCard;