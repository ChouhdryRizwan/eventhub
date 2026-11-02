import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-light",
        outline: "border border-primary bg-transparent text-primary hover:bg-primary/5",
        ghost: "text-gray-700 hover:bg-gray-100",
        dark: "bg-ink text-white hover:bg-gray-800",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "",
        sm: "min-h-9 px-3 text-xs",
        lg: "min-h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
