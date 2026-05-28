"use client";

import { motion } from "framer-motion";
import { UploadDropzone } from "@/components/upload/upload-dropzone";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
            AI-Powered Healthcare Intelligence
          </span>

          <h1 className="mt-8 max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Understand Medical Reports With AI
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Upload medical reports and receive patient-friendly explanations
            powered by OCR, NLP, healthcare RAG systems, and LLM intelligence.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button type="button" className="rounded-2xl bg-white px-8 py-4 font-medium text-black transition hover:opacity-90">
              Upload Report
            </button>
            <UploadDropzone />

            <button  type="button" className="rounded-2xl border border-zinc-700 px-8 py-4 font-medium text-white transition hover:bg-zinc-900">
              View Architecture
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}