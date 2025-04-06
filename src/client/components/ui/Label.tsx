import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

interface Props extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
    optional?: boolean;
}

const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, Props>(
    ({ className, optional, children, ...props }, ref) => (
        <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
            {children}
            {optional && <span className="ml-1 text-[0.625rem] text-muted-foreground/75">(optional)</span>}
        </LabelPrimitive.Root>
    )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
