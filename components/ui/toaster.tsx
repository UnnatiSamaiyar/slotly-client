"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function VariantIcon({ variant }: { variant: "default" | "success" | "error" | "info" }) {
  const cls = "h-5 w-5";
  if (variant === "success") return <CheckCircle2 className={cn(cls, "text-emerald-600")} />;
  if (variant === "error") return <AlertTriangle className={cn(cls, "text-rose-600")} />;
  if (variant === "info") return <Info className={cn(cls, "text-blue-600")} />;
  return <Info className={cn(cls, "text-slate-600")} />;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[100] flex w-full flex-col gap-3 p-4",
        "top-0 sm:top-4 sm:right-4 sm:bottom-auto sm:left-auto",
        "sm:max-w-[420px]"
      )}
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto relative overflow-hidden rounded-2xl border bg-white/95 backdrop-blur",
              "shadow-[0_18px_45px_-20px_rgba(2,6,23,0.45)]",
              "ring-1 ring-black/5"
            )}
          >
            {/* subtle top accent */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-[3px]",
                t.variant === "success" && "bg-gradient-to-r from-emerald-500 to-teal-500",
                t.variant === "error" && "bg-gradient-to-r from-rose-500 to-red-500",
                t.variant === "info" && "bg-gradient-to-r from-blue-500 to-indigo-500",
                t.variant === "default" && "bg-gradient-to-r from-slate-300 to-slate-200"
              )}
            />

            <div className="flex gap-3 p-4">
              <div className="mt-0.5">{
                <VariantIcon variant={t.variant} />
              }</div>

              <div className="min-w-0 flex-1">
                {t.title ? (
                  <div className="text-sm font-semibold text-slate-900 leading-5">
                    {t.title}
                  </div>
                ) : null}
                {t.description ? (
                  <div className="mt-0.5 text-sm text-slate-600 leading-5">
                    {t.description}
                  </div>
                ) : null}

                {t.action ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          t.action?.onClick();
                        } finally {
                          dismiss(t.id);
                        }
                      }}
                      className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-semibold",
                        "bg-slate-900 text-white hover:bg-slate-800 transition"
                      )}
                    >
                      {t.action.label}
                    </button>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className={cn(
                  "absolute right-2 top-2 rounded-xl p-2",
                  "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition"
                )}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
