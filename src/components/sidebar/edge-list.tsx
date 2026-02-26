import { ArrowRight, Minus, Trash2, ArrowRightLeft, Plus } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { IconButton } from "@/components/ui/icon-button";
import { twMerge } from "tailwind-merge";

export function EdgeList() {
    const { state, selectEdge, deleteEdge, updateEdge } = useGraph();
    const { t } = useI18n();
    const { edges, nodes, directed, weighted } = state.graph;

    const getNodeLabel = (nodeId: string) =>
        nodes.find((node) => node.id === nodeId)?.label ?? "?";

    if (edges.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
                <ArrowRightLeft className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                    {t("edgeList.empty.title")}
                    <br />
                    {t("edgeList.empty.hint")}{" "}
                    <span className="font-medium text-foreground-subtle">
                        {t("edgeList.empty.tool")}
                    </span>{" "}
                    {t("edgeList.empty.suffix")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1" data-slot="edge-list">
            {edges.map((edge) => {
                const isSelected = state.selectedEdgeIds.includes(edge.id);
                return (
                    <div
                        key={edge.id}
                        onClick={() => selectEdge(edge.id)}
                        className={twMerge(
                            "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors cursor-pointer",
                            isSelected
                                ? "bg-primary/10 text-foreground"
                                : "text-foreground-subtle hover:bg-surface-raised",
                        )}
                    >
                        <div className="flex items-center gap-1 text-xs">
                            <span className="font-medium">
                                {getNodeLabel(edge.source)}
                            </span>
                            {directed ? (
                                <ArrowRight className="size-3 text-muted-foreground" />
                            ) : (
                                <Minus className="size-3 text-muted-foreground" />
                            )}
                            <span className="font-medium">
                                {getNodeLabel(edge.target)}
                            </span>
                        </div>

                        {weighted && (
                            <div
                                className="ml-auto flex items-center gap-0.5 rounded-md border border-border bg-surface"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateEdge(edge.id, {
                                            weight: edge.weight - 1,
                                        })
                                    }
                                    className="flex size-5 cursor-pointer items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                                >
                                    <Minus className="size-2.5" />
                                </button>
                                <input
                                    type="number"
                                    value={edge.weight}
                                    onChange={(event) =>
                                        updateEdge(edge.id, {
                                            weight:
                                                Number(event.target.value) || 0,
                                        })
                                    }
                                    className="h-5 w-8 border-x border-border bg-transparent text-center text-xs tabular-nums text-foreground outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateEdge(edge.id, {
                                            weight: edge.weight + 1,
                                        })
                                    }
                                    className="flex size-5 cursor-pointer items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
                                >
                                    <Plus className="size-2.5" />
                                </button>
                            </div>
                        )}

                        <IconButton
                            aria-label="Delete edge"
                            variant="destructive"
                            size="sm"
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteEdge(edge.id);
                            }}
                            className="ml-auto size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="size-3" />
                        </IconButton>
                    </div>
                );
            })}
        </div>
    );
}
