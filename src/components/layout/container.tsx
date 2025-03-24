import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("w-full mx-auto ", {
  variants: {
    variant: {
      default: "py-12 lg:py-16",
      sm: "py-4 ",
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
