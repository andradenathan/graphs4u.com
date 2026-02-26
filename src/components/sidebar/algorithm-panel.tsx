import { useState } from "react";
import { Play, X, FlaskConical, ChevronDown } from "lucide-react";
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

export function AlgorithmPanel() {
    const {
        state,
        setDirected,
        setWeighted,
        setAlgorithmResult,
        clearAlgorithmResult,
    } = useGraph();
    const { t } = useI18n();
    const { graph, algorithmResult } = state;

    const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId | null>(null);
    const [sourceNodeId, setSourceNodeId] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const selectedMeta = selectedAlgo
        ? algorithms.find((a) => a.id === selectedAlgo) ?? null
        : null;

    function handleSelectAlgorithm(algo: AlgorithmMeta) {
        setSelectedAlgo(algo.id);
        setDropdownOpen(false);
        clearAlgorithmResult();

        if (algo.requiresWeighted && !graph.weighted) {
            setWeighted(true);
        }
        if (algo.requiresDirected && !graph.directed) {
            setDirected(true);
        }

        if (algo.requiresSource && graph.nodes.length > 0 && !sourceNodeId) {
            setSourceNodeId(graph.nodes[0].id);
        }
    }

    function handleRun() {
        if (!selectedAlgo) return;
        if (selectedMeta?.requiresSource && !sourceNodeId) return;
        if (graph.nodes.length === 0) return;

        const result = runAlgorithm(
            selectedAlgo,
            graph,
            selectedMeta?.requiresSource ? sourceNodeId : undefined,
        );

        setAlgorithmResult({
            algorithmId: selectedAlgo,
            ...result,
        });
    }

    function handleClear() {
        clearAlgorithmResult();
        setSelectedAlgo(null);
        setSourceNodeId("");
    }

    const categories = [
        { key: "traversal", i18nKey: "algo.cat.traversal" },
        { key: "shortest-path", i18nKey: "algo.cat.shortestPath" },
        { key: "mst", i18nKey: "algo.cat.mst" },
        { key: "ordering", i18nKey: "algo.cat.ordering" },
    ] as const;

    if (graph.nodes.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
                <FlaskConical className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                    {t("algo.empty")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("algo.select")}
                </h4>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm transition-colors hover:border-border-hover"
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
                                "size-4 text-muted-foreground transition-transform",
                                dropdownOpen && "rotate-180",
                            )}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface-overlay shadow-xl">
                            {categories.map((cat) => {
                                const catAlgos = algorithms.filter(
                                    (a) => a.category === cat.key,
                                );
                                if (catAlgos.length === 0) return null;
                                return (
                                    <div key={cat.key}>
                                        <div className="px-3 pb-1 pt-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            {t(cat.i18nKey)}
                                        </div>
                                        {catAlgos.map((algo) => (
                                            <button
                                                key={algo.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectAlgorithm(algo)
                                                }
                                                className={twMerge(
                                                    "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-xs transition-colors",
                                                    selectedAlgo === algo.id
                                                        ? "bg-primary/10 text-foreground"
                                                        : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                                                )}
                                            >
                                                <span>{t(algo.i18nKey)}</span>
                                                {(algo.requiresWeighted ||
                                                    algo.requiresDirected) && (
                                                    <div className="ml-auto flex gap-1">
                                                        {algo.requiresWeighted && (
                                                            <span className="rounded bg-surface px-1 py-px text-[9px] text-muted-foreground">
                                                                W
                                                            </span>
                                                        )}
                                                        {algo.requiresDirected && (
                                                            <span className="rounded bg-surface px-1 py-px text-[9px] text-muted-foreground">
                                                                D
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {selectedMeta &&
// ...existing code...
            </div>

            {selectedMeta?.requiresSource && (
                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("algo.sourceNode")}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {graph.nodes.map((node) => (
                            <button
                                key={node.id}
                                type="button"
                                onClick={() => setSourceNodeId(node.id)}
                                className={twMerge(
                                    "flex size-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-medium transition-colors",
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
                        !selectedAlgo ||
                        graph.nodes.length === 0 ||
                        (selectedMeta?.requiresSource && !sourceNodeId)
                    }
                >
                    <Play className="size-3.5" />
                    {t("algo.run")}
                </Button>

                {algorithmResult && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                        <X className="size-3.5" />
                        {t("algo.clear")}
                    </Button>
                )}
            </div>

            {algorithmResult && (
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2.5">
                    <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {t("algo.result")}
                    </h4>
                    <p className="text-xs leading-relaxed text-foreground-subtle">
                        {algorithmResult.description}
                    </p>
                    {Object.keys(algorithmResult.distances).length > 0 && (
                        <div className="mt-1 flex flex-col gap-0.5">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {t("algo.distances")}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {graph.nodes.map((node) => {
                                    const d =
                                        algorithmResult.distances[node.id];
                                    return (
                                        <span
                                            key={node.id}
                                            className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] tabular-nums text-foreground-subtle"
                                        >
                                            {node.label}:
                                            {d === Infinity ? "∞" : d}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
