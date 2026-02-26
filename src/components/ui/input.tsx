import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {}

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            data-slot="input"
            className={twMerge(
                "h-8 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground transition-colors",
                "placeholder:text-muted-foreground",
                "focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        />
    );
}
