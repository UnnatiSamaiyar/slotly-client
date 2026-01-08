"use client";

import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "info";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastInput = {
  onDismiss?: () => void;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  action?: ToastAction;
};

export type ToastItem = Required<Pick<ToastInput, "variant" | "durationMs">> &
  Omit<ToastInput, "variant" | "durationMs"> & {
    id: string;
    createdAt: number;
  };

type ToastState = {
  toasts: ToastItem[];
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

function uid() {
  // Compact unique ID; sufficient for UI toasts.
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  toast: (input) => {
    const id = uid();
    const item: ToastItem = {
      id,
      createdAt: Date.now(),
      title: input.title,
      description: input.description,
      action: input.action,
      onDismiss: input.onDismiss,
      variant: input.variant ?? "default",
      durationMs: input.durationMs ?? 4500,
    };

    set((s) => ({ toasts: [item, ...s.toasts].slice(0, 6) }));

    const duration = item.durationMs;
    if (duration > 0) {
      window.setTimeout(() => {
        // Do not dismiss if user already cleared.
        const exists = get().toasts.some((t) => t.id === id);
        if (exists) get().dismiss(id);
      }, duration);
    }

    return id;
  },
  dismiss: (id) =>
    set((s) => {
      const t = s.toasts.find((x) => x.id === id);
      try {
        t?.onDismiss?.();
      } catch {
        // ignore
      }
      return { toasts: s.toasts.filter((x) => x.id !== id) };
    }),
  clear: () =>
    set((s) => {
      try {
        s.toasts.forEach((t) => t.onDismiss?.());
      } catch {
        // ignore
      }
      return { toasts: [] };
    }),
}));

export function useToast() {
  const toast = useToastStore((s) => s.toast);
  const dismiss = useToastStore((s) => s.dismiss);
  const toasts = useToastStore((s) => s.toasts);
  const clear = useToastStore((s) => s.clear);

  return { toast, dismiss, toasts, clear };
}
