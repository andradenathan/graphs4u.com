import type { Graph, GraphEdge, GraphNode } from "@/types/graph";

/**
 * Text interchange formats for graphs: DOT, adjacency matrix and edge list.
 * Importing accepts what students actually paste (assignment matrices, edge
 * lists from a textbook), so the parsers are permissive about separators.
 */

export type GraphFormatId = "dot" | "adjacency-matrix" | "edge-list";

const IMPORT_CENTER_X = 400;
const IMPORT_CENTER_Y = 280;
const IMPORT_RADIUS = 190;

export interface GraphParseResult {
	graph: Graph | null;
	/** i18n key describing why parsing failed, when it did. */
	errorKey: string | null;
}

function layoutInCircle(labels: string[]): GraphNode[] {
	return labels.map((label, index) => {
		const angle = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(labels.length, 1);
		return {
			id: `n${index}`,
			label,
			x: Math.round(IMPORT_CENTER_X + IMPORT_RADIUS * Math.cos(angle)),
			y: Math.round(IMPORT_CENTER_Y + IMPORT_RADIUS * Math.sin(angle)),
		};
	});
}

function splitCells(line: string): string[] {
	return line
		.trim()
		.split(/[\s,;]+/)
		.filter((cell) => cell.length > 0);
}

function meaningfulLines(text: string): string[] {
	return text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("//"));
}

// ---------------------------------------------------------------- DOT

export function graphToDot(graph: Graph): string {
	const connector = graph.directed ? "->" : "--";
	const header = graph.directed ? "digraph" : "graph";
	const labelById = new Map(graph.nodes.map((node) => [node.id, node.label]));

	const nodeLines = graph.nodes.map((node) => `  "${node.label}";`);
	const edgeLines = graph.edges.map((edge) => {
		const source = labelById.get(edge.source) ?? edge.source;
		const target = labelById.get(edge.target) ?? edge.target;
		const attributes = graph.weighted ? ` [weight=${edge.weight}]` : "";
		return `  "${source}" ${connector} "${target}"${attributes};`;
	});

	return [`${header} G {`, ...nodeLines, ...edgeLines, "}"].join("\n");
}

export function parseDot(text: string): GraphParseResult {
	const directed = /\bdigraph\b/.test(text);
	const connector = directed ? "->" : "--";
	const edgePattern = new RegExp(
		`"?([\\w\\-.]+)"?\\s*${directed ? "->" : "--"}\\s*"?([\\w\\-.]+)"?\\s*(?:\\[([^\\]]*)\\])?`,
		"g",
	);

	const labels: string[] = [];
	const indexOfLabel = (label: string) => {
		const existing = labels.indexOf(label);
		if (existing !== -1) return existing;
		labels.push(label);
		return labels.length - 1;
	};

	const parsedEdges: { source: number; target: number; weight: number }[] = [];
	let weighted = false;

	for (const match of text.matchAll(edgePattern)) {
		const [, source, target, attributes] = match;
		const weightMatch = attributes?.match(/(?:weight|label)\s*=\s*"?(-?\d+(?:\.\d+)?)"?/);
		if (weightMatch) weighted = true;
		parsedEdges.push({
			source: indexOfLabel(source),
			target: indexOfLabel(target),
			weight: weightMatch ? Number(weightMatch[1]) : 1,
		});
	}

	if (parsedEdges.length === 0 && !text.includes(connector)) {
		return { graph: null, errorKey: "io.error.dot" };
	}

	// Isolated nodes: quoted or bare identifiers on their own statement.
	for (const match of text.matchAll(/^\s*"?([\w\-.]+)"?\s*;\s*$/gm)) {
		indexOfLabel(match[1]);
	}

	const nodes = layoutInCircle(labels);
	const edges: GraphEdge[] = parsedEdges.map((edge, index) => ({
		id: `e${index}`,
		source: nodes[edge.source].id,
		target: nodes[edge.target].id,
		weight: edge.weight,
	}));

	return { graph: { nodes, edges, directed, weighted }, errorKey: null };
}

// ------------------------------------------------------ Adjacency matrix

export function graphToAdjacencyMatrix(graph: Graph): string {
	const indexById = new Map(graph.nodes.map((node, index) => [node.id, index]));
	const size = graph.nodes.length;
	const matrix = Array.from({ length: size }, () => new Array<number>(size).fill(0));

	for (const edge of graph.edges) {
		const source = indexById.get(edge.source);
		const target = indexById.get(edge.target);
		if (source === undefined || target === undefined) continue;
		const value = graph.weighted ? edge.weight : 1;
		matrix[source][target] = value;
		if (!graph.directed) matrix[target][source] = value;
	}

	const header = graph.nodes.map((node) => node.label).join(" ");
	return [header, ...matrix.map((row) => row.join(" "))].join("\n");
}

