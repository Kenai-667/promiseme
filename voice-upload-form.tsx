"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleStop, Loader2, Mic2, Music2, Upload } from "lucide-react";
import { VOICE_CATEGORIES } from "@/lib/constants";

export default function VoiceUploadForm() {
  const router = useRouter();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recorded, setRecorded] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<number | null>(null);
  const selected = audioFile || recorded;

  useEffect(() => {
    if (!selected) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selected]);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
    recorder.current?.state === "recording" && recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function startRecording() {
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMessage("In-browser recording is not supported here. Please upload an audio file instead.");
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = mediaStream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined);
      recorder.current = mediaRecorder;
      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: mediaRecorder.mimeType || "audio/webm" });
        const file = new File([blob], `promiseme-voice-${Date.now()}.webm`, { type: blob.type });
        setRecorded(file);
        setAudioFile(null);
        setRecording(false);
        if (timer.current) window.clearInterval(timer.current);
        mediaStream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setRecorded(null);
      setRecording(true);
      setSeconds(0);
      timer.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setMessage("Microphone access was not available. You can still upload an audio file.");
    }
  }

  function stopRecording() {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    if (!selected) {
      setMessage("Upload an audio file or record a voice clip first.");
      return;
    }
    const element = event.currentTarget;
    const form = new FormData(element);
    form.delete("audio");
    form.append("audio", selected);
    setBusy(true);
    try {
      const response = await fetch("/api/voice", { method: "POST", body: form });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not publish voice clip.");
      setSuccess(true);
      setAudioFile(null);
      setRecorded(null);
      setSeconds(0);
      element.reset();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish voice clip.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="pm-card p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#00d564]/15 text-[#008c40]"><Mic2 className="h-5 w-5" /></div>
        <div>
          <h2 className="text-lg font-black">Share a voice</h2>
          <p className="text-xs text-gray-500">Upload audio or record right in your browser. No account needed.</p>
        </div>
        <span className="ml-auto rounded-full border border-[#00d564]/30 bg-[#f0fff6] px-3 py-1.5 text-xs font-black text-[#008c40]">Voice Studio</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="pm-label" htmlFor="voice-title">Voice title *</label>
            <input id="voice-title" name="title" className="pm-input" placeholder="e.g. Soft-spoken hero, Episode 1" maxLength={100} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="pm-label" htmlFor="voice-creator">Your name *</label>
              <input id="voice-creator" name="creator" className="pm-input" placeholder="Any display name" maxLength={60} required />
            </div>
            <div>
              <label className="pm-label" htmlFor="voice-category">Category</label>
              <select id="voice-category" name="category" className="pm-input" defaultValue="Character">
                {VOICE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="pm-label" htmlFor="voice-description">Description</label>
            <textarea id="voice-description" name="description" className="pm-input min-h-[86px]" placeholder="Describe the character, mood, language or use case..." maxLength={1000} />
          </div>
          <div>
            <label className="pm-label" htmlFor="voice-script">Transcript / sample line</label>
            <input id="voice-script" name="sampleScript" className="pm-input" placeholder="A line from your script (optional)" maxLength={500} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center">
            <Music2 className="mx-auto h-8 w-8 text-[#00d564]" />
            <p className="mt-2 text-sm font-black">Audio source</p>
            <p className="mt-1 text-xs text-gray-500">MP3, WAV, M4A, OGG or WEBM · up to 30 MB</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0b0c0e] px-5 py-2.5 text-xs font-black text-white hover:bg-gray-800">
              <Upload className="h-3.5 w-3.5" /> Choose audio
              <input type="file" name="audio" accept="audio/*" className="hidden" onChange={(event) => { setAudioFile(event.target.files?.[0] ?? null); setRecorded(null); }} />
            </label>
            <div className="my-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">or record now</div>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black text-white transition ${recording ? "bg-red-500 hover:bg-red-600" : "bg-[#8b5cf6] hover:bg-[#7c3aed]"}`}
            >
              {recording ? <><CircleStop className="h-3.5 w-3.5" /> Stop · {seconds}s</> : <><Mic2 className="h-3.5 w-3.5" /> Start recording</>}
            </button>
            {selected && (
              <div className="mt-4 rounded-xl bg-white p-3 text-left">
                <p className="mb-2 truncate text-xs font-bold text-gray-700">✓ {selected.name} ({(selected.size / 1024 / 1024).toFixed(2)} MB)</p>
                {previewUrl && <audio controls src={previewUrl} className="h-9 w-full" />}
              </div>
            )}
          </div>
          <div>
            <label className="pm-label" htmlFor="voice-cover">Cover art (optional)</label>
            <input id="voice-cover" name="cover" type="file" accept="image/*" className="pm-input text-xs" />
          </div>
          {message && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">{message}</div>}
          {success && <div className="inline-flex items-center gap-2 rounded-xl border border-[#00d564]/30 bg-[#f0fff6] p-3 text-xs font-bold text-[#008c40]"><CheckCircle2 className="h-4 w-4" /> Voice clip published to the library!</div>}
          <button type="submit" disabled={busy} className="pm-btn w-full py-3">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</> : <>Publish voice clip</>}
          </button>
        </div>
      </div>
    </form>
  );
}
