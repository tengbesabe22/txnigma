"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useObject } from "@ai-sdk/react";
import { investigationResponseSchema } from "../investigation.stream";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  ArrowUpRight,
  CircleHelp,
  FileSearch,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import InvestigationResult from "./investigation-result";

const examples = [
  {
    label: "Failed payment",
    description: "Payment TX-102 failed but my bank shows a $150 charge.",
  },
  {
    label: "Possible duplicate",
    description:
      "TX-203 for $75 appears twice in my bank app. I clicked Pay once.",
  },
  {
    label: "Missing details",
    description: "My payment looks wrong. Can you investigate?",
  },
];

export default function InvestigationForm() {
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<
    "ready" | "loading" | "complete" | "failed" | "cancelled"
  >("ready");
  const isLoading = phase === "loading";
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  const { object, submit, stop, clear } = useObject({
    api: "/api/investigations",
    schema: investigationResponseSchema,
    fetch: (url, init) =>
      fetch(url, {
        ...init,
        signal: AbortSignal.any([
          init?.signal ?? new AbortController().signal,
          AbortSignal.timeout(45_000),
        ]),
      }),
    onFinish: ({ object: final, error: validationError }) => {
      if (!pending.current) return;
      pending.current = false;
      setPhase(final && !validationError ? "complete" : "failed");
      if (!final || validationError)
        setError(
          "The investigation did not finish correctly. Please try again.",
        );
    },
    onError: () => {
      if (!pending.current) return;
      pending.current = false;
      setPhase("failed");
      setError(
        "We couldn’t complete this investigation. Your description is preserved—please try again.",
      );
    },
  });
  const analysis = object?.analysis;

  useEffect(() => {
    if (phase === "complete") resultHeading.current?.focus();
  }, [phase]);
  useEffect(() => () => stop(), [stop]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = description.trim();
    if (pending.current || !trimmed || trimmed.length > 5000) return;
    pending.current = true;
    setPhase("loading");
    setError(null);
    submit({ description: trimmed });
  }

  function handleStop() {
    pending.current = false;
    stop();
    setPhase("cancelled");
    setError(
      "Investigation stopped. Any results shown are incomplete. You can try again.",
    );
  }

  return (
    <div className="investigation-grid">
      <Card className="panel intake gap-0" aria-labelledby="report-title">
        <div className="panel-heading">
          <span className="panel-icon">
            <FileSearch size={19} />
          </span>
          <span>NEW INVESTIGATION</span>
          <span className="panel-step">01</span>
        </div>
        <h2 id="report-title">Tell us what happened.</h2>
        <p className="muted">A few details can help connect the dots.</p>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="description" className="input-label">
            Your payment report <span>Required</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Payment TX-102 failed but my bank shows a $150 charge."
            className="report-input"
            rows={6}
            maxLength={5000}
            required
            disabled={isLoading}
            aria-describedby="description-help description-count"
          />
          <div className="field-meta">
            <span id="description-help">
              No card numbers, passwords, or personal data.
            </span>
            <span id="description-count">
              {description.length.toLocaleString()} / 5,000
            </span>
          </div>
          <div className="examples" id="sample-cases">
            <span className="examples-label">
              Need a starting point? <span>Try a sample.</span>
            </span>
            <div className="sample-buttons">
              {examples.map((example) => (
                <Button
                  variant="outline"
                  size="sm"
                  className="sample-case"
                  key={example.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setDescription(example.description);
                    clear();
                    setError(null);
                    setPhase("ready");
                  }}
                >
                  <span className="sample-indicator" />
                  {example.label}
                  <ArrowUpRight size={13} />
                </Button>
              ))}
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            size="lg"
            className="investigate-button"
            type="submit"
            disabled={isLoading || !description.trim()}
          >
            {isLoading
              ? "Investigating…"
              : error
                ? "Try again"
                : "Investigate payment"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Button>
          {isLoading && (
            <Button
              variant="outline"
              className="stop-button"
              type="button"
              onClick={handleStop}
            >
              Stop investigation
            </Button>
          )}
          <p className="form-footnote">
            <ShieldCheck size={13} />A safe space for synthetic payment
            scenarios.
          </p>
        </form>
      </Card>
      <Card
        className={`panel report gap-0 ${analysis ? "has-result" : ""}`}
        aria-labelledby="analysis-title"
        aria-busy={isLoading}
      >
        <div className="report-top">
          <div className="report-label">
            <Sparkles size={16} />
            <span>THE INVESTIGATION</span>
          </div>
          <Badge
            variant="secondary"
            className={`status ${phase === "complete" ? "complete" : ""}`}
          >
            {isLoading
              ? "In progress"
              : phase === "complete"
                ? "Complete"
                : phase === "cancelled"
                  ? "Stopped"
                  : error
                    ? "Incomplete"
                    : "Ready"}
          </Badge>
        </div>
        <h2 id="analysis-title" ref={resultHeading} tabIndex={-1}>
          Your path to clarity.
        </h2>
        <p role="status" className="sr-only">
          {isLoading
            ? "Investigation in progress."
            : phase === "complete"
              ? "Investigation complete."
              : ""}
        </p>
        {analysis ? (
          <InvestigationResult
            analysis={analysis}
            provisional={phase !== "complete"}
            isLoading={isLoading}
          />
        ) : (
          <div className="empty-state">
            <div
              className={`signal-illustration ${isLoading ? "working" : ""}`}
              aria-hidden="true"
            >
              <div className="signal-ring ring-outer" />
              <div className="signal-ring ring-inner" />
              <div className="signal-center">
                <ScanLine size={32} strokeWidth={1.3} />
              </div>
              <span className="signal-point point-one" />
              <span className="signal-point point-two" />
              <span className="floating-clue">
                <CircleHelp size={16} />
              </span>
            </div>
            <span className="empty-eyebrow">
              {isLoading
                ? "CONNECTING THE DOTS"
                : error
                  ? "LET’S TRY THAT AGAIN"
                  : "A NEW CASE STARTS HERE"}
            </span>
            <h3>
              {isLoading
                ? "A clearer picture is taking shape."
                : error
                  ? "Some questions take another try."
                  : "The first clue is your report."}
            </h3>
            <p>
              {isLoading
                ? "We’re exploring possible causes and the evidence that could help explain your payment."
                : error
                  ? "Your description is still here. Retry when you’re ready."
                  : "Describe what looks wrong. We’ll organize the possibilities and help you find the right questions to ask."}
            </p>
            <div className="report-outline">
              <span>
                <span className="outline-dot" />
                Possible causes
              </span>
              <span>
                <span className="outline-dot" />
                Missing evidence
              </span>
              <span>
                <span className="outline-dot" />
                Next steps
              </span>
            </div>
            <span className="empty-note">
              <ShieldCheck size={13} />
              Based on your report. No access to payment records.
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
