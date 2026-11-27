import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import MockInterviewModel from "../models/mockinterview.model";

// ==========================================
// CREATE MOCK INTERVIEW
// ==========================================

export const createMockInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;

    const {
      jobRole,
      overallReview,
      overallRating,
      experienceLevel,
      targetCompany,
      skills,
      duration,
      dsaQuestions,
      technicalQuestions,
      coreSubjectQuestions,
    } = req.body;

    const newMockInterview = new MockInterviewModel({
      user: userId,
      jobRole,
      overallReview: overallReview || "",
      overallRating: overallRating || 0,
      experienceLevel,
      targetCompany,
      skills: skills || [],
      duration: duration || 20,
      dsaQuestions: dsaQuestions || [],
      technicalQuestions: technicalQuestions || [],
      coreSubjectQuestions: coreSubjectQuestions || [],
    });

    const savedMockInterview =
      await newMockInterview.save();

    return res.status(201).json(
      savedMockInterview
    );
  } catch (error) {
    console.error(
      "CREATE INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create mock interview",
      error:
        error instanceof Error
          ? error.message
          : error,
    });
  }
};

// ==========================================
// GET ALL MOCK INTERVIEWS
// ==========================================

export const getMockInterviews = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;

    const mockInterviews =
      await MockInterviewModel.find({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json(
      mockInterviews
    );
  } catch (error) {
    console.error(
      "GET INTERVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interviews",
      error:
        error instanceof Error
          ? error.message
          : error,
    });
  }
};

// ==========================================
// GET MOCK INTERVIEW BY ID
// ==========================================

export const getMockInterviewById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid interview ID",
      });
    }

    const mockInterview =
      await MockInterviewModel.findOne({
        _id: id,
        user: userId,
      });

    if (!mockInterview) {
      return res.status(404).json({
        message: "Mock interview not found",
      });
    }

    return res.status(200).json(
      mockInterview
    );
  } catch (error) {
    console.error(
      "GET INTERVIEW BY ID ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch interview",
      error:
        error instanceof Error
          ? error.message
          : error,
    });
  }
};

// ==========================================
// EDIT MOCK INTERVIEW
// ==========================================

export const editMockInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid interview ID",
      });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date(),
    };

    const mockInterview =
      await MockInterviewModel.findOneAndUpdate(
        {
          _id: id,
          user: userId,
        },
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!mockInterview) {
      return res.status(404).json({
        message: "Mock interview not found",
      });
    }

    return res.status(200).json(
      mockInterview
    );
  } catch (error) {
    console.error(
      "EDIT INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to edit interview",
      error:
        error instanceof Error
          ? error.message
          : error,
    });
  }
};

// ==========================================
// DELETE MOCK INTERVIEW
// ==========================================

export const deleteMockInterview = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    console.log(
      "================================="
    );

    console.log(
      "DELETE INTERVIEW REQUEST"
    );

    console.log(
      "Interview ID:",
      id
    );

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "================================="
    );

    // Check ID
    if (!id) {
      return res.status(400).json({
        message: "Interview ID is required",
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(
        "Invalid interview ID"
      );

      return res.status(400).json({
        message: "Invalid interview ID",
      });
    }

    // Find interview first
    const interview =
      await MockInterviewModel.findOne({
        _id: id,
        user: userId,
      });

    if (!interview) {
      console.log(
        "Interview not found for this user"
      );

      return res.status(404).json({
        message:
          "Interview not found or you are not authorized to delete it",
      });
    }

    console.log(
      "Interview found:",
      interview._id
    );

    // Delete interview
    await MockInterviewModel.deleteOne({
      _id: id,
      user: userId,
    });

    console.log(
      "Interview deleted successfully"
    );

    return res.status(200).json({
      success: true,
      message:
        "Mock interview deleted successfully",
      deletedInterviewId: id,
    });
  } catch (error) {
    console.error(
      "DELETE INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete mock interview",
      error:
        error instanceof Error
          ? error.message
          : error,
    });
  }
};

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ONE GEMINI REQUEST
// ==========================================

