import type { Graph } from "@/types/graph";

export type GraphTemplateId =
	| "complete-k5"
	| "bipartite-k33"
	| "binary-tree"
	| "petersen"
	| "grid-3x3"
	| "weighted-cycle";

export interface GraphTemplate {
	id: GraphTemplateId;
	i18nKey: string;
	build: () => Graph;
}

const CENTER_X = 400;
const CENTER_Y = 280;

function nodeLabel(index: number): string {
	return String.fromCharCode(65 + (index % 26)) + (index >= 26 ? String(Math.floor(index / 26)) : "");
}

function buildFromEdgePairs(
	positions: { x: number; y: number }[],
	edgePairs: [number, number][],
	{ directed = false, weighted = false, weights = [] as number[] } = {},
): Graph {
	return {
		nodes: positions.map((position, index) => ({
			id: `n${index}`,
			label: nodeLabel(index),
			x: Math.round(position.x),
			y: Math.round(position.y),
		})),
		edges: edgePairs.map(([source, target], index) => ({
			id: `e${index}`,
			source: `n${source}`,
			target: `n${target}`,
			weight: weights[index] ?? 1,
		})),
		directed,
		weighted,
	};
}

function circlePositions(count: number, radius: number, rotation = -Math.PI / 2) {
	return Array.from({ length: count }, (_, index) => {
		const angle = rotation + (index * 2 * Math.PI) / count;
		return {
			x: CENTER_X + radius * Math.cos(angle),
			y: CENTER_Y + radius * Math.sin(angle),
		};
	});
}

function completeGraphPairs(nodeCount: number): [number, number][] {
	const pairs: [number, number][] = [];
	for (let source = 0; source < nodeCount; source++) {
		for (let target = source + 1; target < nodeCount; target++) {
			pairs.push([source, target]);
		}
	}
	return pairs;
}

export const graphTemplates: GraphTemplate[] = [
	{
		id: "complete-k5",
		i18nKey: "template.completeK5",
		build: () => buildFromEdgePairs(circlePositions(5, 160), completeGraphPairs(5)),
	},
	{
		id: "bipartite-k33",
		i18nKey: "template.bipartiteK33",
		build: () => {
			const positions = [
				...Array.from({ length: 3 }, (_, index) => ({
					x: CENTER_X - 130,
					y: CENTER_Y - 140 + index * 140,
				})),
				...Array.from({ length: 3 }, (_, index) => ({
					x: CENTER_X + 130,
					y: CENTER_Y - 140 + index * 140,
				})),
			];
			const pairs: [number, number][] = [];
			for (let left = 0; left < 3; left++) {
				for (let right = 3; right < 6; right++) pairs.push([left, right]);
			}
			return buildFromEdgePairs(positions, pairs);
		},
	},
	{
		id: "binary-tree",
		i18nKey: "template.binaryTree",
		build: () => {
			const positions = [
				{ x: CENTER_X, y: CENTER_Y - 160 },
				{ x: CENTER_X - 160, y: CENTER_Y - 20 },
				{ x: CENTER_X + 160, y: CENTER_Y - 20 },
				{ x: CENTER_X - 240, y: CENTER_Y + 140 },
				{ x: CENTER_X - 80, y: CENTER_Y + 140 },
				{ x: CENTER_X + 80, y: CENTER_Y + 140 },
				{ x: CENTER_X + 240, y: CENTER_Y + 140 },
			];
			const pairs: [number, number][] = [
				[0, 1],
				[0, 2],
				[1, 3],
				[1, 4],
				[2, 5],
				[2, 6],
			];
			return buildFromEdgePairs(positions, pairs, { directed: true });
		},
	},
	{
		id: "petersen",
		i18nKey: "template.petersen",
		build: () => {
			const outer = circlePositions(5, 190);
			const inner = circlePositions(5, 95);
			const pairs: [number, number][] = [];
			for (let index = 0; index < 5; index++) {
				pairs.push([index, (index + 1) % 5]);
				pairs.push([index, index + 5]);
				pairs.push([index + 5, ((index + 2) % 5) + 5]);
			}
			return buildFromEdgePairs([...outer, ...inner], pairs);
		},
	},
	{
		id: "grid-3x3",
		i18nKey: "template.grid3x3",
		build: () => {
			const positions = Array.from({ length: 9 }, (_, index) => ({
				x: CENTER_X - 150 + (index % 3) * 150,
				y: CENTER_Y - 150 + Math.floor(index / 3) * 150,
			}));
			const pairs: [number, number][] = [];
			for (let row = 0; row < 3; row++) {
				for (let column = 0; column < 3; column++) {
					const index = row * 3 + column;
					if (column < 2) pairs.push([index, index + 1]);
					if (row < 2) pairs.push([index, index + 3]);
				}
			}
			return buildFromEdgePairs(positions, pairs);
		},
	},
	{
		id: "weighted-cycle",
		i18nKey: "template.weightedCycle",
		build: () => {
			const positions = circlePositions(6, 170);
			const pairs: [number, number][] = [
				[0, 1],
				[1, 2],
				[2, 3],
				[3, 4],
				[4, 5],
				[5, 0],
				[0, 3],
			];
			return buildFromEdgePairs(positions, pairs, {
				weighted: true,
				weights: [4, 8, 3, 6, 2, 7, 9],
			});
		},
	},
];
