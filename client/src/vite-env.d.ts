/// <reference types="vite/client" />

import { Types } from "mongoose";

export interface Question {
  type: string;
  technology: string;
  question: string;
  answer: string;
  review: string;
}

export interface CodingQuestion extends Question {
  type: "Coding";
  technology: string;
  title: string;
  difficulty: string;
  inputFormat: string;
  outputFormat: string;
  examples: {
    input: string;
    output: string;
  }[];
  code?: string;
}

export type ExperienceLevel =
  | "Fresher"
  | "Junior"
  | "Mid-Level"
  | "Senior";

export interface MockInterview {
  _id?: Types.ObjectId;
  user?: User;

  duration: 10 | 20 | 30;

  jobRole: string;

  overallReview: string;

  overallRating: number;

  experienceLevel: ExperienceLevel;

  targetCompany: string;

  skills?: string[];

  dsaQuestions?: Question[];

  technicalQuestions?: Question[];

  coreSubjectQuestions?: Question[];

  // Coding questions
  codingQuestions?: CodingQuestion[];

  createdAt?: Date;

  updatedAt?: Date;
}

export default interface User {
  _id: Types.ObjectId;

  name?: string;

  email?: string;

  password?: string;

  firebaseUID?: string;

  interviewList: MockInterview[] | [];

  createdAt?: Date;

  updatedAt?: Date;
}

export interface Notification {
  id: string;

  type: "success" | "info" | "warning" | "error";

  message: string;
}