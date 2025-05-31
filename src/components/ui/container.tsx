import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("mx-auto lg:py-16", {
  variants: {
    variant: {
      default: "w-full py-12",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(containerVariants({ variant }), className)}
        {...props}
      >
        <div className="container 2xl:px-0">{children}</div>
      </section>
    );
  }
);

Container.displayName = "Container";

export { Container };
