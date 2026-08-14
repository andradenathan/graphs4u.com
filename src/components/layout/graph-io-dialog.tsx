import { useEffect, useState } from "react";
import { X, Download, Upload, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
	exportGraph,
	importGraph,
	type GraphFormatId,
} from "@/lib/graph-formats";

const formats: { id: GraphFormatId; i18nKey: string }[] = [
	{ id: "dot", i18nKey: "io.format.dot" },
	{ id: "adjacency-matrix", i18nKey: "io.format.adjacencyMatrix" },
	{ id: "edge-list", i18nKey: "io.format.edgeList" },
];

export interface GraphIoDialogProps {
	open: boolean;
	onClose: () => void;
}

export function GraphIoDialog({ open, onClose }: GraphIoDialogProps) {
	const { state, loadGraph } = useGraph();
	const { t } = useI18n();

	const [format, setFormat] = useState<GraphFormatId>("adjacency-matrix");
	const [text, setText] = useState("");
	const [errorKey, setErrorKey] = useState<string | null>(null);
	const [imported, setImported] = useState(false);

	useEffect(() => {
		if (!open) return;
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	// Reopening should always show the current graph, never a stale draft.
	useEffect(() => {
		if (!open) return;
		setText(exportGraph(state.graph, format));
		setErrorKey(null);
		setImported(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, format]);

	if (!open) return null;

	function handleImport() {
		const result = importGraph(text, format, { directed: state.graph.directed });
		if (!result.graph) {
			setErrorKey(result.errorKey);
			return;
		}
		loadGraph(result.graph);
		setErrorKey(null);
		setImported(true);
	}

	return (
		<div
			data-slot="graph-io-dialog-backdrop"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				data-slot="graph-io-dialog"
				role="dialog"
				aria-modal="true"
				aria-label={t("io.title")}
				className="relative flex w-full max-w-lg flex-col rounded-xl border border-border bg-surface shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<span className="text-sm font-semibold text-foreground">
						{t("io.title")}
					</span>
					<button
						type="button"
						aria-label={t("donate.close")}
						onClick={onClose}
						className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="flex flex-col gap-4 p-5">
					<div className="flex flex-wrap gap-1.5">
						{formats.map((entry) => (
							<button
								key={entry.id}
								type="button"
								onClick={() => setFormat(entry.id)}
								data-selected={format === entry.id ? "" : undefined}
								className={twMerge(
									"cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs transition-colors",
									"text-muted-foreground hover:text-foreground",
									"data-[selected]:border-primary data-[selected]:bg-primary/10 data-[selected]:text-foreground",
								)}
							>
								{t(entry.i18nKey)}
							</button>
						))}
					</div>

					<p className="text-[11px] leading-relaxed text-muted-foreground">
						{t(`io.hint.${format}`)}
					</p>

					<textarea
						value={text}
						onChange={(event) => {
							setText(event.target.value);
							setErrorKey(null);
							setImported(false);
						}}
						spellCheck={false}
						rows={10}
						aria-label={t("io.title")}
						className="w-full resize-y rounded-lg border border-input bg-surface-raised p-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>

					{errorKey && (
						<p className="text-xs text-destructive">{t(errorKey)}</p>
					)}

					<div className="flex flex-wrap items-center gap-2">
						<Button onClick={handleImport}>
							<Upload />
							{t("io.import")}
						</Button>
						<Button
							variant="secondary"
							onClick={() => setText(exportGraph(state.graph, format))}
						>
							<Download />
							{t("io.export")}
						</Button>
						{imported && (
							<span className="inline-flex items-center gap-1.5 text-xs text-algo-result">
								<Check className="size-3.5" />
								{t("io.imported")}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
