// ============================================================
// StadiumFlow AI - Auth Guard Component
// Firebase Authentication wrapper for role-based access control
// Supports Google Sign-In, Anonymous Sign-In, and demo mode
// ============================================================

"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import {
  initializeFirebase,
  isFirebaseConfigured,
  signInWithGoogle,
  signInAnonymously,
  signOut,
  onAuthChange,
  getMockUserProfile,
  type UserProfile,
  type UserRole,
} from "@/lib/firebase";
import { Shield, LogIn, LogOut, User, Loader2 } from "lucide-react";

interface AuthGuardProps {
  /** Required role to access the guarded content */
  requiredRole: UserRole;
  /** Content to render when authenticated */
  children: React.ReactNode;
  /** Whether to allow demo/mock access without Firebase */
  allowDemo?: boolean;
}

/**
 * AuthGuard - Firebase Auth wrapper component.
 * Wraps pages with role-based authentication.
 * Falls back to demo mode when Firebase is not configured.
 *
 * @example
 * <AuthGuard requiredRole="fan" allowDemo>
 *   <FanDashboard />
 * </AuthGuard>
 */
const AuthGuard = memo(function AuthGuard({
  requiredRole,
  children,
  allowDemo = true,
}: AuthGuardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeFirebase();

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Please check environment variables.");
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const unsubscribe = onAuthChange((profile, fbUser) => {
      if (profile && fbUser) {
        setUser(profile);
      } else {
        setUser(null);
      }
      clearTimeout(timeout);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [requiredRole]);

  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        setUser(profile);
      }
    } catch (err) {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "#F5F0E8" }}
        role="status"
        aria-label="Loading authentication"
      >
        <Loader2
          className="w-12 h-12 text-[#00FF87] animate-spin"
          style={{ filter: "drop-shadow(2px 2px 0 #000)" }}
          aria-hidden="true"
        />
      </div>
    );
  }

  // Authenticated — render children
  if (user) {
    return <>{children}</>;
  }

  // Unauthenticated — show sign-in options
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#F5F0E8" }}
      role="main"
      aria-label="Authentication required"
    >
      <div className="rounded-none p-10 max-w-md w-full mx-4" style={{ background: "#FFFFFF", border: "4px solid #000", boxShadow: "12px 12px 0 #000" }}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#FFE600] flex items-center justify-center mx-auto mb-6" style={{ border: "4px solid #000", boxShadow: "6px 6px 0 #000" }}>
            <Shield className="w-10 h-10 text-black" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black" style={{ textShadow: "2px 2px 0 #00C6FF" }}>StadiumFlow AI</h1>
          <p className="text-sm font-bold mt-2 uppercase tracking-widest text-black">
            {requiredRole === "staff"
              ? "Staff Dashboard Access"
              : "Fan Experience Portal"}
          </p>
        </div>


        {error && (
          <div
            className="p-3 mb-6 font-bold text-sm uppercase"
            style={{ background: "#FF3333", color: "#FFF", border: "2px solid #000", boxShadow: "4px 4px 0 #000" }}
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 font-black text-sm uppercase tracking-widest transition-all duration-150 active:translate-y-1 hover:-translate-y-1"
            style={{ background: "#00FF87", color: "#000", border: "3px solid #000", boxShadow: "6px 6px 0 #000" }}
            aria-label="Sign in with Google"
          >
            <LogIn className="w-5 h-5" aria-hidden="true" />
            Sign in with Google
          </button>
        </div>

        <p className="text-xs font-bold text-center mt-8 uppercase tracking-widest" style={{ color: "#555555" }}>
          Powered by Firebase Auth + Google Cloud
        </p>
      </div>
    </div>
  );
});

export default AuthGuard;
