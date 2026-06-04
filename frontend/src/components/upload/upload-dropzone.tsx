"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud, FileText, Check, Loader2,
  AlertTriangle, ChevronDown, ChevronUp,
  MessageSquare, BookOpen, Activity, ShieldAlert, Info,
} from "lucide-react";
import { uploadMedicalReport } from "@/services/upload-services";

// ── Types ──────────────────────────────────────────────────────────────────────

type RiskLevel = "low" | "moderate" | "high" | "critical";
type Step = "idle" | "uploading" | "analyzing" | "done" | "error";

interface AnalysisResult {
  report_type: string;
  summary: string;
  important_findings: {
    finding: string;
    significance: "low" | "moderate" | "high";
    explanation: string;
  }[];
  abnormal_values: {
    parameter: string;
    value: string;
    normal_range?: string;
    status: "high" | "low" | "abnormal" | "borderline";
    explanation: string;
  }[];
  risk_level: RiskLevel;
  risk_explanation: string;
  suggested_questions: string[];
  terminology_explanations: {
    term: string;
    simple_explanation: string;
  }[];
  disclaimer: string;
  confidence_score: number;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bar: string; width: string; border: string; bg: string }> = {
  low:      { label: "Low Risk",  color: "text-emerald-400", bar: "bg-emerald-500", width: "w-1/4", border: "border-emerald-900", bg: "bg-emerald-950/30" },
  moderate: { label: "Moderate",  color: "text-amber-400",   bar: "bg-amber-500",   width: "w-2/4", border: "border-amber-900",   bg: "bg-amber-950/30"   },
  high:     { label: "High",      color: "text-orange-400",  bar: "bg-orange-500",  width: "w-3/4", border: "border-orange-900",  bg: "bg-orange-950/30"  },
  critical: { label: "Critical",  color: "text-red-400",     bar: "bg-red-600",     width: "w-full",border: "border-red-900",     bg: "bg-red-950/30"     },
};

const STATUS_BADGE: Record<string, string> = {
  high:       "bg-orange-950 text-orange-400 border-orange-800",
  low:        "bg-blue-950   text-blue-400   border-blue-800",
  abnormal:   "bg-red-950    text-red-400    border-red-800",
  borderline: "bg-yellow-950 text-yellow-400 border-yellow-800",
};

const STATUS_LABEL: Record<string, string> = {
  high: "↑ High", low: "↓ Low", abnormal: "⚠ Abnormal", borderline: "~ Borderline",
};

// ── Analyze helper (inline, no extra service file needed) ──────────────────────

