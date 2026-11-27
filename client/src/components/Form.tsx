import { createInterview } from "@/api/mockinterview.api";
import { useState, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ExperienceLevel, MockInterview } from "@/vite-env";
import { useNotification } from "@/components/Notifications/NotificationContext";
import {
  Clock,
  Zap,
  Target,
  Trophy,
  Sparkles,
  Briefcase,
  Building2,
  Code2,
  Check,
} from "lucide-react";

type InterviewDuration = 10 | 20 | 30;

/*
 * Common Computer Science / Software Development skills.
 */
const COMMON_CS_SKILLS = [
  "C",
  "C++",
  "C#",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Dart",
  "R",

  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "React",
  "React Native",
  "Angular",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "Spring Boot",
  "Django",
  "Flask",
  "FastAPI",

  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "SQLite",
  "Oracle",
  "Redis",
  "Firebase",
  "Mongoose",

  "Data Structures",
  "Algorithms",
  "Object-Oriented Programming",
  "OOP",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Computer Architecture",
  "Software Engineering",
  "System Design",
  "Distributed Systems",
  "Compiler Design",
  "Theory of Computation",

  "REST API",
  "GraphQL",
  "Microservices",
  "API Development",
  "Authentication",
  "Authorization",
  "JWT",
  "WebSockets",

  "AWS",
  "Microsoft Azure",
  "Google Cloud",
  "AWS Lambda",
  "Amazon S3",
  "Amazon EC2",
  "Amazon VPC",
  "Docker",
  "Kubernetes",
  "Serverless",
  "Cloud Computing",

  "Git",
  "GitHub",
  "GitLab",
  "CI/CD",
  "Linux",
  "Jenkins",
  "Terraform",
  "Ansible",
  "Nginx",

  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Generative AI",
  "Large Language Models",
  "Data Science",
  "Data Analysis",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",

  "Software Testing",
  "Unit Testing",
  "Integration Testing",
  "Jest",
  "JUnit",
  "Selenium",
  "Cypress",
  "Postman",
  "QA Automation",

  "Redux",
  "Redux Toolkit",
  "React Router",
  "Vite",
  "Responsive Design",
  "UI/UX",

  "Cybersecurity",
  "Network Security",
  "Web Security",
  "OWASP",
  "Encryption",
  "Cryptography",

  "Agile",
  "Scrum",
  "Problem Solving",
  "VS Code",
];

const QUICK_SKILLS = [
  "Java",
  "Python",
  "C++",
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "MongoDB",
  "Data Structures",
  "Algorithms",
  "DBMS",
  "OOP",
  "Operating Systems",
  "Computer Networks",
  "System Design",
  "AWS",
  "Docker",
  "Git",
];

const JOB_PROFILES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "Python Developer",
  "React Developer",
  "Node.js Developer",
  "Data Analyst",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Engineer",
  "QA Engineer",
  "QA Automation Engineer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "System Engineer",
  "Software Architect",
];

