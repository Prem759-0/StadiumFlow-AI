// ============================================================
// StadiumFlow AI - Error Boundary Component
// Gracefully handles React runtime errors with recovery UI
// ============================================================

"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  /** Content to render */
  children: ReactNode;
  /** Custom fallback UI (optional) */
  fallback?: ReactNode;
  /** Name of the section for error tracking */
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches React rendering errors and shows a recovery UI.
 * Prevents the entire application from crashing due to a single component failure.
 *
 * @example
 * <ErrorBoundary sectionName="StadiumMap">
 *   <StadiumMap zones={zones} />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[ErrorBoundary] ${this.props.sectionName || "Unknown"} crashed:`,
      error,
      errorInfo
    );
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 m-4"
          role="alert"
          aria-label="Component error"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle
              className="w-6 h-6 text-red-400 flex-shrink-0"
              aria-hidden="true"
            />
            <h3 className="text-red-300 font-semibold text-lg">
              {this.props.sectionName
                ? `${this.props.sectionName} encountered an error`
                : "Something went wrong"}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            This section failed to load. The rest of the application is
            unaffected.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="text-xs text-red-400/70 bg-black/30 rounded p-3 mb-4 overflow-x-auto max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Retry loading this section"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
