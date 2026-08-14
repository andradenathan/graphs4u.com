import type { Graph } from "@/types/graph";
import type { AlgorithmId } from "@/lib/algorithms";

/**
 * Small, hand-placed graphs used as the worked example on each algorithm page.
 * They are rendered server-side, so the example (and its result) is part of the
 * static HTML rather than something only a browser can produce.
 */

interface NodePlacement {
	id: string;
	label: string;
	x: number;
	y: number;
}

const nodePlacements: NodePlacement[] = [
	{ id: "a", label: "A", x: 70, y: 70 },
	{ id: "b", label: "B", x: 210, y: 45 },
	{ id: "c", label: "C", x: 350, y: 80 },
	{ id: "d", label: "D", x: 110, y: 215 },
	{ id: "e", label: "E", x: 265, y: 220 },
	{ id: "f", label: "F", x: 420, y: 190 },
];

function buildGraph(
	edgeDefinitions: [string, string, number][],
	{ directed, weighted }: { directed: boolean; weighted: boolean },
): Graph {
	return {
		nodes: nodePlacements.map((placement) => ({ ...placement })),
		edges: edgeDefinitions.map(([source, target, weight]) => ({
			id: `${source}${target}`,
			source,
			target,
			weight,
		})),
		directed,
		weighted,
	};
}

const unweightedGraph = buildGraph(
	[
		["a", "b", 1],
		["a", "d", 1],
		["b", "c", 1],
		["b", "e", 1],
		["c", "f", 1],
		["d", "e", 1],
		["e", "f", 1],
	],
	{ directed: false, weighted: false },
);

const weightedGraph = buildGraph(
	[
		["a", "b", 4],
		["a", "d", 2],
		["b", "c", 5],
		["b", "e", 10],
		["c", "f", 3],
		["d", "e", 3],
		["e", "f", 4],
	],
	{ directed: false, weighted: true },
);

const negativeWeightGraph = buildGraph(
	[
		["a", "b", 4],
		["a", "d", 2],
		["d", "b", -1],
		["b", "c", 3],
		["d", "e", 3],
		["c", "f", 2],
		["e", "f", 1],
	],
	{ directed: true, weighted: true },
);

const directedAcyclicGraph = buildGraph(
	[
		["a", "b", 1],
		["a", "d", 1],
		["b", "c", 1],
		["b", "e", 1],
		["d", "e", 1],
		["c", "f", 1],
		["e", "f", 1],
	],
	{ directed: true, weighted: false },
);

export interface AlgorithmExample {
	graph: Graph;
	sourceId: string | null;
}

export const algorithmExamples: Record<AlgorithmId, AlgorithmExample> = {
	bfs: { graph: unweightedGraph, sourceId: "a" },
	dfs: { graph: unweightedGraph, sourceId: "a" },
	dijkstra: { graph: weightedGraph, sourceId: "a" },
	"bellman-ford": { graph: negativeWeightGraph, sourceId: "a" },
	kruskal: { graph: weightedGraph, sourceId: null },
	prim: { graph: weightedGraph, sourceId: "a" },
	"topological-sort": { graph: directedAcyclicGraph, sourceId: null },
};

export const EXAMPLE_VIEW_BOX = { width: 490, height: 275 } as const;
