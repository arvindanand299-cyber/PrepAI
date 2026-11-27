import { Router } from "express";

import {
  createMockInterview,
  getMockInterviews,
  getMockInterviewById,
  editMockInterview,
  deleteMockInterview,
} from "../controllers/mockinterview.conrollers";

import { asyncHandler } from "../utils/asyncHandler";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// ==========================================
// CREATE INTERVIEW
// POST /mockinterview/create
// ==========================================
router.post(
  "/create",
  asyncHandler(authMiddleware),
  asyncHandler(createMockInterview)
);

// ==========================================
// GET ALL INTERVIEWS
// GET /mockinterview/
// ==========================================
router.get(
  "/",
  asyncHandler(authMiddleware),
  asyncHandler(getMockInterviews)
);

// ==========================================
// GET INTERVIEW BY ID
// GET /mockinterview/:id
// ==========================================
router.get(
  "/:id",
  asyncHandler(authMiddleware),
  asyncHandler(getMockInterviewById)
);

// ==========================================
// EDIT INTERVIEW
// PUT /mockinterview/edit/:id
// ==========================================
router.put(
  "/edit/:id",
  asyncHandler(authMiddleware),
  asyncHandler(editMockInterview)
);

// ==========================================
// DELETE INTERVIEW
// DELETE /mockinterview/delete/:id
// ==========================================
router.delete(
  "/delete/:id",
  asyncHandler(authMiddleware),
  asyncHandler(deleteMockInterview)
);

export default router;