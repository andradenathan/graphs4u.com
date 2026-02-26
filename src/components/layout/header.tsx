import { useState, useRef, useEffect } from "react";
import { Waypoints, Github, Trash2, ChevronDown } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { languages, type LanguageCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Header() {
    const { state, clearGraph } = useGraph();
    const { lang, setLang, t } = useI18n();
    const nodeCount = state.graph.nodes.length;
    const edgeCount = state.graph.edges.length;

    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                langRef.current &&
                !langRef.current.contains(e.target as Node)
            ) {
                setLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const currentLang = languages.find((l) => l.code === lang)!;

    return (
        <header
            data-slot="header"
            className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4"
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Waypoints className="size-5 text-primary" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                        graphs4u
                    </span>
                </div>

                <div className="h-4 w-px bg-border" />

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearGraph}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 />
                        {t("header.clear")}
                    </Button>
                )}

                <div className="h-4 w-px bg-border mx-1" />

                {/* Language switcher — text only */}
                <div ref={langRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setLangOpen(!langOpen)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                    >
                        <span>{currentLang.label}</span>
                        <ChevronDown className="size-3 opacity-60" />
                    </button>

                    {langOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-32 overflow-hidden rounded-lg border border-border bg-surface-overlay shadow-xl">
                            {languages.map((l) => (
                                <button
                                    key={l.code}
                                    type="button"
                                    onClick={() => {
                                        setLang(l.code as LanguageCode);
                                        setLangOpen(false);
                                    }}
                                    className={`flex w-full cursor-pointer items-center px-3 py-2 text-xs transition-colors ${
                                        lang === l.code
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                                    }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-4 w-px bg-border mx-1" />

                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Github className="size-4" />
                    <span className="hidden sm:inline">
                        {t("header.openSource")}
                    </span>
                </a>
            </div>
        </header>
    );
}
