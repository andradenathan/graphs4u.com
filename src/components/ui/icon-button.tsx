import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

export const iconButtonVariants = tv({
    base: [
        "inline-flex cursor-pointer items-center justify-center rounded-lg border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "md:data-[touch-target]:hidden",
    ],
    variants: {
        variant: {
            primary:
                "border-primary bg-primary text-primary-foreground hover:bg-primary-hover",
            secondary:
                "border-border bg-secondary text-secondary-foreground hover:bg-muted",
            ghost: "border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-raised",
            destructive:
                "border-transparent bg-transparent text-muted-foreground hover:text-destructive hover:bg-destructive/10",
        },
        size: {
            sm: "size-7 [&_svg]:size-3.5",
            md: "size-8 [&_svg]:size-4",
            lg: "size-9 [&_svg]:size-4",
        },
        active: {
            true: "",
            false: "",
        },
    },
    compoundVariants: [
        {
            variant: "ghost",
            active: true,
            className: "bg-surface-raised text-foreground border-border",
        },
    ],
    defaultVariants: { variant: "ghost", size: "md", active: false },
});

export interface IconButtonProps
    extends ComponentProps<"button">, VariantProps<typeof iconButtonVariants> {}

export function IconButton({
    className,
    variant,
    size,
    active,
    disabled,
    ...props
}: IconButtonProps) {
    return (
        <button
            type="button"
            data-slot="icon-button"
            data-disabled={disabled ? "" : undefined}
            className={twMerge(
                iconButtonVariants({ variant, size, active }),
                className,
            )}
            disabled={disabled}
            {...props}
        />
    );
}
