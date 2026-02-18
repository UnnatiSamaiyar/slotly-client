import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function DButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
        "disabled:opacity-50 disabled:pointer-events-none",

        // variants
        variant === "primary" &&
          "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
        variant === "secondary" &&
          "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700",

        // sizes
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-base",
        size === "icon" && "h-10 w-10",

        className
      )}
      {...props}
    />
  );
}
