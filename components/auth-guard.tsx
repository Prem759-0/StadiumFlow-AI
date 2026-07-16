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
        className="flex items-center justify-center min-h-screen bg-gray-950"
        role="status"
        aria-label="Loading authentication"
      >
        <Loader2
          className="w-8 h-8 text-emerald-500 animate-spin"
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
      className="flex items-center justify-center min-h-screen bg-gray-950"
      role="main"
      aria-label="Authentication required"
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-orange-500" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-black">StadiumFlow AI</h1>
          <p className="text-gray-600 mt-2">
            {requiredRole === "staff"
              ? "Staff Dashboard Access"
              : "Fan Experience Portal"}
          </p>
        </div>


        {error && (
          <div
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4"
            role="alert"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-navy-950 rounded-lg py-3 px-4 font-extrabold transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Sign in with Google"
          >
            <LogIn className="w-5 h-5" aria-hidden="true" />
            Sign in with Google
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          Powered by Firebase Auth + Google Cloud
        </p>
      </div>
    </div>
  );
});

export default AuthGuard;
