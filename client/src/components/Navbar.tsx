import { logoutUser } from "@/api/user.api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { Notification } from "@/vite-env";
import { Sparkles, LogOut, BrainCircuit } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "success",
        message: "Logout Successful",
      };

      addNotification(newNotification);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-20 mx-auto w-full max-w-screen-md px-3 pt-3 md:top-5 md:px-0 lg:max-w-screen-lg">
      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl md:rounded-3xl">

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-36 w-36 rounded-full bg-purple-400/10 blur-3xl" />

        <div className="relative px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between">

            {/* =====================================
                PREP-AI LOGO
            ===================================== */}

            <div className="flex shrink-0">
              <a
                aria-current="page"
                className="group flex items-center gap-2.5"
                href="/"
              >
                {/* AI Icon */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-200/60 transition-all duration-200 group-hover:scale-105 group-hover:shadow-indigo-300/70">

                  <div className="absolute inset-0 rounded-xl bg-white/10" />

                  <BrainCircuit className="relative h-5.5 w-5.5 text-white" />
                </div>

                {/* Project Name */}
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">
                      PREP
                    </span>

                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      -AI
                    </span>

                    <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                  </div>

                  <p className="text-[9px] font-medium tracking-[0.18em] text-slate-400">
                    AI INTERVIEW PREPARATION
                  </p>
                </div>

                {/* Mobile logo text */}
                <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:hidden">
                  PREP
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    -AI
                  </span>
                </span>

                <p className="sr-only">
                  PREP-AI
                </p>
              </a>
            </div>

            {/* =====================================
                CENTER NAVIGATION
            ===================================== */}

            <div className="hidden md:flex md:items-center md:justify-center">
              <a
                aria-current="page"
                className="group flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-100 hover:shadow-sm"
                href="/"
              >
                <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />

                <span>
                  PREP-AI
                </span>
              </a>
            </div>

            {/* =====================================
                LOGOUT
            ===================================== */}

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="group hidden items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md sm:inline-flex"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />

                <span>
                  Logout
                </span>
              </button>

              {/* Mobile logout button */}
              <button
                type="button"
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:hidden"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      </div>
    </div>
  );
};

export default Navbar;