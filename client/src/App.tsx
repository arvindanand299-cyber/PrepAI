import { Routes, Route } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import NotificationCard from "./components/Notifications/NotificationCard";
import { SignupPage } from "./pages/SignupPage";

import InterviewInterfacePage from "./pages/InterviewInterfacePage";
import InterviewInstructionsPage from "./pages/InterviewInstructionsPage";
import InterviewQuestionPage from "./pages/InterviewQuestionPage";
import InterviewCompletedPage from "./pages/InterviewCompletedPage";

import CodeEditor from "./components/CodeEdior/CodeEditor";
import { InterviewDetails } from "./pages/InterviewDetails";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NotificationCard />

      <div>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Test Code Editor */}
          <Route path="/test" element={<CodeEditor />} />

          {/* ================================= */}
          {/* NEW INTERVIEW FLOW                */}
          {/* ================================= */}

          {/* Interview Instructions */}
          <Route
            path="/interview/:id/instructions"
            element={<InterviewInstructionsPage />}
          />

          {/* Individual Interview Question */}
          <Route
            path="/interview/:id/question/:questionNumber"
            element={<InterviewQuestionPage />}
          />

          {/* Interview Completed + AI Review Generation */}
          <Route
            path="/interview/:id/completed"
            element={<InterviewCompletedPage />}
          />

          {/* ================================= */}
          {/* OLD INTERVIEW PAGE - BACKUP       */}
          {/* ================================= */}

          <Route
            path="/interviewinterface/:id"
            element={<InterviewInterfacePage />}
          />

          {/* ================================= */}
          {/* PERFORMANCE REVIEW                */}
          {/* ================================= */}

          <Route
            path="/interviewdetails/:id"
            element={<InterviewDetails />}
          />

          {/* 404 */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;