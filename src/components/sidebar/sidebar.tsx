import { useState } from "react";
import {
    PanelLeftClose,
    PanelLeftOpen,
    Circle,
    ArrowRightLeft,
    Settings2,
} from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { IconButton } from "@/components/ui/icon-button";
import { NodeList } from "@/components/sidebar/node-list";
import { EdgeList } from "@/components/sidebar/edge-list";
import { GraphSettings } from "@/components/sidebar/graph-settings";
import { twMerge } from "tailwind-merge";

type SidebarTab = "nodes" | "edges" | "settings";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<SidebarTab>("nodes");
    const { state } = useGraph();
    const { t } = useI18n();

    const tabs: {
        id: SidebarTab;
        label: string;
        icon: typeof Circle;
        count?: number;
    }[] = [
        {
            id: "nodes",
            label: t("sidebar.nodes"),
            icon: Circle,
            count: state.graph.nodes.length,
        },
        {
            id: "edges",
            label: t("sidebar.edges"),
            icon: ArrowRightLeft,
            count: state.graph.edges.length,
        },
        { id: "settings", label: t("sidebar.settings"), icon: Settings2 },
    ];

    return (
        <aside
            data-slot="sidebar"
            className={twMerge(
                "flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
                collapsed ? "w-12" : "w-72",
            )}
        >
            {/* Sidebar header */}
            <div className="flex h-10 items-center justify-between border-b border-border px-2">
                {!collapsed && (
                    <span className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("sidebar.title")}
                    </span>
                )}
                <IconButton
                    aria-label={
                        collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    size="sm"
                >
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                </IconButton>
            </div>

            {/* Tabs */}
            {!collapsed && (
                <>
                    <nav className="flex gap-1 border-b border-border px-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={twMerge(
                                        "flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-xs font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground-subtle",
                                    )}
                                >
                                    <Icon className="size-3.5" />
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="ml-0.5 rounded bg-surface-raised px-1 py-px text-[10px] tabular-nums text-muted-foreground">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Content */}
                    <div
                        className={twMerge(
                            "flex-1 overflow-y-auto p-3",
                            activeTab === "settings" && "pt-6",
                        )}
                    >
                        {activeTab === "nodes" && <NodeList />}
                        {activeTab === "edges" && <EdgeList />}
                        {activeTab === "settings" && <GraphSettings />}
                    </div>
                </>
            )}

            {/* Collapsed icons */}
            {collapsed && (
                <div className="flex flex-col items-center gap-1 pt-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <IconButton
                                key={tab.id}
                                aria-label={tab.label}
                                active={activeTab === tab.id}
                                size="sm"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCollapsed(false);
                                }}
                            >
                                <Icon />
                            </IconButton>
                        );
                    })}
                </div>
            )}
        </aside>
    );
}
