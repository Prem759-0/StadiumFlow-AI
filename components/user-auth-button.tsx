// ============================================================
// StadiumFlow AI - User Auth Button Component
// Prominent Google Sign-In button and user profile display
// Fits into the top-right header of Fan/Staff views
// ============================================================

"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  signInWithGoogle,
  signOut,
  onAuthChange,
  getMockUserProfile,
  isFirebaseConfigured,
  type UserProfile,
} from "@/lib/firebase";
import { LogIn, LogOut, User, Shield, ChevronDown } from "lucide-react";
import { useAttendeeStore } from "@/lib/store";

interface UserAuthButtonProps {
  /** The context in which the button is rendered */
  mode: "fan" | "staff";
}

export default function UserAuthButton({ mode }: UserAuthButtonProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for auth changes to update the UI
    const unsubscribe = onAuthChange((profile, fbUser) => {
      if (profile && fbUser) {
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) setUser(profile);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsOpen(false);
  };

  // Render prominent Sign In button if not logged in
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-navy-950 font-extrabold py-2 px-4 rounded-full shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50"
        aria-label="Sign in with Google"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.16-2.112 4.12-1.056.84-2.4 1.56-5.728 1.56-5.328 0-9.696-4.368-9.696-9.696s4.368-9.696 9.696-9.696c2.88 0 5.04 1.14 6.6 2.604l2.304-2.304C19.104 1.356 16.032 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c3.744 0 6.6-1.224 8.8-3.528 2.256-2.256 2.964-5.46 2.964-8.028 0-.66-.06-1.284-.18-1.872h-11.58z" />
          </svg>
        )}
        <span className="hidden sm:inline">Sign In with Google</span>
        <span className="sm:hidden">Sign In</span>
      </button>
    );
  }

  // Render user profile and logout if logged in
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-navy-800/80 hover:bg-navy-700 p-1 pr-3 rounded-full border border-white/10 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-electric-500/20 border border-electric-500/20 flex items-center justify-center">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-electric-400" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-white leading-none mb-0.5">
            {user.displayName?.split(" ")[0]}
          </p>
          <p className="text-[10px] text-navy-400 leading-none">
            Staff Mode
          </p>
        </div>
        <ChevronDown className={`w-3 h-3 text-navy-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-navy-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
            <div className="p-3 border-b border-white/5 bg-white/5">
              <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-navy-400 truncate">{user.email}</p>
            </div>
            <div className="p-1">
              <div className="px-3 py-2 flex items-center gap-2 text-[10px] font-bold text-electric-400 uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                Staff Role Active
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-red hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
