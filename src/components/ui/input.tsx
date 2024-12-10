import * as React from "react";
import { cn } from "@/lib/utils";

// Instead of an empty interface, we can either:
// 1. Remove the interface and use the type directly
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// OR 2. Add at least one optional custom property
// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   containerClassName?: string;
// }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
