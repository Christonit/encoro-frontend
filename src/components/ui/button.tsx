import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "leading-none inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 btn",
  {
    variants: {
      variant: {
        default: "bg-red-500 text-white hover:bg-red-400",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-[#FFE5EA] !text-red-500  hover:bg-red-200/50  hover:text-red-500 border !border-red-500",
        "outline-secondary":
          "bg-neutral-100 text-slate-900 hover:bg-neutral-200  border border-slate-900",
        secondary:
          "bg-primary-100 text-primary-500 hover:text-primary-600 hover:bg-primary-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground border border-slate-100",
        "ghost-white":
          "hover:bg-neutral-100/[.50] hover:text-accent-foreground bg-[#fff] ",
        light: "hover:bg-accent hover:text-accent-foreground",
        clear:
          "!active:bg-slate-200/[0.25] focus:bg-slate-200/[0.25] hover:bg-slate-200/[0.25]",
        link: "text-red-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-3 lg:!px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
