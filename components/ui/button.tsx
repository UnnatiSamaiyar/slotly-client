import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-medium text-sm",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // consistent premium rounding
    "rounded-xl",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary (single main CTA look)
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 active:translate-y-[0.5px]",
        // Subtle secondary
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm active:translate-y-[0.5px]",
        // Outline for non-primary actions
        outline:
          "border border-border/70 bg-background hover:bg-accent hover:text-accent-foreground shadow-[0_1px_0_rgba(17,24,39,0.04)] active:translate-y-[0.5px]",
        // Ghost for lightweight actions
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link
        link: "text-primary underline-offset-4 hover:underline",
        // Destructive
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md active:translate-y-[0.5px] focus-visible:ring-destructive/30",
      },
      size: {
        // slightly taller = less “congested”
        default: "h-10 px-4",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-11 px-6 text-[15px]",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-9 w-9 p-0",
        "icon-lg": "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
