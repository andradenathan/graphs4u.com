import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { GraphBoard } from "@/components/board/graph-board";
import { Seo } from "@/components/seo/seo";
import { useI18n } from "@/hooks/use-i18n";
import { useGraph } from "@/hooks/use-graph";
import {
	decodeGraph,
	GRAPH_QUERY_PARAMETER,
} from "@/lib/graph-serialization";
import type { LanguageCode } from "@/lib/i18n";
import { buildHomePath } from "@/lib/routes";
import {
	buildSoftwareApplicationSchema,
	buildWebSiteSchema,
} from "@/lib/structured-data";

const boardPageSeo: Record<LanguageCode, { title: string; description: string }> = {
	en: {
		title: "graphs4u — Free Graph Algorithm Visualizer (BFS, DFS, Dijkstra)",
		description:
			"Draw a graph in your browser and run BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim and topological sort step by step. Free, open source, no sign-up.",
	},
	pt: {
		title: "graphs4u — Visualizador de Algoritmos em Grafos (BFS, DFS, Dijkstra)",
		description:
			"Desenhe um grafo no navegador e execute BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim e ordenação topológica passo a passo. Grátis, open source e sem cadastro.",
	},
};

export function BoardPage() {
	const { lang } = useI18n();
	const { loadGraph } = useGraph();
	const [searchParams] = useSearchParams();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const seo = boardPageSeo[lang];
	const encodedGraph = searchParams.get(GRAPH_QUERY_PARAMETER);

	// A shared link carries the whole graph in the query string. Applying it in
	// an effect keeps the prerendered markup and the first client render equal.
	useEffect(() => {
		if (!encodedGraph) return;
		const sharedGraph = decodeGraph(encodedGraph);
		if (sharedGraph) loadGraph(sharedGraph);
	}, [encodedGraph, loadGraph]);

	return (
		<>
			<Seo
				language={lang}
				pageKey="home"
				path={buildHomePath(lang)}
				title={seo.title}
				description={seo.description}
				structuredData={[
					buildSoftwareApplicationSchema(lang),
					buildWebSiteSchema(lang),
				]}
			/>

			<div className="flex h-dvh flex-col overflow-hidden bg-surface text-foreground">
				<Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
				<div className="flex flex-1 overflow-hidden">
					{/* Desktop sidebar */}
					<div className="hidden md:block">
						<Sidebar onClose={() => setSidebarOpen(false)} />
					</div>

					{/* Mobile sidebar overlay */}
					{sidebarOpen && (
						<>
							<div
								className="fixed inset-0 z-30 bg-black/50 md:hidden"
								onClick={() => setSidebarOpen(false)}
							/>
							<div className="fixed inset-y-12 left-0 z-40 w-80 md:hidden">
								<Sidebar onClose={() => setSidebarOpen(false)} />
							</div>
						</>
					)}

					<GraphBoard />
				</div>
			</div>
		</>
	);
}