export const GenerateIntervieQuestions = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      interviewID,
      skills,
    } = req.body as {
      interviewID: string;
      skills?: string[];
    };

    const userId = req.user._id;

    // ------------------------------------------
    // Validate Interview ID
    // ------------------------------------------

    if (!interviewID) {
      return res.status(400).json({
        error: "Interview ID is required",
      });
    }

    // ------------------------------------------
    // Find Interview
    // ------------------------------------------

    const interview =
      await MockInterviewModel.findOne({
        _id: interviewID,
        user: userId,
      });

    if (!interview) {
      return res.status(404).json({
        error: "Interview not found",
      });
    }

    // ------------------------------------------
    // Interview Information
    // ------------------------------------------

    const jobRole =
      interview.jobRole;

    const experienceLevel =
      interview.experienceLevel;

    const targetCompany =
      interview.targetCompany;

    const interviewSkills =
      interview.skills &&
      interview.skills.length > 0
        ? interview.skills
        : skills || [];

    const duration =
      interview.duration || 20;

    // ------------------------------------------
    // Validate Required Fields
    // ------------------------------------------

    if (
      !jobRole ||
      !experienceLevel ||
      !targetCompany
    ) {
      return res.status(400).json({
        error:
          "Interview is missing required fields",
      });
    }

    // ------------------------------------------
    // Question Distribution
    // ------------------------------------------

    let dsaCount: number;
    let technicalCount: number;
    let coreCount: number;

    if (duration === 10) {
      dsaCount = 2;
      technicalCount = 3;
      coreCount = 3;
    } else if (duration === 30) {
      dsaCount = 6;
      technicalCount = 8;
      coreCount = 8;
    } else {
      dsaCount = 4;
      technicalCount = 6;
      coreCount = 5;
    }

    const totalQuestions =
      dsaCount +
      technicalCount +
      coreCount;

    // ------------------------------------------
    // Console Logs
    // ------------------------------------------

    console.log(
      "======================================="
    );

    console.log(
      "Generating Interview Questions"
    );

    console.log(
      "Interview ID:",
      interviewID
    );

    console.log(
      "Duration:",
      duration,
      "minutes"
    );

    console.log(
      "Total Questions:",
      totalQuestions
    );

    console.log(
      "DSA:",
      dsaCount
    );

    console.log(
      "Technical:",
      technicalCount
    );

    console.log(
      "Core:",
      coreCount
    );

    console.log(
      "Using ONE Gemini API request"
    );

    console.log(
      "======================================="
    );

    // ------------------------------------------
    // Check Gemini API Key
    // ------------------------------------------

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing from .env"
      );
    }

    // ------------------------------------------
    // Gemini Prompt
    // ------------------------------------------

    const prompt = `
You are an experienced technical interviewer.

Generate a complete technical interview for
the following candidate.

Candidate Information:

Job Role:
${jobRole}

Experience Level:
${experienceLevel}

Target Company:
${targetCompany}

Technology Stack:
${interviewSkills.join(", ")}

Interview Duration:
${duration} minutes


Generate EXACTLY ${totalQuestions} questions.

Question Distribution:

DSA:
${dsaCount} questions

Technical / Technology Stack:
${technicalCount} questions

Core Computer Science:
${coreCount} questions


DSA questions should focus on:

- Arrays
- Strings
- Linked Lists
- Stacks and Queues
- Searching and Sorting
- Hashing
- Trees
- Graphs
- Dynamic Programming


Technical questions should be based specifically
on the candidate's technology stack:

${interviewSkills.join(", ")}

Focus on:

- Programming concepts
- Frameworks
- APIs
- Databases
- Debugging
- Architecture
- Practical scenarios
- Real-world development


Core Computer Science questions should focus on:

- Operating Systems
- Object-Oriented Programming
- DBMS
- Computer Networks
- System Design
- Software Engineering


Important Requirements:

1. Generate exactly ${dsaCount} DSA questions.
2. Generate exactly ${technicalCount} Technical questions.
3. Generate exactly ${coreCount} Core Computer Science questions.
4. Total questions must be exactly ${totalQuestions}.
5. Match questions to the candidate's experience level.
6. Avoid duplicate questions.
7. Include conceptual and scenario-based questions.
8. Coding questions should contain a clear problem statement.
9. Do not provide answers.
10. Questions should be realistic technical interview questions.
11. Keep questions concise enough for the selected interview duration.
12. Return ONLY valid JSON.
13. Do not use markdown.
14. Do not use code fences.
15. Do not add explanations outside JSON.


Required JSON format:

{
  "dsaQuestions": [
    {
      "type": "Conceptual",
      "technology": "Data Structures",
      "question": "Explain the difference between an array and a linked list."
    }
  ],

  "technicalQuestions": [
    {
      "type": "Conceptual",
      "technology": "JavaScript",
      "question": "Explain the difference between let, const and var."
    }
  ],

  "coreSubjectQuestions": [
    {
      "type": "Conceptual",
      "technology": "Operating Systems",
      "question": "What is the difference between a process and a thread?"
    }
  ]
}


The final response MUST contain:

${dsaCount} items in dsaQuestions.

${technicalCount} items in technicalQuestions.

${coreCount} items in coreSubjectQuestions.

Do not return any additional fields.
`;

    // ------------------------------------------
    // ONE GEMINI API REQUEST
    // ------------------------------------------

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          responseMimeType:
            "application/json",
        },
      },
      {
        headers: {
          "Content-Type":
            "application/json",

          "x-goog-api-key":
            process.env.GEMINI_API_KEY,
        },
      }
    );

    // ------------------------------------------
    // Get Gemini Response
    // ------------------------------------------

    const responseData =
      response.data?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!responseData) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      "Gemini response received successfully"
    );

    // ------------------------------------------
    // Parse Gemini JSON
    // ------------------------------------------

    const generatedQuestions =
      JSON.parse(responseData);

    // ------------------------------------------
    // Validate Structure
    // ------------------------------------------

    if (
      !Array.isArray(
        generatedQuestions.dsaQuestions
      ) ||
      !Array.isArray(
        generatedQuestions.technicalQuestions
      ) ||
      !Array.isArray(
        generatedQuestions.coreSubjectQuestions
      )
    ) {
      throw new Error(
        "Gemini returned invalid question structure"
      );
    }

    // ------------------------------------------
    // Validate DSA Count
    // ------------------------------------------

    if (
      generatedQuestions.dsaQuestions.length !==
      dsaCount
    ) {
      throw new Error(
        `Expected ${dsaCount} DSA questions but received ${generatedQuestions.dsaQuestions.length}`
      );
    }

    // ------------------------------------------
    // Validate Technical Count
    // ------------------------------------------

    if (
      generatedQuestions
        .technicalQuestions.length !==
      technicalCount
    ) {
      throw new Error(
        `Expected ${technicalCount} technical questions but received ${generatedQuestions.technicalQuestions.length}`
      );
    }

    // ------------------------------------------
    // Validate Core Count
    // ------------------------------------------

    if (
      generatedQuestions
        .coreSubjectQuestions.length !==
      coreCount
    ) {
      throw new Error(
        `Expected ${coreCount} core questions but received ${generatedQuestions.coreSubjectQuestions.length}`
      );
    }

    // ------------------------------------------
    // Add Answer & Review Fields
    // ------------------------------------------

    const addAnswerFields = (
      questions: any[]
    ) => {
      return questions.map(
        (question) => ({
          ...question,
          answer: "",
          review: "",
        })
      );
    };

    const dsaQuestions =
      addAnswerFields(
        generatedQuestions.dsaQuestions
      );

    const technicalQuestions =
      addAnswerFields(
        generatedQuestions.technicalQuestions
      );

    const coreSubjectQuestions =
      addAnswerFields(
        generatedQuestions.coreSubjectQuestions
      );

    // ------------------------------------------
    // Final Questions Object
    // ------------------------------------------

    const mergedQuestions = {
      dsaQuestions,
      technicalQuestions,
      coreSubjectQuestions,
    };

    // ------------------------------------------
    // Success Logs
    // ------------------------------------------

    console.log(
      "======================================="
    );

    console.log(
      "All interview questions generated successfully"
    );

    console.log(
      "DSA questions:",
      dsaQuestions.length
    );

    console.log(
      "Technical questions:",
      technicalQuestions.length
    );

    console.log(
      "Core questions:",
      coreSubjectQuestions.length
    );

    console.log(
      "Total questions:",
      dsaQuestions.length +
        technicalQuestions.length +
        coreSubjectQuestions.length
    );

    console.log(
      "======================================="
    );

    // ------------------------------------------
    // Send Response
    // ------------------------------------------

    return res.status(200).json(
      mergedQuestions
    );

  } catch (error: any) {

    console.error(
      "ERROR GENERATING INTERVIEW QUESTIONS:"
    );

    console.error(
      error.response?.data ||
        error.message ||
        error
    );

    return res.status(500).json({
      error:
        "Failed to generate interview questions",

      details:
        error.response?.data?.error
          ?.message ||
        error.message ||
        "Unknown Gemini error",
    });
  }
};