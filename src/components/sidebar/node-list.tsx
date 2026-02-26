import { Circle, Trash2, MapPin } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { twMerge } from "tailwind-merge";

export function NodeList() {
    const { state, selectNode, deleteNode, updateNode } = useGraph();
    const { t } = useI18n();
    const { nodes } = state.graph;

    if (nodes.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Circle className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">
                    {t("nodeList.empty.title")}
                    <br />
                    {t("nodeList.empty.hint")}{" "}
                    <span className="font-medium text-foreground-subtle">
                        {t("nodeList.empty.tool")}
                    </span>{" "}
                    {t("nodeList.empty.suffix")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1" data-slot="node-list">
            {nodes.map((node) => {
                const isSelected = state.selectedNodeIds.includes(node.id);
                return (
                    <div
                        key={node.id}
                        onClick={() => selectNode(node.id)}
                        className={twMerge(
                            "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors cursor-pointer",
                            isSelected
                                ? "bg-primary/10 text-foreground"
                                : "text-foreground-subtle hover:bg-surface-raised",
                        )}
                    >
                        <Circle
                            className={twMerge(
                                "size-3 shrink-0",
                                isSelected
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground",
                            )}
                        />

                        <Input
                            value={node.label}
                            onChange={(event) =>
                                updateNode(node.id, {
                                    label: event.target.value,
                                })
                            }
                            onClick={(event) => event.stopPropagation()}
                            className="h-6 border-transparent bg-transparent px-1 text-xs focus:border-border focus:bg-surface"
                        />

                        <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground tabular-nums">
                            <MapPin className="size-2.5" />
                            {Math.round(node.x)},{Math.round(node.y)}
                        </div>

                        <IconButton
                            aria-label={`Delete node ${node.label}`}
                            variant="destructive"
                            size="sm"
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteNode(node.id);
                            }}
                            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="size-3" />
                        </IconButton>
                    </div>
                );
            })}
        </div>
    );
}
