import type { LanguageCode } from "@/lib/i18n";
import type { AlgorithmId } from "@/lib/algorithms";
import { bfsContent } from "@/content/algorithms/bfs";
import { dfsContent } from "@/content/algorithms/dfs";
import { dijkstraContent } from "@/content/algorithms/dijkstra";
import { bellmanFordContent } from "@/content/algorithms/bellman-ford";
import { kruskalContent } from "@/content/algorithms/kruskal";
import { primContent } from "@/content/algorithms/prim";
import { topologicalSortContent } from "@/content/algorithms/topological-sort";
import { aStarContent } from "@/content/algorithms/a-star";
import { floydWarshallContent } from "@/content/algorithms/floyd-warshall";
import { connectedComponentsContent } from "@/content/algorithms/connected-components";
import { maxFlowContent } from "@/content/algorithms/max-flow";

export interface AlgorithmFact {
	label: string;
	value: string;
}

export interface AlgorithmFaqEntry {
	question: string;
	answer: string;
}

export interface LocalizedAlgorithmContent {
	/** `<title>` — kept under ~60 characters so it is not truncated in results. */
	metaTitle: string;
	metaDescription: string;
	heading: string;
	categoryLabel: string;
	/**
	 * Self-contained answer to "what is this algorithm", 40-60 words. This is the
	 * block answer engines quote, so it must make sense with no surrounding text.
	 */
	summary: string;
	facts: AlgorithmFact[];
	howItWorks: string[];
	pseudocode: string;
	exampleNarrative: string;
	useCases: string[];
	pitfalls: string[];
	faq: AlgorithmFaqEntry[];
	relatedAlgorithmIds: AlgorithmId[];
}

export type AlgorithmContent = Record<LanguageCode, LocalizedAlgorithmContent>;

export const algorithmContents: Record<AlgorithmId, AlgorithmContent> = {
	bfs: bfsContent,
	dfs: dfsContent,
	dijkstra: dijkstraContent,
	"bellman-ford": bellmanFordContent,
	kruskal: kruskalContent,
	prim: primContent,
	"topological-sort": topologicalSortContent,
	"a-star": aStarContent,
	"floyd-warshall": floydWarshallContent,
	"connected-components": connectedComponentsContent,
	"max-flow": maxFlowContent,
};
