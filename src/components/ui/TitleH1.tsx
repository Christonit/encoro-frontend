import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const titleVariants = cva("font-bold tracking-tight lg:text-4xl leading-none", {
  variants: {
    variant: {
      default: " text-3xl lg:text-4xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TitleH1Props
  extends React.ComponentPropsWithoutRef<"h1">,
    VariantProps<typeof titleVariants> {}

const TitleH1 = React.forwardRef<HTMLHeadingElement, TitleH1Props>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(titleVariants({ variant }), className)}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

TitleH1.displayName = "TitleH1";

export { TitleH1 };