const Form = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const [jobProfile, setJobProfile] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Fresher");

  const [targetCompany, setTargetCompany] = useState("");

  const [duration, setDuration] =
    useState<InterviewDuration>(20);

  const [creating, setCreating] = useState(false);

  // ==========================================
  // ADD SKILLS
  // ==========================================

  const addSkills = (value: string) => {
    const newSkills = value
      .split(/[,\n]+/)
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (newSkills.length === 0) {
      return;
    }

    setTags((prev) => {
      const updated = [...prev];

      newSkills.forEach((skill) => {
        const exists = updated.some(
          (existingSkill) =>
            existingSkill.toLowerCase() === skill.toLowerCase()
        );

        if (!exists) {
          updated.push(skill);
        }
      });

      return updated;
    });

    setInput("");
  };

  // ==========================================
  // ADD SKILL ON ENTER / COMMA
  // ==========================================

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      (e.key === "Enter" || e.key === ",") &&
      input.trim()
    ) {
      e.preventDefault();
      addSkills(input);
      return;
    }

    if (
      e.key === "Backspace" &&
      !input &&
      tags.length > 0
    ) {
      e.preventDefault();

      const newTags = [...tags];
      const poppedTag = newTags.pop();

      setTags(newTags);
      setInput(poppedTag || "");
    }
  };

  // ==========================================
  // REMOVE SKILL
  // ==========================================

  const removeTag = (index: number) => {
    setTags((prev) =>
      prev.filter((_, i) => i !== index)
    );

    inputRef.current?.focus();
  };

  // ==========================================
  // CREATE INTERVIEW
  // ==========================================

  const handleCreateInterview = async () => {
    console.log("CREATE INTERVIEW BUTTON CLICKED");

    if (creating) {
      console.log("Already creating interview...");
      return;
    }

    try {
      // ==========================================
      // ADD PENDING SKILL
      // ==========================================

      let finalTags = [...tags];

      if (input.trim()) {
        const pendingSkills = input
          .split(/[,\n]+/)
          .map((skill) => skill.trim())
          .filter(Boolean);

        pendingSkills.forEach((skill) => {
          const exists = finalTags.some(
            (existingSkill) =>
              existingSkill.toLowerCase() ===
              skill.toLowerCase()
          );

          if (!exists) {
            finalTags.push(skill);
          }
        });

        setTags(finalTags);
        setInput("");
      }

      console.log("Form values:", {
        jobProfile,
        experienceLevel,
        targetCompany,
        duration,
        skills: finalTags,
      });

      // ==========================================
      // VALIDATION
      // ==========================================

      if (jobProfile.trim() === "") {
        addNotification({
          id: Date.now().toString(),
          type: "warning",
          message: "Please enter a Job Profile.",
        });

        return;
      }

      if (finalTags.length === 0) {
        addNotification({
          id: Date.now().toString(),
          type: "warning",
          message:
            "Please add at least one skill or technology.",
        });

        inputRef.current?.focus();

        return;
      }

      if (targetCompany.trim() === "") {
        addNotification({
          id: Date.now().toString(),
          type: "warning",
          message: "Please enter a Target Company.",
        });

        return;
      }

      // ==========================================
      // START CREATING
      // ==========================================

      setCreating(true);

      // ==========================================
      // DATA SENT TO BACKEND
      // ==========================================

      const formData = {
        jobRole: jobProfile.trim(),
        experienceLevel,
        skills: finalTags,
        targetCompany: targetCompany.trim(),
        duration,
        overallReview: "",
        overallRating: 0,
        dsaQuestions: [],
        technicalQuestions: [],
        coreSubjectQuestions: [],
      };

      console.log(
        "Sending interview data to backend:",
        formData
      );

      // ==========================================
      // CREATE INTERVIEW
      // ==========================================

      const response = await createInterview(
        formData as MockInterview
      );

      console.log(
        "Create Interview Response:",
        response
      );

      // ==========================================
      // GET CREATED INTERVIEW
      // ==========================================

      const createdInterview =
        response?.data || response;

      console.log(
        "Created Interview Object:",
        createdInterview
      );

      const interviewId =
        createdInterview?._id?.toString();

      console.log(
        "Created Interview ID:",
        interviewId
      );

      // ==========================================
      // CHECK ID
      // ==========================================

      if (!interviewId) {
        throw new Error(
          "Interview was created but the server did not return an interview ID."
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message:
          `${duration}-minute interview created successfully`,
      });

      console.log(
        "Navigating to interview instructions..."
      );

      // ==========================================
      // GO TO INTERVIEW INSTRUCTIONS
      // ==========================================

      navigate(
        `/interview/${interviewId}/instructions`
      );
    } catch (error: any) {
      console.error(
        "ERROR CREATING INTERVIEW:",
        error
      );

      console.error(
        "ERROR RESPONSE:",
        error?.response?.data
      );

      addNotification({
        id: Date.now().toString(),
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Error creating interview",
      });

      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen w-screen items-start justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md sm:p-5 lg:p-8"
      style={{ pointerEvents: "auto" }}
    >
      {/* ==========================================
          BACKGROUND GLOW
      ========================================== */}

      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* ==========================================
          MAIN CARD
      ========================================== */}

      <div className="relative z-[10000] my-3 flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.30)] sm:my-5 lg:my-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 px-6 py-8 text-white sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h5 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create New Interview
            </h5>

            <p className="mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">
              Build a personalized AI-powered interview
              based on your role, skills, experience and
              target company.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-50 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Interview Preparation
            </div>
          </div>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-5 sm:p-8 lg:p-10">

          {/* Progress */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-5 py-4 shadow-sm">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-indigo-200/30 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                <Briefcase className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Interview Details
                </p>

                <p className="text-xs text-slate-500">
                  Configure your personalized interview
                </p>
              </div>

              <div className="ml-auto hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm sm:flex">
                <Sparkles className="h-3.5 w-3.5" />
                AI Ready
              </div>
            </div>
          </div>

          {/* =================================
              JOB PROFILE + EXPERIENCE
          ================================= */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Job Profile */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Briefcase className="h-4 w-4" />
                </div>

                <div>
                  <label
                    htmlFor="jobProfile"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Job Profile
                  </label>

                  <p className="text-xs text-slate-400">
                    What role are you preparing for?
                  </p>
                </div>
              </div>

              <input
                id="jobProfile"
                name="jobProfile"
                type="text"
                value={jobProfile}
                onChange={(e) =>
                  setJobProfile(e.target.value)
                }
                list="job-profile-options"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-300 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Example: Software Engineer"
                disabled={creating}
              />

              <datalist id="job-profile-options">
                {JOB_PROFILES.map((profile) => (
                  <option
                    key={profile}
                    value={profile}
                  />
                ))}
              </datalist>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Target className="h-4 w-4" />
                </div>

                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Experience Level
                  </label>

                  <p className="text-xs text-slate-400">
                    Choose your current experience
                  </p>
                </div>
              </div>

              <select
                id="experienceLevel"
                name="experienceLevel"
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(
                    e.target.value as ExperienceLevel
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-8 text-sm text-slate-700 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                disabled={creating}
              >
                <option value="Fresher">
                  Fresher
                </option>

                <option value="Junior">
                  Junior
                </option>

                <option value="Mid-Level">
                  Mid-Level
                </option>

                <option value="Senior">
                  Senior
                </option>
              </select>
            </div>
          </div>

          {/* =================================
              TARGET COMPANY
          ================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>

              <div>
                <label
                  htmlFor="targetCompany"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Target Company
                </label>

                <p className="text-xs text-slate-400">
                  Customize questions for your target company
                </p>
              </div>
            </div>

            <input
              id="targetCompany"
              name="targetCompany"
              type="text"
              value={targetCompany}
              onChange={(e) =>
                setTargetCompany(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              placeholder="Example: Google, Amazon, Microsoft"
              disabled={creating}
            />
          </div>

          {/* =================================
              INTERVIEW DURATION
          ================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Interview Duration
                </p>

                <p className="text-xs text-slate-400">
                  Select the interview depth
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* 10 */}
              <button
                type="button"
                disabled={creating}
                onClick={() => setDuration(10)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-200 ${
                  duration === 10
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 shadow-lg shadow-indigo-100"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md"
                }`}
              >
                {duration === 10 && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                <Zap
                  className={`mx-auto mb-2 h-7 w-7 ${
                    duration === 10
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />

                <p className="text-base font-bold">
                  10 Min
                </p>

                <p className="mt-1 text-xs opacity-70">
                  Quick
                </p>

                <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium shadow-sm">
                  8 Questions
                </div>
              </button>

              {/* 20 */}
              <button
                type="button"
                disabled={creating}
                onClick={() => setDuration(20)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-200 ${
                  duration === 20
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 shadow-lg shadow-indigo-100"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md"
                }`}
              >
                {duration === 20 && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                <Target
                  className={`mx-auto mb-2 h-7 w-7 ${
                    duration === 20
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />

                <p className="text-base font-bold">
                  20 Min
                </p>

                <p className="mt-1 text-xs opacity-70">
                  Standard
                </p>

                <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium shadow-sm">
                  15 Questions
                </div>
              </button>

              {/* 30 */}
              <button
                type="button"
                disabled={creating}
                onClick={() => setDuration(30)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-200 ${
                  duration === 30
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 shadow-lg shadow-indigo-100"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md"
                }`}
              >
                {duration === 30 && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                <Trophy
                  className={`mx-auto mb-2 h-7 w-7 ${
                    duration === 30
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />

                <p className="text-base font-bold">
                  30 Min
                </p>

                <p className="mt-1 text-xs opacity-70">
                  Full
                </p>

                <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium shadow-sm">
                  22 Questions
                </div>
              </button>
            </div>

            {/* Selected duration */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-medium text-indigo-500">
                  Selected interview
                </p>

                <p className="mt-0.5 text-sm font-bold text-slate-800">
                  {duration === 10 &&
                    "Quick Interview — 8 questions"}

                  {duration === 20 &&
                    "Standard Interview — 15 questions"}

                  {duration === 30 &&
                    "Full Interview — 22 questions"}
                </p>
              </div>
            </div>
          </div>

          {/* =================================
              SKILLS
          ================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Code2 className="h-5 w-5" />
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-bold text-slate-800"
                >
                  Skills / Technologies
                </label>

                <p className="text-xs text-slate-400">
                  Add technologies you want to be interviewed on
                </p>
              </div>
            </div>

            {/* Skill Input */}
            <div className="flex min-h-[52px] flex-wrap content-start items-center rounded-xl border-2 border-slate-200 bg-slate-50 p-2.5 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="mb-1.5 mr-2 flex items-center rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm"
                >
                  {tag}

                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => removeTag(index)}
                    className="ml-2 rounded-full font-bold text-indigo-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                id="skills"
                name="skills"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                list="skill-options"
                className="h-9 min-w-[120px] flex-grow bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder={
                  tags.length === 0
                    ? "Type skills, separated by commas"
                    : "Add another skill"
                }
                aria-label="Add a skill"
                disabled={creating}
              />

              <datalist id="skill-options">
                {COMMON_CS_SKILLS.map((skill) => (
                  <option
                    key={skill}
                    value={skill}
                  />
                ))}
              </datalist>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Example: Java, Python, React, SQL, MongoDB
            </p>

            {/* Quick Skills */}
            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />

                <p className="text-xs font-semibold text-slate-600">
                  Quick add
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_SKILLS.map((skill) => {
                  const alreadyAdded =
                    tags.some(
                      (tag) =>
                        tag.toLowerCase() ===
                        skill.toLowerCase()
                    );

                  return (
                    <button
                      key={skill}
                      type="button"
                      disabled={
                        creating || alreadyAdded
                      }
                      onClick={() => addSkills(skill)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        alreadyAdded
                          ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
                      }`}
                    >
                      {alreadyAdded
                        ? `✓ ${skill}`
                        : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================
              CREATE INTERVIEW
          ================================= */}

          <div className="relative z-[10001] mt-8">
            <button
              type="button"
              disabled={creating}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                console.log(
                  "CREATE BUTTON CLICKED"
                );

                void handleCreateInterview();
              }}
              className="group relative z-[10002] block w-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-4 text-center text-sm font-bold text-white shadow-xl shadow-indigo-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-indigo-300/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {/* Button shine */}
              <div
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden="true"
              />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {creating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating Interview...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />

                    Create {duration}-Minute Interview
                  </>
                )}
              </span>
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Your interview will be generated based on your
              selected role, skills, experience and company.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;