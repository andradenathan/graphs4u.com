import { useEffect } from "react";
import { X, Heart, Github } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";

const GITHUB_SPONSORS_URL = "https://github.com/sponsors/andradenathan";

interface DonateDialogProps {
    open: boolean;
    onClose: () => void;
}

export function DonateDialog({ open, onClose }: DonateDialogProps) {
    const { t } = useI18n();

    useEffect(() => {
        if (!open) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            data-slot="donate-dialog-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                data-slot="donate-dialog"
                className="relative mx-4 w-full max-w-sm rounded-xl border border-border bg-surface shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Heart className="size-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                            {t("donate.title")}
                        </span>
                    </div>
                    <button
                        type="button"
                        aria-label={t("donate.close")}
                        onClick={onClose}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="px-5 py-4">
                    <p className="mb-5 text-sm text-muted-foreground">
                        {t("donate.description")}
                    </p>

                    <a
                        href={GITHUB_SPONSORS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={twMerge(
                            "flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3",
                            "transition-colors hover:border-border-hover hover:bg-surface-overlay",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-overlay">
                            <Github className="size-4 text-foreground" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                                {t("donate.github.title")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {t("donate.github.description")}
                            </span>
                        </div>
                    </a>
                </div>

                <div className="border-t border-border px-5 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-full justify-center"
                    >
                        {t("donate.close")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
