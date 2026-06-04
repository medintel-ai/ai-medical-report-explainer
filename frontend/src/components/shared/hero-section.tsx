"use client";

import { motion } from "framer-motion";
import { UploadDropzone } from "@/components/upload/upload-dropzone";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI-Powered Healthcare Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-7 text-5xl font-bold tracking-tight text-white md:text-6xl"
        >
          Understand Your{" "}
          <span className="text-zinc-400">Medical Reports</span>{" "}
          With AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 max-w-xl text-base leading-7 text-zinc-500"
        >
          Upload any medical report — blood work, MRI, CT scan, discharge
          summary — and get a plain-language explanation in seconds.
        </motion.p>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full"
        >
          <UploadDropzone />
        </motion.div>

        {/* Helper links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="mt-5 flex items-center gap-6 text-sm text-zinc-600"
        >
          <span>Supports PDF · JPG · PNG</span>
          <span>·</span>
          <a
            href="#architecture"
            className="transition hover:text-zinc-300"
          >
            View Architecture →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
