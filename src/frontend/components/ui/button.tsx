import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/components/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-text shadow hover:bg-[oklch(var(--dp-primary)/85%)] focus-visible:ring-primary",
        destructive:
          "bg-red-100 text-red-600 shadow-sm hover:bg-red-600 hover:text-white focus-visible:ring-red-600",
        soft: "bg-primary-alpha text-primary-alpha-text shadow-sm hover:bg-primary hover:text-primary-text focus-visible:ring-primary",
        ghost: "",
        link: "text-primary underline-offset-4 hover:underline",
        // fix the shadow
        outline:
          "border border-primary bg-base text-primary shadow-sm hover:bg-primary hover:text-primary-text focus-visible:ring-primary",
      },
      size: {
        lg: "h-9 px-4 py-2",
        md: "h-7 rounded-md px-3 text-xs",
        sm: "h-6 rounded-md px-2 text-xs",
        icon: "size-7 rounded-full text-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
