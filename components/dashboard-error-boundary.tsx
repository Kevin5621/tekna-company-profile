"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Dashboard Error Boundary caught an error:",
      error,
      errorInfo
    );

    // If it's an auth error, redirect to login
    if (
      error.message.includes("Admin access required") ||
      error.message.includes("Not authenticated") ||
      error.message.includes("User not authorized")
    ) {
      window.location.href = "/auth/login";
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-destructive">
              An Error Occurred
            </h1>
            <p className="text-muted-foreground max-w-md">
              Sorry, an error occurred while loading the dashboard. Please try refreshing the page or contact the administrator.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
            <button
              onClick={() => (window.location.href = "/auth/login")}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
