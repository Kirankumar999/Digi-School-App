"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface StudentPhotoCaptureProps {
  currentPhoto: string;
  studentName: string;
  onSave: (base64: string) => Promise<void>;
  onClose: () => void;
}

type Tab = "upload" | "camera";

export function StudentPhotoCapture({ currentPhoto, studentName, onSave, onClose }: StudentPhotoCaptureProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const [preview, setPreview] = useState(currentPhoto || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Could not access camera. Please allow camera permissions.");
    }
  }, []);

  useEffect(() => {
    if (tab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [tab, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7);
    setPreview(base64);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 400 * 1024) {
      setError("Image must be under 400KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(preview);
    } catch {
      setError("Failed to save photo");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave("");
      setPreview("");
    } catch {
      setError("Failed to remove photo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Student Photo</h3>
            <p className="text-xs text-slate-500">{studentName}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 text-xl cursor-pointer">&times;</button>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === "upload" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload
          </button>
          <button
            onClick={() => setTab("camera")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              tab === "camera" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Camera
          </button>
        </div>

        {/* Upload tab */}
        {tab === "upload" && (
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-40 h-40 rounded-2xl object-cover ring-4 ring-slate-100 shadow-lg" />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-4xl font-bold ring-4 ring-slate-100 shadow-lg">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="py-2 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
            >
              Choose from device
            </button>
            <p className="text-[11px] text-slate-400 mt-2">JPG, PNG or GIF. Max 400KB.</p>
          </div>
        )}

        {/* Camera tab */}
        {tab === "camera" && (
          <div className="flex flex-col items-center">
            {cameraError ? (
              <div className="w-full max-w-sm p-6 text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-rose font-medium">{cameraError}</p>
                <button onClick={startCamera} className="mt-3 text-sm text-teal font-semibold hover:underline cursor-pointer">
                  Try again
                </button>
              </div>
            ) : cameraActive ? (
              <>
                <div className="relative rounded-2xl overflow-hidden shadow-lg ring-4 ring-slate-100 mb-4">
                  <video ref={videoRef} autoPlay playsInline muted className="w-80 h-60 object-cover bg-black" />
                  <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />
                </div>
                <button
                  onClick={capturePhoto}
                  className="w-14 h-14 rounded-full bg-white border-4 border-rose shadow-lg hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-rose" />
                </button>
                <p className="text-xs text-slate-400 mt-2">Click to capture</p>
              </>
            ) : preview ? (
              <div className="flex flex-col items-center">
                <img src={preview} alt="Captured" className="w-40 h-40 rounded-2xl object-cover ring-4 ring-slate-100 shadow-lg mb-4" />
                <button
                  onClick={() => { setPreview(""); startCamera(); }}
                  className="py-2 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <svg className="w-8 h-8 animate-spin mx-auto mb-2 text-slate-300" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-slate-400">Starting camera...</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {error && <div className="mt-4 p-3 rounded-xl bg-rose/10 border border-rose/20 text-sm text-rose font-medium text-center">{error}</div>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-slate-100">
        <div>
          {preview && currentPhoto && (
            <button onClick={handleRemove} disabled={saving} className="py-2 px-4 rounded-xl text-rose text-sm font-medium hover:bg-rose/5 transition cursor-pointer disabled:opacity-50">
              Remove photo
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!preview || saving}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal to-emerald text-white text-sm font-semibold shadow-lg shadow-teal/25 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
