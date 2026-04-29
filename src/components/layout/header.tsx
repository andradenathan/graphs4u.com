import { useState, useRef, useEffect } from "react";
import { Waypoints, Github, Trash2, ChevronDown, Heart, Menu } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { languages, type LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { DonateDialog } from "@/components/layout/donate-dialog";

interface HeaderProps {
    onSidebarToggle?: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
    const { state, clearGraph } = useGraph();
    const { lang, setLang, t } = useI18n();
    const nodeCount = state.graph.nodes.length;
    const edgeCount = state.graph.edges.length;

    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [donateDialogOpen, setDonateDialogOpen] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                languageDropdownRef.current &&
                !languageDropdownRef.current.contains(event.target as Node)
            ) {
                setLanguageDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const currentLanguage = languages.find(
        (language) => language.code === lang,
    )!;

    return (
        <header
            data-slot="header"
            className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-3 md:px-4"
        >
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <IconButton
                    aria-label="Toggle sidebar"
                    onClick={onSidebarToggle}
                    size="sm"
                    className="md:hidden"
                >
                    <Menu className="size-5" />
                </IconButton>

                <div className="flex items-center gap-2">
                    <Waypoints className="size-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold tracking-tight text-foreground hidden sm:inline">
                        graphs4u
                    </span>
                </div>

                <div className="h-4 w-px bg-border hidden md:block" />

                <div className="flex items-center gap-2 md:gap-3 text-xs text-muted-foreground hidden md:flex">
                    <span>
                        {nodeCount}{" "}
                        {nodeCount === 1 ? t("header.node") : t("header.nodes")}
                    </span>
                    <span>
                        {edgeCount}{" "}
                        {edgeCount === 1 ? t("header.edge") : t("header.edges")}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {(nodeCount > 0 || edgeCount > 0) && (
                    <IconButton
                        aria-label={t("header.clear")}
                        onClick={clearGraph}
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 />
                    </IconButton>
                )}

                <div className="h-4 w-px bg-border mx-1 hidden md:block" />

                <div ref={languageDropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setLanguageDropdownOpen(!languageDropdownOpen)
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                    >
                        <span className="hidden md:inline">{currentLanguage.label}</span>
                        <span className="md:hidden text-[10px] font-semibold">{currentLanguage.code.toUpperCase()}</span>
                        <ChevronDown className="size-3 opacity-60" />
                    </button>

                    {languageDropdownOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-32 overflow-hidden rounded-lg border border-border bg-surface-overlay shadow-xl">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    type="button"
                                    onClick={() => {
                                        setLang(language.code as LanguageCode);
                                        setLanguageDropdownOpen(false);
                                    }}
                                    className={`flex w-full cursor-pointer items-center px-3 py-2 text-xs transition-colors ${
                                        lang === language.code
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                                    }`}
                                >
                                    {language.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-4 w-px bg-border mx-1 hidden md:block" />

                <a
                    href="https://github.com/andradenathan/graphs4u.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hidden md:flex"
                >
                    <Github className="size-4" />
                    <span className="hidden lg:inline">
                        {t("header.openSource")}
                    </span>
                </a>

                <a
                    href="https://github.com/andradenathan/graphs4u.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex md:hidden items-center rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Github className="size-4" />
                </a>

                <div className="h-4 w-px bg-border mx-1 hidden md:block" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDonateDialogOpen(true)}
                    className="text-muted-foreground hover:text-primary hidden md:flex"
                >
                    <Heart />
                    <span className="hidden lg:inline">
                        {t("header.donate")}
                    </span>
                </Button>

                <IconButton
                    aria-label={t("header.donate")}
                    onClick={() => setDonateDialogOpen(true)}
                    size="sm"
                    className="md:hidden text-muted-foreground hover:text-primary"
                >
                    <Heart />
                </IconButton>
            </div>

            <DonateDialog
                open={donateDialogOpen}
                onClose={() => setDonateDialogOpen(false)}
            />
        </header>
    );
}
