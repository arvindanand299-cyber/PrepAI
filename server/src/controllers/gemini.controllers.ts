import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { Question } from "../types/express";
import MockInterviewModel, {
  MockInterview,
} from "../models/mockinterview.model";

dotenv.config();

/* =========================================================
   Helper: Clean Gemini JSON Response
========================================================= */

function cleanGeminiResponse(responseText: string): string {
  return responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/* =========================================================
   Parse Questions JSON
========================================================= */

function extractAndParseJSONQuestion(responseText: string) {
  try {
    const jsonString = cleanGeminiResponse(responseText);

    const parsedData = JSON.parse(jsonString);

    if (
      parsedData.questions &&
      Array.isArray(parsedData.questions)
    ) {
      parsedData.questions = parsedData.questions.map(
        (question: Question) => ({
          ...question,
          answer: "",
          review: "",
        })
      );
    }

    return parsedData;
  } catch (error) {
    console.error(
      "Error parsing Gemini questions JSON:",
      error
    );

    return null;
  }
}

/* =========================================================
   Parse Review JSON
========================================================= */

function extractAndParseJSON(responseText: string) {
  try {
    const jsonString = cleanGeminiResponse(responseText);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error(
      "Error parsing Gemini review JSON:",
      error
    );

    return null;
  }
}

/* =========================================================
   Gemini API Helper
   - Uses the current stable Flash models
   - Retries transient 5xx/429 errors with exponential backoff
   - Falls back to another model if a model is temporarily unavailable
========================================================= */

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (prompt: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Gemini request: model=${model}, attempt=${attempt}/2`
        );

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
              responseMimeType: "application/json",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            timeout: 120000,
          }
        );

        return response;
      } catch (error: any) {
        lastError = error;

        const status = error.response?.status;

        console.error(
          `Gemini error: model=${model}, attempt=${attempt}, status=${status}`
        );

        /*
         * Retry only transient errors.
         * 408 = timeout
         * 429 = rate limit
         * 5xx = temporary server/model availability problems
         */
        const isRetryable =
          status === 408 ||
          status === 429 ||
          (status >= 500 && status <= 599);

        if (!isRetryable) {
          throw error;
        }

        if (attempt < 2) {
          const baseDelay = 3000 * Math.pow(2, attempt - 1);
          const jitter = Math.floor(Math.random() * 1000);
          const delay = baseDelay + jitter;

          console.log(
            `Transient Gemini error. Retrying ${model} in ${
              delay / 1000
            } seconds...`
          );

          await sleep(delay);
        } else {
          console.log(
            `Model ${model} failed after 2 attempts. Trying the next model...`
          );
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models failed");
};

/* =========================================================
   Generate Questions
========================================================= */

const generateQuestions = async (
  category: string,
  interviewID: string,
  userId: string,
  skills: string[] = [],
  questionCount: number
) => {
  const mockInterview = await MockInterviewModel.findOne({
    _id: interviewID,
    user: userId,
  });

  if (!mockInterview) {
    throw new Error("Mock interview not found");
  }

  const jobRole = mockInterview.jobRole;

  const interviewSkills =
    mockInterview.skills || skills;

  const company = mockInterview.targetCompany;

  const experienceLevel =
    mockInterview.experienceLevel;

  if (!jobRole || !company || !experienceLevel) {
    throw new Error(
      "All interview fields are required"
    );
  }

  /* =====================================================
     Category Instructions
  ===================================================== */

  let categoryInstructions = "";

  if (category === "DSA") {
    categoryInstructions = `
Generate DSA interview questions.

Focus on:

- Arrays
- Strings
- Linked Lists
- Stacks and Queues
- Searching and Sorting
- Hashing
- Trees
- Graphs
- Dynamic Programming

Include a mixture of conceptual,
coding and problem-solving questions.

The questions should be appropriate for
the candidate's experience level.
`;
  } else if (category === "Tech Stack") {
    categoryInstructions = `
Generate technical interview questions
based specifically on the candidate's
technology stack.

Technologies:

${interviewSkills.join(", ")}

Focus on:

- Practical knowledge
- Technical concepts
- Debugging
- Architecture
- APIs
- Databases
- Frameworks
- Real-world scenarios

Questions must be related to the candidate's
actual technology stack whenever possible.
`;
  } else {
    categoryInstructions = `
Generate Core Computer Science interview questions.

Focus on:

- Operating Systems
- Object-Oriented Programming
- DBMS
- Computer Networks
- System Design
- Software Engineering

Include conceptual and scenario-based questions.
`;
  }

  /* =====================================================
     Gemini Prompt
  ===================================================== */

  const prompt = `
You are an experienced technical interviewer.

Generate EXACTLY ${questionCount} interview questions.

Candidate Information:

Job Role:
${jobRole}

Experience Level:
${experienceLevel}

Target Company:
${company}

Technology Stack:
${interviewSkills.join(", ")}

Interview Category:
${category}

${categoryInstructions}

Important Requirements:

1. Generate EXACTLY ${questionCount} questions.
2. Do not generate more than ${questionCount} questions.
3. Do not generate fewer than ${questionCount} questions.
4. Questions must match the candidate's experience level.
5. Questions should resemble real technical interviews.
6. Include a balanced mixture of conceptual and scenario-based questions.
7. Avoid duplicate questions.
8. Coding questions should contain a clear problem statement.
9. Do not provide answers.
10. Questions should help evaluate actual technical ability.
11. Questions should be concise enough for a ${mockInterview.duration || 20}-minute interview.
12. Return ONLY valid JSON.
13. Do not use markdown.
14. Do not use code fences.
15. Do not add explanations outside the JSON.

Required JSON format:

{
  "questions": [
    {
      "type": "Conceptual",
      "technology": "Java",
      "question": "Explain the difference between an interface and an abstract class in Java."
    },
    {
      "type": "Scenario",
      "technology": "MongoDB",
      "question": "Your MongoDB query is becoming slow as the database grows. How would you investigate and optimize it?"
    }
  ]
}

The questions array MUST contain exactly ${questionCount} questions.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing from .env"
      );
    }

    const response = await callGemini(prompt);

    const responseData =
      response.data?.candidates?.[0]?.content
        ?.parts?.[0]?.text;

    if (!responseData) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      `${category}: ${questionCount} questions generated successfully`
    );

    const parsedResponse =
      extractAndParseJSONQuestion(responseData);

    if (
      !parsedResponse ||
      !Array.isArray(parsedResponse.questions)
    ) {
      throw new Error(
        "Gemini returned invalid question JSON"
      );
    }

    /*
      Safety check.

      If Gemini somehow generates more questions
      than requested, only keep the required amount.
    */

    parsedResponse.questions =
      parsedResponse.questions.slice(
        0,
        questionCount
      );

    /*
      If Gemini generates fewer questions,
      throw an error instead of starting an
      incomplete interview.
    */

    if (
      parsedResponse.questions.length !==
      questionCount
    ) {
      throw new Error(
        `Expected ${questionCount} ${category} questions but received ${parsedResponse.questions.length}`
      );
    }

    return parsedResponse;
  } catch (error: any) {
    console.error(
      `Error generating ${category} questions:`,
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

/* =========================================================
   DSA Questions
========================================================= */

export const generateDSAQuestions = async (
  interviewID: string,
  userId: string,
  questionCount: number
) => {
  return generateQuestions(
    "DSA",
    interviewID,
    userId,
    [],
    questionCount
  );
};

/* =========================================================
   Technical / Tech Stack Questions
========================================================= */

export const generateTechStackQuestions = async (
  interviewID: string,
  userId: string,
  skills: string[],
  questionCount: number
) => {
  return generateQuestions(
    "Tech Stack",
    interviewID,
    userId,
    skills,
    questionCount
  );
};

/* =========================================================
   Core Subject Questions
========================================================= */

export const generateCoreSubjectQuestions =
  async (
    interviewID: string,
    userId: string,
    questionCount: number
  ) => {
    return generateQuestions(
      "Core Subjects",
      interviewID,
      userId,
      [
        "OS",
        "OOP",
        "DBMS",
        "Computer Networks",
        "System Design",
      ],
      questionCount
    );
  };

/* =========================================================
   Generate Complete Interview
========================================================= */
/* =========================================================
   Generate Complete Interview
   ONE GEMINI API REQUEST
========================================================= */

export const GenerateIntervieQuestions =
  async (
    req: Request,
    res: Response
  ) => {
    const {
      interviewID,
      skills,
    } = req.body as {
      interviewID: string;
      skills?: string[];
    };

    const userId = req.user._id;

    // ==========================================
    // VALIDATE INTERVIEW ID
    // ==========================================

    if (!interviewID) {
      return res.status(400).json({
        error: "Interview ID is required",
      });
    }

    try {
      // ==========================================
      // FIND INTERVIEW
      // ==========================================

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

      // ==========================================
      // GET INTERVIEW DETAILS
      // ==========================================

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

      // ==========================================
      // VALIDATE REQUIRED FIELDS
      // ==========================================

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

      // ==========================================
      // QUESTION DISTRIBUTION
      // ==========================================

      let dsaCount: number;
      let technicalCount: number;
      let coreCount: number;
      let codingCount: number;

      // Keep the existing total question counts:
      // 10 minutes = 8 questions
      // 20 minutes = 15 questions
      // 30 minutes = 22 questions
      if (duration === 10) {
        dsaCount = 2;
        technicalCount = 2;
        coreCount = 2;
        codingCount = 2;
      } else if (duration === 30) {
        dsaCount = 5;
        technicalCount = 6;
        coreCount = 6;
        codingCount = 5;
      } else {
        dsaCount = 3;
        technicalCount = 4;
        coreCount = 4;
        codingCount = 4;
      }

      const totalQuestions =
        dsaCount +
        technicalCount +
        coreCount +
        codingCount;

      // ==========================================
      // LOG INTERVIEW INFORMATION
      // ==========================================

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
        "Coding:",
        codingCount
      );

      console.log(
        "Using ONE Gemini API request with automatic model fallback"
      );

      console.log(
        "======================================="
      );

      // ==========================================
      // CHECK GEMINI API KEY
      // ==========================================

      if (!process.env.GEMINI_API_KEY) {
        throw new Error(
          "GEMINI_API_KEY is missing from .env"
        );
      }

      // ==========================================
      // GEMINI PROMPT
      // ==========================================

      const prompt = `
You are an experienced technical interviewer.

Generate a complete technical interview for the
following candidate.

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

Coding:
${codingCount} questions


==========================================
DSA QUESTIONS
==========================================

Generate exactly ${dsaCount} DSA questions.

Focus on:

- Arrays
- Strings
- Linked Lists
- Stacks and Queues
- Searching and Sorting
- Hashing
- Trees
- Graphs
- Dynamic Programming

Include conceptual, coding and
problem-solving questions.


==========================================
TECHNICAL QUESTIONS
==========================================

Generate exactly ${technicalCount} technical
questions based on the candidate's technology stack.

Technology Stack:

${interviewSkills.join(", ")}

Focus on:

- Programming concepts
- Frameworks
- APIs
- Databases
- Debugging
- Architecture
- Practical development
- Real-world scenarios


==========================================
CORE COMPUTER SCIENCE QUESTIONS
==========================================

Generate exactly ${coreCount} Core Computer
Science questions.

Focus on:

- Operating Systems
- Object-Oriented Programming
- DBMS
- Computer Networks
- System Design
- Software Engineering

Include conceptual and scenario-based questions.


==========================================
CODING QUESTIONS
==========================================

Generate exactly ${codingCount} coding questions.

Coding questions must be actual programming
problems that require the candidate to write
code.

Focus on topics appropriate for the candidate's
technology stack and experience level, such as:

- Arrays
- Strings
- Linked Lists
- Stacks and Queues
- Hashing
- Searching and Sorting
- Recursion
- Trees
- Graphs
- Basic Dynamic Programming
- Practical problem solving

Each coding question MUST contain ALL of the following fields:

- type
- technology
- title
- question
- difficulty
- topics
- companies
- hint
- inputFormat
- outputFormat
- examples
- constraints
- followUp
- starterCode
- testCases

Field requirements:

type:
- Always "Coding"

technology:
- The programming language used for the starter code.
- Prefer a language from the candidate's technology stack.
- Example: "Java", "Python", "C++", or "JavaScript".

title:
- A short problem title.
- Example: "Two Sum"

question:
- A complete and clear programming problem statement.
- Explain exactly what the candidate needs to implement.
- Do not include the solution.

difficulty:
- Must be exactly one of:
  "Easy", "Medium", "Hard"

topics:
- An array of 1 to 4 relevant algorithm/data-structure topics.
- Example:
  ["Array", "Hash Table"]

companies:
- An array of 0 to 4 well-known companies that commonly ask similar problems.
- If no appropriate companies are known, return [].

hint:
- Give a short conceptual hint.
- Do NOT reveal the complete solution.
- Do NOT provide code.

inputFormat:
- Clearly describe the input.

outputFormat:
- Clearly describe the expected output.

examples:
- Provide at least 2 examples.
- Each example MUST contain:
  input
  output
  explanation

constraints:
- Provide the important constraints for the problem.
- Return them as an array of strings.
- Example:
  [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "Only one valid answer exists"
  ]

followUp:
- Provide one useful follow-up question related to optimization,
  complexity, or an alternative approach.
- Do NOT provide its answer.

starterCode:
- Provide incomplete starter code for the selected language.
- The candidate must complete the solution.
- Do NOT provide the solution.
- Do NOT include the completed algorithm.
- Use a realistic interview-platform format.

For example, for Java:

class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}

testCases:
- Provide at least 3 test cases.
- Each test case MUST contain:
  input
  expectedOutput

- Test cases must be consistent with the examples.
- Include normal cases and at least one edge case.

Do NOT provide:
- the solution
- completed code
- answer explanation that reveals the algorithm
- hidden test cases
- do not provide solution of answer

==========================================
IMPORTANT REQUIREMENTS
==========================================

1. Generate EXACTLY ${dsaCount} DSA questions.

2. Generate EXACTLY ${technicalCount}
   technical questions.

3. Generate EXACTLY ${coreCount}
   Core Computer Science questions.

4. Generate EXACTLY ${codingCount}
   coding questions.

5. Total questions must be EXACTLY
   ${totalQuestions}.

6. Match questions to the candidate's
   experience level.

7. Avoid duplicate questions.

8. Include conceptual and scenario-based
   questions where appropriate.

9. Coding questions must contain a clear
   programming problem statement.

10. Coding questions must NOT contain
    solutions or completed code.

11. Do NOT provide answers.

12. Questions must resemble realistic
    technical interview questions.

13. Keep questions concise enough for
    the selected interview duration.

14. Return ONLY valid JSON.

15. Do NOT use markdown.

16. Do NOT use code fences.

17. Do NOT add explanations outside JSON.


==========================================
REQUIRED JSON FORMAT
==========================================

{
  "dsaQuestions": [
    {
      "type": "Conceptual",
      "technology": "Data Structures",
      "question": "Explain the difference between an array and a linked list."
    }
  ],

  "techStackQuestions": [
    {
      "type": "Conceptual",
      "technology": "JavaScript",
      "question": "What is the difference between let, const and var?"
    }
  ],

  "coreSubjectQuestions": [
    {
      "type": "Conceptual",
      "technology": "Operating Systems",
      "question": "What is the difference between a process and a thread?"
    }
  ],

 "codingQuestions": [
  {
    "type": "Coding",
    "technology": "Java",
    "title": "Two Sum",
    "question": "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",
    "difficulty": "Easy",
    "topics": [
      "Array",
      "Hash Table"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "hint": "Try using a hash map to remember values that you have already seen.",
    "inputFormat": "An integer array nums and an integer target.",
    "outputFormat": "Return the indices of the two numbers whose sum equals target.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] = 2 + 7 = 9."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "nums[1] + nums[2] = 2 + 4 = 6."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "followUp": "Can you solve the problem in O(n) time complexity?",
    "starterCode": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n\n    }\n}",
    "testCases": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "expectedOutput": "[0,1]"
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "expectedOutput": "[1,2]"
      },
      {
        "input": "nums = [3,3], target = 6",
        "expectedOutput": "[0,1]"
      }
    ]
  }
]

The response MUST contain:

${dsaCount} items in dsaQuestions.

${technicalCount} items in techStackQuestions.

${coreCount} items in coreSubjectQuestions.

${codingCount} items in codingQuestions.

Do not return any additional top-level fields.
`;

      // ==========================================
      // ONE GEMINI API REQUEST
      // ==========================================

      const response = await callGemini(prompt);

      // ==========================================
      // GET GEMINI RESPONSE
      // ==========================================

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

      // ==========================================
      // PARSE JSON
      // ==========================================

      const generatedQuestions =
        JSON.parse(
          cleanGeminiResponse(responseData)
        );

      // ==========================================
      // VALIDATE RESPONSE STRUCTURE
      // ==========================================

      if (
        !Array.isArray(
          generatedQuestions.dsaQuestions
        ) ||
        !Array.isArray(
          generatedQuestions.techStackQuestions
        ) ||
        !Array.isArray(
          generatedQuestions.coreSubjectQuestions
        ) ||
        !Array.isArray(
          generatedQuestions.codingQuestions
        )
      ) {
        throw new Error(
          "Gemini returned invalid question structure"
        );
      }

      // ==========================================
      // VALIDATE DSA COUNT
      // ==========================================

      if (
        generatedQuestions.dsaQuestions.length !==
        dsaCount
      ) {
        throw new Error(
          `Expected ${dsaCount} DSA questions but received ${generatedQuestions.dsaQuestions.length}`
        );
      }

      // ==========================================
      // VALIDATE TECHNICAL COUNT
      // ==========================================

      if (
        generatedQuestions.techStackQuestions.length !==
        technicalCount
      ) {
        throw new Error(
          `Expected ${technicalCount} technical questions but received ${generatedQuestions.techStackQuestions.length}`
        );
      }

      // ==========================================
      // VALIDATE CORE COUNT
      // ==========================================

      if (
        generatedQuestions.coreSubjectQuestions.length !==
        coreCount
      ) {
        throw new Error(
          `Expected ${coreCount} core questions but received ${generatedQuestions.coreSubjectQuestions.length}`
        );
      }

      // ==========================================
      // VALIDATE CODING COUNT
      // ==========================================

      if (
        generatedQuestions.codingQuestions.length !==
        codingCount
      ) {
        throw new Error(
          `Expected ${codingCount} coding questions but received ${generatedQuestions.codingQuestions.length}`
        );
      }

      // ==========================================
      // ADD ANSWER AND REVIEW FIELDS
      // ==========================================

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

      const techStackQuestions =
        addAnswerFields(
          generatedQuestions.techStackQuestions
        );

      const coreSubjectQuestions =
        addAnswerFields(
          generatedQuestions.coreSubjectQuestions
        );

      const codingQuestions =
        addAnswerFields(
          generatedQuestions.codingQuestions
        );

      // ==========================================
      // MERGE QUESTIONS
      // ==========================================

      const mergedQuestions = {
        dsaQuestions,
        techStackQuestions,
        coreSubjectQuestions,
        codingQuestions,
      };


interview.dsaQuestions = dsaQuestions;

interview.technicalQuestions = techStackQuestions;

interview.coreSubjectQuestions = coreSubjectQuestions;

interview.codingQuestions = codingQuestions;

await interview.save();
      // ==========================================
      // SUCCESS LOGS
      // ==========================================

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
        techStackQuestions.length
      );

      console.log(
        "Core questions:",
        coreSubjectQuestions.length
      );

      console.log(
        "Coding questions:",
        codingQuestions.length
      );

      console.log(
        "Total questions:",
        dsaQuestions.length +
          techStackQuestions.length +
          coreSubjectQuestions.length +
          codingQuestions.length
      );

      console.log(
        "======================================="
      );

      // ==========================================
      // SEND RESPONSE
      // ==========================================

      return res.status(200).json(
        mergedQuestions
      );

    } catch (error: any) {

      console.error(
        "======================================="
      );

      console.error(
        "ERROR GENERATING INTERVIEW QUESTIONS:"
      );

      console.error(
        error.response?.data ||
        error.message ||
        error
      );

      console.error(
        "======================================="
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
  export const GenerateReview =
  async (
    req: Request,
    res: Response
  ) => {
    const {
      InterviewDetailsObject,
    } = req.body as {
      InterviewDetailsObject:
        MockInterview;
    };

    if (!InterviewDetailsObject) {
      return res.status(400).json({
        message:
          "Invalid request format",
      });
    }

    /*
      Convert interview object into JSON
      for Gemini.
    */

    const InterviewDetails =
      JSON.stringify(
        InterviewDetailsObject,
        null,
        2
      );

    /* =====================================================
       Review Prompt
    ===================================================== */

    const reviewPrompt = `
You are an AI technical interview evaluator.

Evaluate the candidate's complete interview performance.

Interview Data:

${InterviewDetails}

Your task is to analyze the candidate's answers.

For EVERY question:

1. Evaluate correctness.
2. Evaluate completeness.
3. Evaluate clarity.
4. Evaluate technical understanding.
5. Consider important edge cases.
6. Give constructive feedback.
7. If the answer is empty, clearly mention that the candidate did not provide an answer.
8. For coding questions, evaluate the submitted code separately.
9. For coding questions, consider correctness, logic, edge cases,
   time complexity, space complexity, and whether the solution
   addresses the problem requirements.

Overall Evaluation:

1. Calculate an overall rating from 1 to 5.
2. Provide an overallReview.
3. The rating should reflect the candidate's actual answers.
4. Do not give a high rating simply because questions were generated.
5. Missing answers should negatively affect the rating.
6. Good technical explanations should improve the rating.
7. Correct coding/problem-solving approaches should improve the rating.

Important:

Do not change the existing JSON structure.

Only update:

- review
- overallRating
- overallReview

Preserve:

- jobRole
- experienceLevel
- targetCompany
- skills
- duration
- dsaQuestions
- technicalQuestions
- coreSubjectQuestions
- codingQuestions
- answers
- code submissions
- IDs
- timestamps

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside JSON.
`;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error(
          "GEMINI_API_KEY is missing from .env"
        );
      }

      const response = await callGemini(reviewPrompt);

      const responseData =
        response.data?.candidates?.[0]
          ?.content?.parts?.[0]?.text;

      if (!responseData) {
        throw new Error(
          "Gemini returned an empty review response"
        );
      }

      const generatedResponse =
        extractAndParseJSON(
          responseData
        );

      if (!generatedResponse) {
        throw new Error(
          "Gemini returned invalid review JSON"
        );
      }

      const interviewId =
        InterviewDetailsObject._id;

      const interview =
        await MockInterviewModel.findOne({
          _id: interviewId,
        });

      if (!interview) {
        return res.status(404).json({
          error:
            "Interview not found",
        });
      }

      /* =================================================
         Save Question Reviews
      ================================================= */

      interview.dsaQuestions =
        generatedResponse.dsaQuestions ||
        interview.dsaQuestions;

      interview.technicalQuestions =
        generatedResponse.technicalQuestions ||
        generatedResponse.techStackQuestions ||
        interview.technicalQuestions;

      interview.coreSubjectQuestions =
        generatedResponse.coreSubjectQuestions ||
        interview.coreSubjectQuestions;

      interview.codingQuestions =
        generatedResponse.codingQuestions ||
        interview.codingQuestions;

      /* =================================================
         Save Overall Performance
      ================================================= */

      interview.overallRating =
        generatedResponse.overallRating ??
        interview.overallRating;

      interview.overallReview =
        generatedResponse.overallReview ??
        interview.overallReview;

      await interview.save();

      console.log(
        "Interview review generated successfully"
      );

      return res.status(200).json({
        message: "success",
        overallRating:
          interview.overallRating,
        overallReview:
          interview.overallReview,
      });
    } catch (error: any) {
      console.error(
        "Error generating review:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        error:
          "Failed to generate interview review",

        details:
          error.response?.data?.error
            ?.message ||
          error.message ||
          "Unknown Gemini error",
      });
    }
  };