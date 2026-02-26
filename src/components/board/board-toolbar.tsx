import { MousePointer2, CirclePlus, Spline, Eraser } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { IconButton } from "@/components/ui/icon-button";
import type { Tool } from "@/types/graph";

const tools: {
    id: Tool;
    icon: typeof MousePointer2;
    shortcut: string;
    i18nKey: string;
}[] = [
    {
        id: "select",
        icon: MousePointer2,
        shortcut: "V",
        i18nKey: "tool.select",
    },
    {
        id: "add-node",
        icon: CirclePlus,
        shortcut: "N",
        i18nKey: "tool.addNode",
    },
    { id: "add-edge", icon: Spline, shortcut: "E", i18nKey: "tool.addEdge" },
    { id: "delete", icon: Eraser, shortcut: "D", i18nKey: "tool.delete" },
];

export function BoardToolbar() {
    const { state, setTool } = useGraph();
    const { t } = useI18n();

    return (
        <div
            data-slot="board-toolbar"
            className="absolute left-3 top-3 z-10 flex flex-col gap-1 rounded-xl border border-border bg-surface/90 p-1.5 shadow-lg backdrop-blur-sm"
        >
            {tools.map((tool) => {
                const Icon = tool.icon;
                const label = t(tool.i18nKey);
                return (
                    <div key={tool.id} className="group relative">
                        <IconButton
                            aria-label={label}
                            active={state.activeTool === tool.id}
                            onClick={() => setTool(tool.id)}
                            size="md"
                        >
                            <Icon />
                        </IconButton>

                        <div className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-surface-overlay px-2.5 py-1.5 text-xs shadow-lg">
                                <span className="text-foreground">{label}</span>
                                <kbd className="rounded border border-border bg-surface px-1 py-px font-mono text-[10px] text-muted-foreground">
                                    {tool.shortcut}
                                </kbd>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
