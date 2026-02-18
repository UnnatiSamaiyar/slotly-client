import * as React from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "subtle";
};

export function Surface({
  className,
  variant = "default",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white",
        "transition-shadow",
        variant === "default" &&
          "shadow-[0_1px_0_rgba(15,23,42,0.04)] hover:shadow-[0_10px_30px_-20px_rgba(15,23,42,0.18)]",
        variant === "subtle" && "bg-slate-50 border-slate-200",
        className
      )}
      {...props}
    />
  );
}