export function parseAdjacencyMatrix(text: string): GraphParseResult {
	const lines = meaningfulLines(text);
	if (lines.length === 0) return { graph: null, errorKey: "io.error.empty" };

	// An optional first line may carry the node labels.
	const firstLineCells = splitCells(lines[0]);
	const hasLabelHeader = firstLineCells.some((cell) => !Number.isFinite(Number(cell)));
	const matrixLines = hasLabelHeader ? lines.slice(1) : lines;
	const size = matrixLines.length;

	if (size === 0) return { graph: null, errorKey: "io.error.matrixShape" };

	const matrix: number[][] = [];
	for (const line of matrixLines) {
		const cells = splitCells(line);
		// Rows may be prefixed with their own label; drop it only when that
		// extra cell really is a label, so a malformed row still fails.
		const hasRowLabel =
			cells.length === size + 1 && !Number.isFinite(Number(cells[0]));
		const values = hasRowLabel ? cells.slice(1) : cells;
		if (values.length !== size) {
			return { graph: null, errorKey: "io.error.matrixShape" };
		}
		const row = values.map(Number);
		if (row.some((value) => !Number.isFinite(value))) {
			return { graph: null, errorKey: "io.error.matrixValue" };
		}
		matrix.push(row);
	}

	const labels = hasLabelHeader
		? firstLineCells.slice(0, size)
		: Array.from({ length: size }, (_, index) =>
				String.fromCharCode(65 + (index % 26)),
			);
	if (labels.length !== size) {
		return { graph: null, errorKey: "io.error.matrixShape" };
	}

	const isSymmetric = matrix.every((row, rowIndex) =>
		row.every((value, columnIndex) => value === matrix[columnIndex][rowIndex]),
	);
	const weighted = matrix.some((row) =>
		row.some((value) => value !== 0 && value !== 1),
	);

	const nodes = layoutInCircle(labels);
	const edges: GraphEdge[] = [];
	for (let row = 0; row < size; row++) {
		for (let column = 0; column < size; column++) {
			const value = matrix[row][column];
			if (value === 0) continue;
			// An undirected graph is stored twice; keep the upper triangle only.
			if (isSymmetric && column < row) continue;
			edges.push({
				id: `e${edges.length}`,
				source: nodes[row].id,
				target: nodes[column].id,
				weight: weighted ? value : 1,
			});
		}
	}

	return {
		graph: { nodes, edges, directed: !isSymmetric, weighted },
		errorKey: null,
	};
}

// ----------------------------------------------------------- Edge list

export function graphToEdgeList(graph: Graph): string {
	const labelById = new Map(graph.nodes.map((node) => [node.id, node.label]));
	return graph.edges
		.map((edge) => {
			const source = labelById.get(edge.source) ?? edge.source;
			const target = labelById.get(edge.target) ?? edge.target;
			return graph.weighted
				? `${source} ${target} ${edge.weight}`
				: `${source} ${target}`;
		})
		.join("\n");
}

export interface EdgeListOptions {
	directed: boolean;
}

export function parseEdgeList(
	text: string,
	{ directed }: EdgeListOptions,
): GraphParseResult {
	const lines = meaningfulLines(text);
	if (lines.length === 0) return { graph: null, errorKey: "io.error.empty" };

	const labels: string[] = [];
	const indexOfLabel = (label: string) => {
		const existing = labels.indexOf(label);
		if (existing !== -1) return existing;
		labels.push(label);
		return labels.length - 1;
	};

	const parsedEdges: { source: number; target: number; weight: number }[] = [];
	let weighted = false;

	for (const line of lines) {
		const cells = splitCells(line);
		if (cells.length === 1) {
			indexOfLabel(cells[0]);
			continue;
		}
		if (cells.length < 2) return { graph: null, errorKey: "io.error.edgeList" };

		const [source, target, weight] = cells;
		const parsedWeight = weight === undefined ? 1 : Number(weight);
		if (!Number.isFinite(parsedWeight)) {
			return { graph: null, errorKey: "io.error.edgeList" };
		}
		if (weight !== undefined) weighted = true;

		parsedEdges.push({
			source: indexOfLabel(source),
			target: indexOfLabel(target),
			weight: parsedWeight,
		});
	}

	const nodes = layoutInCircle(labels);
	const edges: GraphEdge[] = parsedEdges.map((edge, index) => ({
		id: `e${index}`,
		source: nodes[edge.source].id,
		target: nodes[edge.target].id,
		weight: edge.weight,
	}));

	return { graph: { nodes, edges, directed, weighted }, errorKey: null };
}

// ------------------------------------------------------------ Dispatch

export function exportGraph(graph: Graph, format: GraphFormatId): string {
	switch (format) {
		case "dot":
			return graphToDot(graph);
		case "adjacency-matrix":
			return graphToAdjacencyMatrix(graph);
		case "edge-list":
			return graphToEdgeList(graph);
	}
}

export function importGraph(
	text: string,
	format: GraphFormatId,
	options: EdgeListOptions,
): GraphParseResult {
	if (text.trim().length === 0) return { graph: null, errorKey: "io.error.empty" };

	switch (format) {
		case "dot":
			return parseDot(text);
		case "adjacency-matrix":
			return parseAdjacencyMatrix(text);
		case "edge-list":
			return parseEdgeList(text, options);
	}
}
