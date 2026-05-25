"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Check } from "lucide-react";
import { uploadMedicalReport } from "@/services/upload-services";

export function UploadDropzone() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsLoading(true);

    try {
      const result = await uploadMedicalReport(file);
      setExtractedText(result.extracted_text);
      console.log("Backend response:", result);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="mt-12 w-full max-w-2xl">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center transition ${
          isDragActive
            ? "border-white bg-zinc-900"
            : "border-zinc-700 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          <UploadCloud className="h-14 w-14 text-zinc-400" />

          <h3 className="mt-6 text-2xl font-semibold text-white">
            Upload Medical Report
          </h3>

          <p className="mt-3 text-zinc-400">
            Drag & drop your PDF report here or click to browse.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Supported format: PDF
          </p>
        </div>
      </div>

      {uploadedFile && (
        <>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-white" />
                <div>
                  <h4 className="font-medium text-white">
                    {uploadedFile.name}
                  </h4>
                  <p className="text-sm text-zinc-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isLoading && extractedText && (
                <Check className="h-6 w-6 text-green-500" />
              )}
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-center text-zinc-400">
                Processing your document...
              </p>
            </div>
          )}

          {extractedText && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Extracted Medical Text
              </h3>

              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-black p-4 text-sm leading-7 text-zinc-300">
                {extractedText}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}