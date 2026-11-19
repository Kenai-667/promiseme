"use client";

import { useState } from "react";
import { Loader2, Pause, Play, Volume2 } from "lucide-react";

export type VoiceItem = {
  id: number;
  audioUrl: string | null;
  sampleScript: string | null;
  description: string;
  plays: number;
  durationLabel: string;
};

export default function VoicePlayer({ voice }: { voice: VoiceItem }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plays, setPlays] = useState(voice.plays);

  async function countPlay() {
    try {
      const response = await fetch("/api/voice/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: voice.id }),
      });
      const data = (await response.json()) as { plays?: number };
      if (typeof data.plays === "number") setPlays(data.plays);
    } catch {
      // Playback still works even if the counter request fails.
    }
  }

  function toggleSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voice.sampleScript || voice.description);
    utterance.rate = 0.88;
    utterance.pitch = 0.92;
    utterance.onend = () => {
      setPlaying(false);
      void countPlay();
    };
    utterance.onerror = () => setPlaying(false);
    setLoading(true);
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => {
      setLoading(false);
      setPlaying(true);
    }, 180);
  }

  if (voice.audioUrl) {
    return (
      <div className="mt-3">
        <audio controls preload="none" src={voice.audioUrl} onPlay={() => void countPlay()} className="h-9 w-full" />
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500"><Volume2 className="h-3.5 w-3.5" />{plays.toLocaleString()} plays · {voice.durationLabel}</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={toggleSpeech}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0c0e] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#00b957]"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        {playing ? "Stop sample" : "Play voice sample"}
      </button>
      <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500"><Volume2 className="h-3.5 w-3.5" />{plays.toLocaleString()} plays · browser voice preview</p>
    </div>
  );
}
