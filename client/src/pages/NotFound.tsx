import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 space-y-8 text-center">
        {/* Animated Ghost Icon */}
        <div className="animate-bounce">
          <Ghost className="h-24 w-24 text-indigo-600 mx-auto" />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-700 bg-clip-text text-transparent">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Oops! Page Not Found
          </h2>

          <p className="text-slate-500 max-w-md mx-auto">
            It looks like you've taken a wrong turn. Don't worry, it happens
            to the best of us. Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl" />

        <div className="absolute left-1/4 top-1/4 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}