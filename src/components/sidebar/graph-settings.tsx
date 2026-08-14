import { useState } from "react";
import { ArrowLeftRight, FileDown } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { exportGraphAsPdf } from "@/lib/pdf";
import { GraphTemplatesPanel } from "@/components/sidebar/graph-templates-panel";
import { GraphIoDialog } from "@/components/layout/graph-io-dialog";

export function GraphSettings() {
    const { state, setDirected, setWeighted } = useGraph();
    const { t } = useI18n();
    const { directed, weighted } = state.graph;
    const [ioDialogOpen, setIoDialogOpen] = useState(false);

    return (
        <div className="flex flex-col gap-7" data-slot="graph-settings">
            <GraphTemplatesPanel />

            <div className="flex flex-col gap-3">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("settings.graphType")}
                </h4>

                <div className="flex items-center justify-between rounded-lg bg-surface-raised px-3 py-2">
                    <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                            {t("settings.directed")}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {t("settings.directedDesc")}
                        </span>
                    </div>
                    <Toggle pressed={directed} onPressedChange={setDirected} />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-raised px-3 py-2">
                    <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                            {t("settings.weighted")}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {t("settings.weightedDesc")}
                        </span>
                    </div>
                    <Toggle pressed={weighted} onPressedChange={setWeighted} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("settings.export")}
                </h4>

                <div className="flex flex-col gap-3 rounded-lg bg-surface-raised px-3 py-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-foreground">
                            {t("settings.exportDesc")}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {t("settings.exportFormats")}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() =>
                                void exportGraphAsPdf(
                                    state.graph,
                                    state.algorithmResult,
                                )
                            }
                            disabled={state.graph.nodes.length === 0}
                        >
                            <FileDown />
                            {t("settings.exportPdf")}
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setIoDialogOpen(true)}
                        >
                            <ArrowLeftRight />
                            {t("io.open")}
                        </Button>
                    </div>
                </div>
            </div>

            <GraphIoDialog
                open={ioDialogOpen}
                onClose={() => setIoDialogOpen(false)}
            />

            <div className="flex flex-col gap-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("settings.shortcuts")}
                </h4>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span>{t("settings.selectTool")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            V
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{t("settings.addNode")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            N
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{t("settings.addEdge")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            E
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{t("settings.delete")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            D
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{t("settings.deleteSelected")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            Del
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{t("settings.escape")}</span>
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                            Esc
                        </kbd>
                    </div>
                </div>
            </div>
        </div>
    );
}
