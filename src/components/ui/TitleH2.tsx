import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const titleVariants = cva(
  "text-2xl font-bold tracking-tight lg:text-4xl mb-0",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TitleH2Props
  extends React.ComponentPropsWithoutRef<"h2">,
    VariantProps<typeof titleVariants> {}

const TitleH2 = React.forwardRef<HTMLHeadingElement, TitleH2Props>(
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

TitleH2.displayName = "TitleH2";

export { TitleH2 };
