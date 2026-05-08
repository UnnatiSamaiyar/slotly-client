

"use client";

//@ts-nocheck
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function safeParseState(stateStr?: string | null) {
  if (!stateStr) return null;
  try {
    let base64 = stateStr.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const decoded = window.atob(base64);
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(stateStr));
    } catch {
      try { return JSON.parse(stateStr); } catch { return null; }
    }
  }
}

function pickApiBase() {
  const envBase = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    ""
  ).trim();
  if (envBase) return envBase.replace(/\/+$/, "");
  return "https://api.slotly.io";
}

// ── Lottie JSON embedded directly — no file hosting needed ───────────────────
const WELCOME_LOTTIE = { "v": "4.8.0", "meta": { "g": "LottieFiles AE 3.1.1", "a": "", "k": "", "d": "", "tc": "" }, "fr": 60, "ip": 0, "op": 493, "w": 428, "h": 123, "nm": "welcome", "ddd": 0, "assets": [], "layers": [{ "ddd": 0, "ind": 1, "ty": 4, "nm": "katman 2 Outlines", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [210.962, 63.445, 0], "ix": 2 }, "a": { "a": 0, "k": [217.377, 69.099, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0, "shapes": [{ "ty": "gr", "it": [{ "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 1, "k": [{ "i": { "x": 0.315, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 12, "s": [{ "i": [[0, 0], [-19.996, 3.807], [0, 0], [-18.895, 3.082], [19.742, -1.29], [-24.256, -8.085], [-0.766, 11.744], [5.66, -16.851], [-19.685, 5.741], [-1.452, 15.251], [7.149, -14.298], [-24.05, 0], [-13.969, 8.205], [0, 0], [4.449, -18.338], [-20.828, 10.921], [-24.102, 3.075], [0.647, -8.405], [10.851, 1.532], [-3.877, 8.419], [-6.217, 0.509], [-8.064, 0.981], [0, 0], [0, 0], [-9.446, -0.88], [0, 0], [-10.502, -2.2], [-11.05, -5.525], [-0.766, 11.745], [5.66, -16.851], [-15.599, -0.035], [-2.016, 1.583]], "o": [[0, 0], [14.276, -2.719], [0, 0], [15.078, -2.46], [-12.066, 0.788], [15.247, 5.083], [0.883, -13.542], [-5.204, 15.495], [28.1, -8.195], [1.532, -16.085], [-6.678, 13.356], [13.262, 0], [9.918, -5.825], [0, 0], [-2.158, 8.896], [19.355, -10.149], [9.78, -1.247], [-0.893, 11.617], [-9.912, -1.399], [6.099, -13.245], [15.145, -1.239], [7.884, -0.959], [0, 0], [0, 0], [10.729, 1], [0, 0], [10.164, 2.129], [12.423, 6.212], [0.884, -13.542], [-4.553, 13.559], [9.878, 0.022], [0, 0]], "v": [[-188.452, -48.737], [-174.88, 37.534], [-150.861, -18.684], [-139.413, 37.589], [-115.605, -41.153], [-102.747, 24.964], [-71.062, 8.04], [-94.211, 9.061], [-70.73, 37.677], [-25.253, -28.982], [-42.615, -32.301], [-36.232, 38.678], [-2.148, 2.178], [14.548, -2.029], [-12.773, 17.608], [15.027, 35.678], [51.708, -0.699], [67.342, 18.38], [44.619, 38.295], [32.237, 14.423], [51.708, -0.699], [79.124, 17.623], [92.418, 5.764], [86.665, 37.388], [107.665, 2.07], [112.358, 29.353], [133.077, 2.635], [138.465, 37.258], [179.361, 8.554], [156.212, 9.575], [175.587, 38.838], [194.876, 31.741]], "c": false }] }, { "i": { "x": 0.833, "y": 1 }, "o": { "x": 0.167, "y": 0 }, "t": 110, "s": [{ "i": [[0, 0], [-19.996, 3.807], [0, 0], [-18.895, 3.082], [19.742, -1.29], [-24.256, -8.085], [-0.766, 11.744], [5.66, -16.851], [-19.685, 5.741], [-1.452, 15.251], [7.149, -14.298], [-24.05, 0], [-13.969, 8.205], [0, 0], [4.449, -18.338], [-20.828, 10.921], [-24.102, 3.075], [0.647, -8.405], [10.851, 1.532], [-3.877, 8.419], [-6.217, 0.509], [-8.064, 0.981], [0, 0], [0, 0], [-9.446, -0.88], [0, 0], [-10.502, -2.2], [-11.05, -5.525], [-0.766, 11.745], [5.66, -16.851], [-15.599, -0.035], [-2.016, 1.583]], "o": [[0, 0], [14.276, -2.719], [0, 0], [15.078, -2.46], [-12.066, 0.788], [15.247, 5.083], [0.883, -13.542], [-5.204, 15.495], [28.1, -8.195], [1.532, -16.085], [-6.678, 13.356], [13.262, 0], [9.918, -5.825], [0, 0], [-2.158, 8.896], [19.355, -10.149], [9.78, -1.247], [-0.893, 11.617], [-9.912, -1.399], [6.099, -13.245], [15.145, -1.239], [7.884, -0.959], [0, 0], [0, 0], [10.729, 1], [0, 0], [10.164, 2.129], [12.423, 6.212], [0.884, -13.542], [-4.553, 13.559], [9.878, 0.022], [0, 0]], "v": [[-187.452, -42.737], [-174.88, 37.534], [-150.861, -18.684], [-139.413, 37.589], [-115.605, -41.153], [-102.747, 24.964], [-71.062, 8.04], [-94.211, 9.061], [-70.73, 37.677], [-25.253, -28.982], [-42.615, -32.301], [-36.232, 38.678], [-2.148, 2.178], [14.548, -2.029], [-12.773, 17.608], [15.027, 35.678], [51.708, -0.699], [67.342, 18.38], [44.619, 38.295], [32.237, 14.423], [51.708, -0.699], [79.124, 17.623], [92.418, 5.764], [86.665, 37.388], [107.665, 2.07], [111.858, 34.353], [133.077, 2.635], [138.465, 37.258], [179.361, 8.554], [156.212, 9.575], [175.587, 38.838], [194.876, 31.741]], "c": false }] }, { "i": { "x": 0.833, "y": 1 }, "o": { "x": 0.167, "y": 0 }, "t": 196, "s": [{ "i": [[0, 0], [-19.996, 3.807], [0, 0], [-18.895, 3.082], [19.742, -1.29], [-24.256, -8.085], [-0.766, 11.744], [5.66, -16.851], [-19.685, 5.741], [-1.452, 15.251], [7.149, -14.298], [-24.05, 0], [-13.969, 8.205], [0, 0], [4.449, -18.338], [-20.828, 10.921], [-24.102, 3.075], [0.647, -8.405], [10.851, 1.532], [-3.877, 8.419], [-6.217, 0.509], [-8.064, 0.981], [0, 0], [0, 0], [-9.446, -0.88], [0, 0], [-10.605, -1.634], [-11.05, -5.525], [-0.766, 11.745], [5.66, -16.851], [-15.599, -0.035], [-2.016, 1.583]], "o": [[0, 0], [14.276, -2.719], [0, 0], [15.078, -2.46], [-12.066, 0.788], [15.247, 5.083], [0.883, -13.542], [-5.204, 15.495], [28.1, -8.195], [1.532, -16.085], [-6.678, 13.356], [13.262, 0], [9.918, -5.825], [0, 0], [-2.158, 8.896], [19.355, -10.149], [9.78, -1.247], [-0.893, 11.617], [-9.912, -1.399], [6.099, -13.245], [15.145, -1.239], [7.884, -0.959], [0, 0], [0, 0], [10.729, 1], [0, 0], [12.461, 1.921], [12.423, 6.212], [0.884, -13.542], [-4.553, 13.559], [9.878, 0.022], [0, 0]], "v": [[-187.452, -42.737], [-174.88, 37.534], [-150.861, -18.684], [-139.413, 37.589], [-115.605, -41.153], [-102.747, 24.964], [-71.062, 8.04], [-94.21, 9.061], [-70.73, 37.677], [-25.253, -28.982], [-42.615, -32.301], [-36.232, 38.678], [-2.148, 2.178], [14.547, -2.029], [-12.773, 17.608], [15.027, 35.678], [51.708, -0.699], [67.342, 18.38], [44.619, 38.295], [32.236, 14.423], [51.708, -0.699], [79.124, 17.623], [92.418, 5.764], [86.665, 37.388], [107.665, 2.07], [111.858, 35.853], [133.077, 2.635], [138.465, 37.258], [179.361, 8.554], [156.212, 9.575], [175.587, 38.838], [197.876, 29.741]], "c": false }] }, { "t": 292, "s": [{ "i": [[0, 0], [-19.996, 3.807], [0, 0], [-18.895, 3.082], [19.742, -1.29], [-24.256, -8.085], [-0.766, 11.744], [5.66, -16.851], [-19.685, 5.741], [-1.452, 15.251], [7.149, -14.298], [-24.05, 0], [-13.969, 8.205], [0, 0], [4.449, -18.338], [-20.828, 10.921], [-24.102, 3.075], [0.647, -8.405], [10.851, 1.532], [-3.877, 8.419], [-6.217, 0.509], [-8.064, 0.981], [0, 0], [0, 0], [-9.446, -0.88], [0, 0], [-10.705, -0.732], [-11.05, -5.525], [-0.766, 11.745], [5.66, -16.851], [-15.599, -0.035], [-2.016, 1.583]], "o": [[0, 0], [14.276, -2.719], [0, 0], [15.078, -2.46], [-12.066, 0.788], [15.247, 5.083], [0.883, -13.542], [-5.204, 15.495], [28.1, -8.195], [1.532, -16.085], [-6.678, 13.356], [13.262, 0], [9.918, -5.825], [0, 0], [-2.158, 8.896], [19.355, -10.149], [9.78, -1.247], [-0.893, 11.617], [-9.912, -1.399], [6.099, -13.245], [15.145, -1.239], [7.884, -0.959], [0, 0], [0, 0], [10.729, 1], [0, 0], [13.461, 0.921], [12.423, 6.212], [0.884, -13.542], [-4.553, 13.559], [9.878, 0.022], [0, 0]], "v": [[-187.452, -42.737], [-174.88, 37.534], [-150.861, -18.684], [-139.413, 37.589], [-115.605, -41.153], [-102.747, 24.964], [-71.062, 8.04], [-94.211, 9.061], [-70.73, 37.677], [-25.253, -28.982], [-42.615, -32.301], [-36.232, 38.678], [-2.148, 2.178], [14.548, -2.029], [-12.773, 17.608], [15.027, 35.678], [51.708, -0.699], [67.342, 18.38], [44.619, 38.295], [32.237, 14.423], [51.708, -0.699], [79.124, 17.623], [92.418, 5.764], [86.665, 37.388], [107.665, 2.07], [111.858, 35.353], [133.077, 2.635], [138.465, 37.258], [179.361, 8.554], [156.212, 9.575], [175.587, 38.838], [194.876, 31.741]], "c": false }] }], "ix": 2 }, "nm": "Path 1", "mn": "ADBE Vector Shape - Group", "hd": false }, { "ty": "tm", "s": { "a": 1, "k": [{ "i": { "x": [0.667], "y": [1] }, "o": { "x": [0.414], "y": [0] }, "t": 292, "s": [0] }, { "t": 470, "s": [100] }], "ix": 1 }, "e": { "a": 1, "k": [{ "i": { "x": [0.588], "y": [1] }, "o": { "x": [0.409], "y": [0.273] }, "t": 12, "s": [0] }, { "t": 196, "s": [100] }], "ix": 2 }, "o": { "a": 0, "k": 0, "ix": 3 }, "m": 1, "ix": 2, "nm": "Trim Paths 1", "mn": "ADBE Vector Filter - Trim", "hd": false }, { "ty": "gs", "o": { "a": 0, "k": 100, "ix": 9 }, "w": { "a": 0, "k": 9, "ix": 10 }, "g": { "p": 11, "k": { "a": 0, "k": [0, 0.6314, 0.6784, 0.7176, 0.093, 0.3326, 0.5497, 0.7274, 0.187, 0.3578, 0.6462, 0.8822, 0.293, 0.2198, 0.561, 0.8402, 0.399, 0.08, 0.586, 1, 0.504, 0.12, 0.604, 1, 0.609, 0.14, 0.613, 1, 0.712, 0.3, 0.685, 1, 0.814, 0.48, 0.2, 1, 0.907, 0.5294, 0.2745, 1, 1, 0.236, 0.6364, 0.964], "ix": 8 } }, "s": { "a": 1, "k": [{ "i": { "x": 0.283, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 34, "s": [-253.742, -70.793], "to": [8.667, 8.833], "ti": [-8.667, -8.833] }, { "t": 282, "s": [-201.742, -17.793] }], "ix": 4 }, "e": { "a": 1, "k": [{ "i": { "x": 0.283, "y": 1 }, "o": { "x": 0.333, "y": 0 }, "t": 34, "s": [118.488, 29.074], "to": [10.667, -3.5], "ti": [-10.667, 3.5] }, { "t": 282, "s": [182.488, 8.074] }], "ix": 5 }, "t": 1, "lc": 2, "lj": 2, "bm": 0, "nm": "Gradient Stroke 1", "mn": "ADBE Vector Graphic - G-Stroke", "hd": false }, { "ty": "tr", "p": { "a": 0, "k": [217.377, 69.099], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }], "nm": "Group 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false }], "ip": 0, "op": 608, "st": 0, "bm": 0 }], "markers": [] };

// ── Drop + fill loader ────────────────────────────────────────────────────────
function SlotlyLoader({ onFilled }: { onFilled: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const filledCalledRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 120, H = 160, cx = 60, cy = 112, R = 44;
    const TEAL = "#1D9E75", TEAL_LIGHT = "#5DCAA5";
    const TOTAL = 4.2;
    const easeIn = (t: number) => t * t * t;
    const easeOut = (t: number) => 1 - (1 - t) ** 3;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    function draw(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ((ts - startRef.current) / 1000) % TOTAL;
      const t = elapsed / TOTAL;
      ctx.clearRect(0, 0, W, H);
      const dotP = clamp((t - 0.00) / 0.22, 0, 1);
      const traceP = clamp((t - 0.18) / 0.34, 0, 1);
      const fillP = clamp((t - 0.48) / 0.30, 0, 1);
      const fadeP = clamp((t - 0.74) / 0.18, 0, 1);
      if (fillP >= 1 && !filledCalledRef.current) {
        filledCalledRef.current = true;
        onFilled();
      }
      if (dotP < 1) {
        const dotY = 14 + easeIn(dotP) * (cy - R - 14);
        const alpha = dotP < 0.95 ? 1 : 1 - (dotP - 0.95) / 0.05;
        if (alpha > 0) {
          ctx.save(); ctx.globalAlpha = alpha;
          ctx.beginPath(); ctx.arc(cx, dotY, 4, 0, Math.PI * 2);
          ctx.fillStyle = TEAL; ctx.fill(); ctx.restore();
        }
      }
      if (traceP > 0) {
        const alpha = clamp(1 - fadeP * 1.4, 0, 1);
        if (alpha > 0) {
          ctx.save(); ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + easeOut(traceP) * Math.PI * 2);
          ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.lineCap = "round";
          ctx.stroke(); ctx.restore();
        }
      }
      if (fillP > 0) {
        const alpha = clamp(1 - (fadeP > 0.4 ? (fadeP - 0.4) / 0.6 : 0), 0, 1);
        if (alpha > 0) {
          const liquidTop = cy + R - easeOut(fillP) * (R * 2 + 10);
          const waveAmp = 5 * (1 - fillP * 0.6);
          const waveX = (elapsed * 80) % 100;
          const left = cx - R - 4, right = cx + R + 4;
          ctx.save(); ctx.globalAlpha = alpha;
          ctx.beginPath(); ctx.arc(cx, cy, R - 1, 0, Math.PI * 2); ctx.clip();
          ctx.beginPath(); ctx.moveTo(left, liquidTop);
          for (let x = left; x <= right; x += 2)
            ctx.lineTo(x, liquidTop + Math.sin((x + waveX) * 0.1) * waveAmp);
          ctx.lineTo(right, cy + R + 8); ctx.lineTo(left, cy + R + 8);
          ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill();
          ctx.beginPath(); ctx.moveTo(left, liquidTop + 4);
          for (let x = left; x <= right; x += 2)
            ctx.lineTo(x, liquidTop + 4 + Math.sin((x + waveX + 40) * 0.1) * waveAmp * 0.6);
          ctx.lineTo(right, cy + R + 8); ctx.lineTo(left, cy + R + 8);
          ctx.closePath(); ctx.fillStyle = TEAL_LIGHT;
          ctx.globalAlpha = alpha * 0.35; ctx.fill();
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return <canvas ref={canvasRef} width={120} height={160} />;
}

// ── Welcome: Lottie JSON embedded inline ─────────────────────────────────────
// Plays forward (write) → holds → plays reverse (erase) → calls onComplete
function WelcomeScript({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any = null;
    let eraseTimer: any = null;
    let destroyed = false;

    import("lottie-web").then((mod) => {
      if (destroyed) return;
      const lottie = mod.default ?? mod;

      anim = lottie.loadAnimation({
        container: containerRef.current!,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: WELCOME_LOTTIE,   // ← inline JSON, no network request
      });

      // The Lottie has its own write (0→196) then erase (292→470) baked in.
      // We just let it play to completion and then call onComplete.
      anim.addEventListener("complete", () => {
        if (destroyed) return;
        // Brief pause after the animation finishes, then redirect
        eraseTimer = setTimeout(() => {
          if (!destroyed) onComplete();
        }, 300);
      });
    });

    return () => {
      destroyed = true;
      clearTimeout(eraseTimer);
      if (anim) anim.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: 380, height: 110, maxWidth: "100%" }}
    />
  );
}

// ── Animated dots ─────────────────────────────────────────────────────────────
function AnimatedDots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ display: "inline-block", width: 18, textAlign: "left" }}>{dots}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────

function GoogleCallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState<"loading" | "welcome" | "done" | "error">("loading");
  const [message, setMessage] = useState("Completing login…");

  const code = sp.get("code");
  const stateStr = sp.get("state");
  const stateObj = useMemo(() => safeParseState(stateStr), [stateStr]);
  const exchangeStartedRef = useRef(false);
  const loaderFilledRef = useRef(false);
  const authReadyRef = useRef(false);

  const returnTo = useMemo(() => {
    const rt = stateObj?.fromCreateEventModal
      ? "/dashboard/event-types?create_event=1"
      : stateObj?.returnTo;
    if (typeof rt === "string" && rt.startsWith("/")) return rt;
    return "/dashboard";
  }, [stateObj]);

  function tryShowWelcome() {
    if (loaderFilledRef.current && authReadyRef.current) setStatus("welcome");
  }
  function onLoaderFilled() { loaderFilledRef.current = true; tryShowWelcome(); }
  function onAuthReady() { authReadyRef.current = true; tryShowWelcome(); }
  function onWelcomeComplete() {
    setStatus("done");
    router.replace(returnTo);
    router.refresh();
  }

  useEffect(() => {
    if (exchangeStartedRef.current) return;
    exchangeStartedRef.current = true;
    let cancelled = false;

    async function run() {
      try {
        if (!code) {
          setStatus("error");
          setMessage("Missing OAuth code. Please try logging in again.");
          return;
        }
        const API_BASE = pickApiBase();
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            code,
            state: stateStr || null,
            mode: stateObj?.mode || "login",
            returnTo,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Login failed");
        }
        const payload = await res.json();
        const user =
          payload?.user || payload?.data?.user ||
          payload?.profile || payload?.data?.profile || payload;
        const sub = user?.sub || user?.google_sub || user?.id || null;
        if (!sub) throw new Error("Login succeeded but user id (sub) was not returned by server.");

        const session = {
          sub: String(sub),
          email: user?.email || "",
          name: user?.name || "",
          picture: user?.picture || "",
          image: user?.picture || "",
          raw: user,
        };
        const sessionWithExpiry = {
          ...session,
          expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem("slotly_user", JSON.stringify(sessionWithExpiry));
        sessionStorage.setItem("slotly_user", JSON.stringify(sessionWithExpiry));
        const token = payload?.token || payload?.access_token || null;
        if (token) {
          localStorage.setItem("slotly_token", token);
          localStorage.setItem("access_token", token);
          sessionStorage.setItem("slotly_token", token);
          sessionStorage.setItem("access_token", token);
        }
        window.dispatchEvent(new Event("slotly-auth-changed"));
        if (cancelled) return;
        onAuthReady();
      } catch (e: any) {
        if (cancelled) return;
        console.error("Google callback error:", e);
        setStatus("error");
        setMessage(e?.message || "Login failed. Please try again.");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [code, stateStr, returnTo, stateObj]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        {/* ── Loading ── */}
        {status === "loading" && (
          <>
            <SlotlyLoader onFilled={onLoaderFilled} />
            <div className="mt-6">
              <p className="text-xl font-semibold text-gray-900">Signing you in</p>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
            </div>
          </>
        )}

        {/* ── Welcome: Lottie plays write then erase ── */}
        {status === "welcome" && (
          <>
            <WelcomeScript onComplete={onWelcomeComplete} />
            <div style={{
              width: 40, height: 2, borderRadius: 2,
              background: "linear-gradient(90deg,#5DCAA5,#1D9E75)",
              margin: "4px auto 16px",
            }} />
            <p style={{
              fontSize: 15, fontWeight: 500, color: "#374151",
              margin: 0, letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              You&apos;re all set
            </p>
            <p style={{
              marginTop: 6, fontSize: 13, color: "#9ca3af",
              display: "flex", alignItems: "center", gap: 2,
            }}>
              Taking you to your dashboard<AnimatedDots />
            </p>
          </>
        )}

        {/* ── Done (momentary while router fires) ── */}
        {status === "done" && (
          <p className="text-sm text-gray-400">Redirecting…</p>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#fef2f2",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20, fontSize: 22, color: "#ef4444",
            }}>✕</div>
            <p className="text-xl font-semibold text-gray-900">Login Failed</p>
            <p className="mt-2 text-sm text-red-500">{message}</p>
            <button
              onClick={() => router.replace("/login")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-sm text-gray-400">Signing you in…</div>
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}