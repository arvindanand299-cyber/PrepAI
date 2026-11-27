import { model, Schema, Types } from "mongoose";
import User from "./user.model";

interface Question {
  question: string;
  answer: string;
  review: string;
}

interface CodingQuestion extends Question {
  type: string;
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

export interface MockInterview {
  _id: Types.ObjectId;
  user: User;

  jobRole: string;

  overallReview: string;

  overallRating: number;

  experienceLevel:
    | "Fresher"
    | "Junior"
    | "Mid-Level"
    | "Senior";

  targetCompany: string;

  skills?: string[];

  // Interview duration in minutes
  duration: 10 | 20 | 30;

  dsaQuestions?: Question[];

  technicalQuestions?: Question[];

  coreSubjectQuestions?: Question[];

  // Coding Questions
  codingQuestions?: CodingQuestion[];

  createdAt?: Date;

  updatedAt?: Date;
}

const mockInterviewSchema = new Schema<MockInterview>(
  {
    // User who created the interview
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job role
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    // Overall AI review
    overallReview: {
      type: String,
      default: "",
    },

    // Overall AI rating
    overallRating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },

    // Candidate experience level
    experienceLevel: {
      type: String,
      enum: [
        "Fresher",
        "Junior",
        "Mid-Level",
        "Senior",
      ],
      required: true,
    },

    // Target company
    targetCompany: {
      type: String,
      required: true,
      trim: true,
    },

    // Candidate skills
    skills: {
      type: [String],
      default: [],
    },

    // =========================================
    // Interview Duration
    // =========================================
    //
    // 10 = Short Interview
    // 20 = Standard Interview
    // 30 = Full Interview
    //

    duration: {
      type: Number,
      enum: [10, 20, 30],
      required: true,
      default: 20,
    },

    // =========================================
    // DSA Questions
    // =========================================

    dsaQuestions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        review: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================================
    // Technical / Tech Stack Questions
    // =========================================

    technicalQuestions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        review: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================================
    // Core Subject Questions
    // =========================================

    coreSubjectQuestions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        review: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================================
    // Coding Questions
    // =========================================

    codingQuestions: [
      {
        type: {
          type: String,
          default: "Coding",
        },

        technology: {
          type: String,
          default: "",
        },

        title: {
          type: String,
          required: true,
        },

        question: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          default: "Medium",
        },

        inputFormat: {
          type: String,
          default: "",
        },

        outputFormat: {
          type: String,
          default: "",
        },

        examples: [
          {
            input: {
              type: String,
              default: "",
            },

            output: {
              type: String,
              default: "",
            },
          },
        ],

        answer: {
          type: String,
          default: "",
        },

        review: {
          type: String,
          default: "",
        },

        code: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================================
    // Timestamps
    // =========================================

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MockInterviewModel = model<MockInterview>(
  "MockInterview",
  mockInterviewSchema
);

export default MockInterviewModel;