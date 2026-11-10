"use client";

import React from "react";

interface State {
  hasError: boolean;
  message?: string;
}

interface Props {
  children: React.ReactNode;
  label?: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.label ?? "view"}]`, error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 12,
            textAlign: "center",
            padding: 32,
          }}
        >
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {this.props.label ? `${this.props.label} had a problem.` : "Something went wrong."}
          </div>
          {this.state.message && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 360 }}>
              {this.state.message}
            </div>
          )}
          <button className="primary" onClick={this.handleReload}>
            Reload view
          </button>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}