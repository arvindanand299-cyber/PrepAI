import { cn } from "@/utils/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  UserPlus,
  ArrowRight,
} from "lucide-react";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase/firebase";
import { registerUser } from "@/api/user.api";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { Notification } from "@/vite-env";

export function SignupPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState("");

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      setName((result as any)._tokenResponse.displayName);
      setEmail((result as any)._tokenResponse.email);
      setFirebaseUid((result as any)._tokenResponse.user_id);
      setPassword(`${Math.random() * 1000000}`);

      const formData = {
        name,
        email,
        password,
        firebaseUid: firebaseUid || "",
      };

      const response = await registerUser(formData);
      response;

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "success",
        message: "User Registered Successfully",
      };

      addNotification(newNotification);
      navigate("/login");
    } catch (error) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "error",
        message: `${(error as any).response.data.error}`,
      };

      addNotification(newNotification);
    }
  };

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const formData = {
        name,
        email,
        password,
        firebaseUid: firebaseUid || "",
      };

      await registerUser(formData);

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "success",
        message: "User Registered Successfully",
      };

      addNotification(newNotification);
      navigate("/login");
    } catch (error) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "error",
        message: `${(error as any).response.data.error}`,
      };

      addNotification(newNotification);
    }
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      </div>

      {/* =========================================
          MAIN CONTAINER
      ========================================= */}

      <div
        className={cn(
          "relative z-10 flex w-full max-w-5xl items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* =====================================
              LEFT BRAND PANEL
          ===================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-300/10 blur-2xl" />

            <div className="relative z-10">

              {/* Logo */}
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-extrabold tracking-tight">
                      PREP
                    </span>

                    <span className="text-2xl font-extrabold tracking-tight text-purple-200">
                      -AI
                    </span>

                    <Sparkles className="ml-1 h-4 w-4 text-purple-200" />
                  </div>

                  <p className="text-[9px] font-medium tracking-[0.2em] text-indigo-200">
                    INTERVIEW PREPARATION
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="max-w-sm">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
                  Start Your Journey
                </p>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Build confidence.
                  <br />
                  <span className="text-indigo-200">
                    Land your opportunity.
                  </span>
                </h1>

                <p className="mt-5 text-sm leading-6 text-indigo-100">
                  Create your PREP-AI account and start practicing realistic,
                  AI-powered mock interviews tailored to your career goals.
                </p>
              </div>

              {/* Feature cards */}
              <div className="mt-10 space-y-3">

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Personalized Interviews
                    </p>

                    <p className="text-xs text-indigo-200">
                      Practice based on your skills
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Performance Insights
                    </p>

                    <p className="text-xs text-indigo-200">
                      Understand and improve your answers
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
              Your AI interview coach is ready
            </div>
          </div>

          {/* =====================================
              SIGNUP FORM
          ===================================== */}

          <Card className="rounded-none border-0 bg-white/90 shadow-none">

            <CardHeader className="px-6 pb-2 pt-7 sm:px-10 sm:pt-9">

              {/* Mobile logo */}
              <div className="mb-5 flex items-center gap-2 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-200">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>

                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  PREP
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    -AI
                  </span>
                </span>
              </div>

              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                Create your account
              </CardTitle>

              <CardDescription className="mt-2 text-sm leading-6 text-slate-500">
                Join PREP-AI and start preparing for your next interview.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-7 pt-5 sm:px-10 sm:pb-9">

              <form onSubmit={(e) => e.preventDefault()}>

                <div className="flex flex-col gap-4">

                  {/* Name */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </Label>

                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-indigo-200 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-indigo-200 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </Label>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 pr-11 text-slate-900 shadow-sm transition-all hover:border-indigo-200 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100"
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-indigo-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </Label>

                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-4 pr-11 text-slate-900 shadow-sm transition-all hover:border-indigo-200 focus-visible:border-indigo-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-100"
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                      />

                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-indigo-600"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sign Up */}
                  <Button
                    type="button"
                    onClick={handleSignup}
                    className="group mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-200"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />

                    <span>Create PREP-AI Account</span>

                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>

                  {/* Divider */}
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>

                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 font-medium text-slate-400">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>

                  {/* Google Signup */}
                  <Button
                    type="button"
                    onClick={handleGoogleSignup}
                    variant="outline"
                    className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 21.82c2.63 0 4.84-.87 6.45-2.34l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.82Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.53 13.93A5.86 5.86 0 0 1 6.22 12c0-.67.12-1.32.31-1.93V7.55H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.45l3.25-2.52Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 6.04c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.13 14.63 2.18 12 2.18a9.75 9.75 0 0 0-8.72 5.37l3.25 2.52C7.3 7.76 9.46 6.04 12 6.04Z"
                      />
                    </svg>

                    Continue with Google
                  </Button>
                </div>

                {/* Login */}
                <div className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-purple-600 hover:underline"
                  >
                    Login
                  </Link>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}