async function runAnalysis(extractedText: string, filename: string): Promise<AnalysisResult> {
  const res = await fetch("http://127.0.0.1:8000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ extracted_text: extractedText, filename }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Analysis failed (${res.status})`);
  }
  return res.json();
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function UploadDropzone() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setAnalysis(null);
    setErrorMsg("");
    setStep("uploading");

    try {
      // Step 1: Upload + OCR
      const uploadResult = await uploadMedicalReport(file);
      const extracted: string = uploadResult.extracted_text ?? "";

      if (extracted.trim().length < 50) {
        throw new Error("Could not extract enough text. Try a clearer scan or a text-based PDF.");
      }

      // Step 2: AI Analysis
      setStep("analyzing");
      const result = await runAnalysis(extracted, file.name);
      setAnalysis(result);
      setStep("done");

    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
      setStep("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: step === "uploading" || step === "analyzing",
  });

  const reset = () => {
    setUploadedFile(null);
    setAnalysis(null);
    setStep("idle");
    setErrorMsg("");
  };

  // ── Idle: Drop Zone ──────────────────────────────────────────────────────────

  if (step === "idle") {
    return (
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition ${
          isDragActive ? "border-white bg-zinc-900" : "border-zinc-700 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-zinc-500" />
        <h3 className="mt-4 text-lg font-semibold text-white">Upload Medical Report</h3>
        <p className="mt-2 text-sm text-zinc-500">Drag & drop your PDF here, or click to browse</p>
        <p className="mt-1 text-xs text-zinc-600">Supported format: PDF</p>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (step === "uploading" || step === "analyzing") {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-400" />
        <p className="mt-4 text-sm font-semibold text-white">
          {step === "uploading" ? "Extracting text from document…" : "Analyzing with AI…"}
        </p>
        <p className="mt-1 text-xs text-zinc-600">
          {step === "uploading"
            ? "Running OCR pipeline"
            : "Identifying findings · explaining terminology · assessing risk"}
        </p>
        {uploadedFile && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-500">
            <FileText className="h-3.5 w-3.5" />
            {uploadedFile.name}
          </div>
        )}
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (step === "error") {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/20 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-300">Something went wrong</p>
            <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
          </div>
        </div>
        <button
          onClick={reset}
          className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Done: Results ────────────────────────────────────────────────────────────

  if (step === "done" && analysis) {
    const risk = RISK_CONFIG[analysis.risk_level];
    return (
      <div className="space-y-4">

        {/* File bar */}
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-zinc-500" />
            <div>
              <p className="text-sm font-medium text-white">{uploadedFile?.name}</p>
              <p className="text-xs text-zinc-600">
                {uploadedFile ? (uploadedFile.size / 1024 / 1024).toFixed(2) + " MB · " : ""}
                {analysis.report_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-emerald-500" />
            <button
              onClick={reset}
              className="text-xs text-zinc-600 underline-offset-2 transition hover:text-white hover:underline"
            >
              Upload new
            </button>
          </div>
        </div>

        {/* Risk Meter */}
        <div className={`rounded-2xl border ${risk.border} ${risk.bg} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">Risk Indicator</p>
              <p className={`text-xl font-bold ${risk.color}`}>{risk.label}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.border} ${risk.color}`}>
              {Math.round(analysis.confidence_score * 100)}% confidence
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className={`h-full rounded-full transition-all duration-700 ${risk.bar} ${risk.width}`} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{analysis.risk_explanation}</p>
        </div>

        {/* Summary */}
        <Section icon={Info} title="Summary">
          <p className="text-sm leading-relaxed text-zinc-400">{analysis.summary}</p>
        </Section>

        {/* Abnormal Values */}
        {analysis.abnormal_values.length > 0 && (
          <Section icon={Activity} title={`Abnormal Values (${analysis.abnormal_values.length})`}>
            <div className="space-y-3">
              {analysis.abnormal_values.map((item, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {item.parameter}{" "}
                      <span className="text-indigo-400">{item.value}</span>
                      {item.normal_range && (
                        <span className="ml-2 text-xs text-zinc-600">normal: {item.normal_range}</span>
                      )}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[item.status]}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.explanation}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Important Findings */}
        {analysis.important_findings.length > 0 && (
          <Section icon={AlertTriangle} title="Important Findings">
            <div className="space-y-3">
              {analysis.important_findings.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    item.significance === "high" ? "bg-red-500" :
                    item.significance === "moderate" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-white">{item.finding}</p>
                    <p className="text-xs leading-relaxed text-zinc-500">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Questions for doctor */}
        {analysis.suggested_questions.length > 0 && (
          <Section icon={MessageSquare} title="Questions to Ask Your Doctor">
            <ul className="space-y-2">
              {analysis.suggested_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-zinc-400">{q}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Terminology */}
        {analysis.terminology_explanations.length > 0 && (
          <Section icon={BookOpen} title="Medical Terms Explained" defaultOpen={false}>
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.terminology_explanations.map((item, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-black/30 p-3">
                  <p className="mb-1 text-xs font-bold text-zinc-200">{item.term}</p>
                  <p className="text-xs leading-snug text-zinc-500">{item.simple_explanation}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-900/40 bg-amber-950/10 p-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">{analysis.disclaimer}</p>
        </div>

      </div>
    );
  }

  return null;
}

// ── Collapsible Section ────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-zinc-600" />
          : <ChevronDown className="h-4 w-4 text-zinc-600" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}