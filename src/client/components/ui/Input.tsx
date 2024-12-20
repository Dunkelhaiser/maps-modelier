import { cn } from "@utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(
    "flex w-full rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border border-input bg-transparent px-3 py-1 shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
                plain: "!h-auto border-none p-0 shadow-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

type InputVariantProps = VariantProps<typeof inputVariants>;

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputVariantProps>,
        InputVariantProps {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant, ...props }, ref) => {
    return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
