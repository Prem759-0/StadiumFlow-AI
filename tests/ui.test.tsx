import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MatchCountdown from "@/components/match-countdown";

describe("MatchCountdown Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the match title", () => {
    render(<MatchCountdown />);
    expect(screen.getByText(/Brazil vs Argentina/i)).toBeInTheDocument();
    expect(screen.getByText(/MetLife Stadium/i)).toBeInTheDocument();
  });

  it("should initialize the timer", () => {
    render(<MatchCountdown />);
    expect(screen.getByText(/Hrs/i)).toBeInTheDocument();
  });
});
