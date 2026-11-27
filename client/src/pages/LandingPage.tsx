import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader/Loader";
import Navbar from "@/components/Navbar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Brain,
  Calendar,
  Mic,
  Monitor,
  ClipboardList,
  MessageSquare,
  Code2,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const features = [
    {
      title: "AI-Powered Interviews",
      description:
        "Practice realistic interviews with questions generated according to your role, skills, experience, and target company.",
      icon: Brain,
    },
    {
      title: "Personalized Questions",
      description:
        "Get DSA, technical, and core subject questions based on your selected technology stack.",
      icon: Calendar,
    },
    {
      title: "Speech-to-Text",
      description:
        "Answer questions using your voice and convert your responses into text during the interview.",
      icon: Mic,
    },
    {
      title: "Camera & Screen Support",
      description:
        "Practice in a realistic interview environment with camera and screen recording capabilities.",
      icon: Monitor,
    },
    {
      title: "Performance Review",
      description:
        "Receive AI-powered feedback about your answers, strengths, weaknesses, and areas for improvement.",
      icon: ClipboardList,
    },
    {
      title: "Interview History",
      description:
        "Keep track of your previous interviews and review your performance whenever you want.",
      icon: MessageSquare,
    },
  ];

  const benefits = [
    "Practice technical interviews anytime",
    "Personalized questions based on your skills",
    "DSA, technical and core subject questions",
    "Save your answers",
    "AI-powered performance review",
    "Track previous interviews",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-indigo-100 bg-white shadow-sm text-sm text-slate-600">
              <Brain className="w-4 h-4 text-indigo-600" />
              AI-Powered Interview Preparation
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-900">
              Prepare for Your

              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Next Interview
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto mt-8 text-lg md:text-xl text-slate-500 leading-relaxed">
              Practice realistic technical interviews with AI-generated
              questions, personalized interview sessions, coding challenges,
              and detailed performance reviews.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all"
              >
                Start Mock Interview
              </button>

            </div>
          </div>

          {/* Quick Features */}
          <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">

                  <div className="p-3 rounded-xl bg-indigo-50">
                    <Code2 className="w-7 h-7 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Technical Practice
                    </p>

                    <h3 className="text-lg font-semibold text-slate-900">
                      DSA & Coding
                    </h3>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">

                  <div className="p-3 rounded-xl bg-purple-50">
                    <Brain className="w-7 h-7 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      AI Generated
                    </p>

                    <h3 className="text-lg font-semibold text-slate-900">
                      Interview Questions
                    </h3>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">

                  <div className="p-3 rounded-xl bg-blue-50">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Performance
                    </p>

                    <h3 className="text-lg font-semibold text-slate-900">
                      AI Review
                    </h3>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">

            <p className="text-indigo-600 font-semibold mb-3">
              HOW IT WORKS
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Your Interview Preparation Journey
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Follow three simple steps to practice and improve your interview
              performance.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-8 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-indigo-600">
                    1
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Create Interview
                </h3>

                <p className="text-slate-500">
                  Select your job role, experience level, skills, and target
                  company.
                </p>

              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-8 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-purple-600">
                    2
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Take Interview
                </h3>

                <p className="text-slate-500">
                  Answer AI-generated DSA, technical, and core subject
                  questions.
                </p>

              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-8 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-5">
                  <span className="text-2xl font-bold text-blue-600">
                    3
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  Review Performance
                </h3>

                <p className="text-slate-500">
                  Get AI feedback, ratings, and recommendations for improving
                  your interview performance.
                </p>

              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <p className="text-indigo-600 font-semibold mb-3">
              FEATURES
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Everything You Need
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              PREP-AI provides everything you need to prepare for your next
              technical interview.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <Card
                  key={index}
                  className="bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >

                  <CardHeader>

                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>

                    <CardTitle className="text-lg text-slate-900">
                      {feature.title}
                    </CardTitle>

                  </CardHeader>

                  <CardContent>

                    <p className="text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>

                  </CardContent>

                </Card>
              );

            })}

          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-y border-slate-100">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>

              <p className="text-indigo-600 font-semibold mb-3">
                WHY PREP-AI?
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Turn Practice Into Confidence
              </h2>

              <p className="text-slate-500 mt-5 leading-relaxed">
                Instead of preparing randomly, practice through structured
                interviews and use AI-powered feedback to understand exactly
                where you need improvement.
              </p>

              <button
                onClick={handleGetStarted}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all"
              >
                Start Practicing
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

            <div className="space-y-4">

              {benefits.map((benefit, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
                >

                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />

                  <span className="text-slate-700">
                    {benefit}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Ready for Your Next Interview?
          </h2>

          <p className="text-slate-500 mt-5 text-lg">
            Start practicing today and build the confidence you need to crack
            your next technical interview.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold text-lg transition-all shadow-sm"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200">

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">

          <p>
            © 2026 PREP-AI. AI-Powered Interview Preparation.
          </p>

          <a
            href="https://github.com/Cleveridiot07"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            GitHub Profile
          </a>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;