import { useState, useRef, useEffect } from "react";
import { Play, X, FlaskConical, ChevronDown, ChevronUp } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
    algorithms,
    runAlgorithm,
    type AlgorithmId,
    type AlgorithmMeta,
} from "@/lib/algorithms";
import { twMerge } from "tailwind-merge";

export function AlgorithmFloatingPanel() {
    const {
        state,
        setDirected,
        setWeighted,
        setAlgorithmResult,
        clearAlgorithmResult,
    } = useGraph();
    const { t } = useI18n();
    const { graph, algorithmResult } = state;

    const [open, setOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] =
        useState<AlgorithmId | null>(null);
    const [sourceNodeId, setSourceNodeId] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedMeta = selectedAlgorithm
        ? (algorithms.find((algorithm) => algorithm.id === selectedAlgorithm) ??
          null)
        : null;

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleSelectAlgorithm(algorithm: AlgorithmMeta) {
        setSelectedAlgorithm(algorithm.id);
        setDropdownOpen(false);
        clearAlgorithmResult();

        if (algorithm.requiresWeighted && !graph.weighted) setWeighted(true);
        if (algorithm.requiresDirected && !graph.directed) setDirected(true);

        if (
            algorithm.requiresSource &&
            graph.nodes.length > 0 &&
            !sourceNodeId
        ) {
            setSourceNodeId(graph.nodes[0].id);
        }
    }

    function handleRun() {
        if (!selectedAlgorithm || !selectedMeta) return;
        if (selectedMeta.requiresSource && !sourceNodeId) return;
        if (graph.nodes.length === 0) return;

        const result = runAlgorithm(
            selectedAlgorithm,
            graph,
            selectedMeta.requiresSource ? sourceNodeId : undefined,
        );
        setAlgorithmResult({ algorithmId: selectedAlgorithm, ...result });
    }

    function handleClear() {
        clearAlgorithmResult();
        setSelectedAlgorithm(null);
        setSourceNodeId("");
    }

    const categories = [
        { key: "traversal", i18nKey: "algo.cat.traversal" },
        { key: "shortest-path", i18nKey: "algo.cat.shortestPath" },
        { key: "mst", i18nKey: "algo.cat.mst" },
        { key: "ordering", i18nKey: "algo.cat.ordering" },
    ] as const;

    return (
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={twMerge(
                    "flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-sm transition-colors",
                    open || algorithmResult
                        ? "bg-primary/10 text-foreground border-primary/30"
                        : "bg-surface/90 text-muted-foreground hover:text-foreground",
                )}
            >
                <FlaskConical className="size-3.5" />
                <span>{t("sidebar.algorithms")}</span>
                {algorithmResult && (
                    <span className="size-1.5 rounded-full bg-algo-result" />
                )}
                {open ? (
                    <ChevronUp className="size-3 opacity-60" />
                ) : (
                    <ChevronDown className="size-3 opacity-60" />
                )}
            </button>

            {open && (
                <div className="w-72 rounded-xl border border-border bg-surface/95 p-4 shadow-xl backdrop-blur-md">
                    {graph.nodes.length === 0 ? (
                        <p className="py-4 text-center text-xs text-muted-foreground">
                            {t("algo.empty")}
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div
                                ref={dropdownRef}
                                className="relative flex flex-col gap-1.5"
                            >
                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    {t("algo.select")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs transition-colors hover:border-border-hover"
                                >
                                    <span
                                        className={
                                            selectedMeta
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {selectedMeta
                                            ? t(selectedMeta.i18nKey)
                                            : t("algo.placeholder")}
                                    </span>
                                    <ChevronDown
                                        className={twMerge(
                                            "size-3.5 text-muted-foreground transition-transform",
                                            dropdownOpen && "rotate-180",
                                        )}
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-surface-overlay shadow-xl">
                                        {categories.map((category) => {
                                            const categoryAlgorithms =
                                                algorithms.filter(
                                                    (algorithm) =>
                                                        algorithm.category ===
                                                        category.key,
                                                );
                                            if (categoryAlgorithms.length === 0)
                                                return null;
                                            return (
                                                <div key={category.key}>
                                                    <div className="px-2.5 pb-0.5 pt-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                                        {t(category.i18nKey)}
                                                    </div>
                                                    {categoryAlgorithms.map(
                                                        (algorithm) => (
                                                            <button
                                                                key={
                                                                    algorithm.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSelectAlgorithm(
                                                                        algorithm,
                                                                    )
                                                                }
                                                                className={twMerge(
                                                                    "flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-[11px] transition-colors",
                                                                    selectedAlgorithm ===
                                                                        algorithm.id
                                                                        ? "bg-primary/10 text-foreground"
                                                                        : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                                                                )}
                                                            >
                                                                <span>
                                                                    {t(
                                                                        algorithm.i18nKey,
                                                                    )}
                                                                </span>
                                                                {(algorithm.requiresWeighted ||
                                                                    algorithm.requiresDirected) && (
                                                                    <div className="ml-auto flex gap-1">
                                                                        {algorithm.requiresWeighted && (
                                                                            <span className="rounded bg-surface px-1 py-px text-[8px] text-muted-foreground">
                                                                                W
                                                                            </span>
                                                                        )}
                                                                        {algorithm.requiresDirected && (
                                                                            <span className="rounded bg-surface px-1 py-px text-[8px] text-muted-foreground">
                                                                                D
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {selectedMeta &&
                                    (selectedMeta.requiresWeighted ||
                                        selectedMeta.requiresDirected) && (
                                        <p className="text-[10px] leading-tight text-muted-foreground">
                                            {selectedMeta.requiresWeighted &&
                                                selectedMeta.requiresDirected &&
                                                t("algo.requiresBoth")}
                                            {selectedMeta.requiresWeighted &&
                                                !selectedMeta.requiresDirected &&
                                                t("algo.requiresWeighted")}
                                            {!selectedMeta.requiresWeighted &&
                                                selectedMeta.requiresDirected &&
                                                t("algo.requiresDirected")}
                                        </p>
                                    )}
                            </div>

                            {selectedMeta?.requiresSource && (
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {t("algo.sourceNode")}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {graph.nodes.map((node) => (
                                            <button
                                                key={node.id}
                                                type="button"
                                                onClick={() =>
                                                    setSourceNodeId(node.id)
                                                }
                                                className={twMerge(
                                                    "flex size-7 cursor-pointer items-center justify-center rounded-md border text-[11px] font-medium transition-colors",
                                                    sourceNodeId === node.id
                                                        ? "border-primary bg-primary/15 text-foreground"
                                                        : "border-border bg-surface-raised text-muted-foreground hover:border-border-hover hover:text-foreground",
                                                )}
                                            >
                                                {node.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleRun}
                                    disabled={
                                        !selectedAlgorithm ||
                                        graph.nodes.length === 0 ||
                                        (selectedMeta?.requiresSource &&
                                            !sourceNodeId)
                                    }
                                >
                                    <Play className="size-3" />
                                    {t("algo.run")}
                                </Button>

                                {algorithmResult && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClear}
                                    >
                                        <X className="size-3" />
                                        {t("algo.clear")}
                                    </Button>
                                )}
                            </div>

                            {algorithmResult && (
                                <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface-raised/60 px-2.5 py-2">
                                    <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {t("algo.result")}
                                    </span>
                                    <p className="text-[11px] leading-relaxed text-foreground-subtle">
                                        {algorithmResult.description}
                                    </p>
                                    {Object.keys(algorithmResult.distances)
                                        .length > 0 && (
                                        <div className="mt-0.5 flex flex-col gap-1">
                                            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                                {t("algo.distances")}
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {graph.nodes.map((node) => {
                                                    const nodeDistance =
                                                        algorithmResult
                                                            .distances[node.id];
                                                    return (
                                                        <span
                                                            key={node.id}
                                                            className="rounded border border-border bg-surface px-1 py-px text-[9px] tabular-nums text-foreground-subtle"
                                                        >
                                                            {node.label}:
                                                            {nodeDistance ===
                                                            Infinity
                                                                ? "∞"
                                                                : nodeDistance}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
