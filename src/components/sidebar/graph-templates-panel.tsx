import { LayoutTemplate } from "lucide-react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { graphTemplates } from "@/lib/graph-templates";

/** Ready-made graphs, so the editor never has to start from an empty board. */
export function GraphTemplatesPanel() {
	const { loadGraph } = useGraph();
	const { t } = useI18n();

	return (
		<div className="flex flex-col gap-3" data-slot="graph-templates-panel">
			<h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
				{t("templates.title")}
			</h4>
			<p className="text-[11px] text-muted-foreground">
				{t("templates.description")}
			</p>

			<div className="flex flex-col gap-1.5">
				{graphTemplates.map((template) => (
					<button
						key={template.id}
						type="button"
						onClick={() => loadGraph(template.build())}
						className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-surface-raised px-3 py-2 text-left text-sm text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
					>
						<LayoutTemplate className="size-3.5 shrink-0 text-primary" />
						{t(template.i18nKey)}
					</button>
				))}
			</div>
		</div>
	);
}
