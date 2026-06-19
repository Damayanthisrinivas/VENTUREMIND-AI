import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, Award, Zap, AlertCircle } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Full name is required during registration.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      // Fallback message decoding
      let msg = err.message || "An authentication error occurred.";
      if (err.code === "auth/invalid-credential") {
        msg = "Invalid email or password. Please verify your credentials.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email address is already registered.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters long.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
    } catch (err: any) {
      console.warn("OAuth Popup failed. This is common inside highly sandboxed browser iframes.", err);
      setError("OAuth popups are restricted in this preview. Please utilize Email login or the Instant Demo Mock bypass below!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please input your email address above to perform password resets.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("A password recovery link has been safely dispatched to your email address!");
    } catch (err: any) {
      setError(err.message || "Unable to send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  const bypassDemoLogin = () => {
    // Simulated mock authentication bypass to keep app 100% usable on first turn or iframe limits
    const mockUser = {
      uid: "mock_demo_user_id_123",
      email: email || "innovator@venturemind.ai",
      displayName: fullName || "Venture Innovator",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      emailVerified: true
    };
    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

        {/* Brand Header */}
        <div className="text-center relative">
          <button
            onClick={onBackToLanding}
            className="absolute left-0 top-0 text-[10px] font-bold text-gray-400 hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div className="mx-auto w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center text-white shadow-sm mb-3">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-xl font-display font-bold text-[#111827] tracking-tight">VentureMind AI</h2>
          <p className="mt-1.5 text-xs text-gray-400">
            {isSignUp ? "Create your validation account" : "Sign in to control your innovations"}
          </p>
        </div>

        {/* Display feedback Alerts */}
        {error && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-600 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 translate-y-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-700 flex items-start space-x-2">
            <Award className="w-4 h-4 translate-y-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Forms */}
        <form className="mt-6 space-y-4 relative" onSubmit={handleEmailAuth}>
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50/50"
                  placeholder="Steve Jobs"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50/50"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:opacity-95 text-white rounded-lg shadow-sm text-xs font-bold leading-none uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{isSignUp ? "Generate Account" : "Access Platform"}</span>
          </button>
        </form>

        {/* Separator line */}
        <div className="relative flex items-center justify-center my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-150" />
          </div>
          <span className="relative px-2 bg-white text-[9px] text-gray-400 font-bold uppercase tracking-wider">Or Authenticate With</span>
        </div>

        {/* OAuth Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleOAuth(googleProvider)}
            disabled={loading}
            className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            onClick={() => handleOAuth(githubProvider)}
            disabled={loading}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <span className="w-4 h-4 shrink-0 font-bold">🐙</span>
            <span>GitHub</span>
          </button>
        </div>

        {/* Dynamic single-click guest log in */}
        <div className="pt-2">
          <button
            type="button"
            onClick={bypassDemoLogin}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white rounded-xl shadow-md text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span>Single-Click Demo Guest Mode</span>
          </button>
          <p className="text-[10px] text-zinc-400 text-center mt-1.5 font-normal">
            Bypasses iframe sandbox boundaries immediately to begin analyzing right away.
          </p>
        </div>

        {/* Change auth mode */}
        <div className="text-center pt-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 focus:outline-none transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
