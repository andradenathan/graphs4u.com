import type { Graph, GraphEdge, GraphNode } from "@/types/graph";

/**
 * Compact, URL-safe encoding of a graph, so any graph can be shared as a link
 * without a server. Layout:
 *
 *   version | flags | label,x,y ; ... | sourceIndex,targetIndex,weight ; ...
 *
 * The payload is percent-encoded per label and then base64url encoded, which
 * keeps the query string short and free of characters that break links.
 */

const FORMAT_VERSION = "1";
const DIRECTED_FLAG = 1;
const WEIGHTED_FLAG = 2;

export const GRAPH_QUERY_PARAMETER = "g";
export const ALGORITHM_QUERY_PARAMETER = "algorithm";

// The payload is percent-encoded before this point, so it is always ASCII and
// safe for btoa/atob, which exist both in browsers and in the Node build step.
function toBase64Url(value: string): string {
	return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	return atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}

export function encodeGraph(graph: Graph): string {
	let flags = 0;
	if (graph.directed) flags |= DIRECTED_FLAG;
	if (graph.weighted) flags |= WEIGHTED_FLAG;

	const nodeIndexById = new Map(
		graph.nodes.map((node, index) => [node.id, index]),
	);

	const encodedNodes = graph.nodes
		.map(
			(node) =>
				`${encodeURIComponent(node.label)},${Math.round(node.x)},${Math.round(node.y)}`,
		)
		.join(";");

	const encodedEdges = graph.edges
		.filter(
			(edge) =>
				nodeIndexById.has(edge.source) && nodeIndexById.has(edge.target),
		)
		.map(
			(edge) =>
				`${nodeIndexById.get(edge.source)},${nodeIndexById.get(edge.target)},${edge.weight}`,
		)
		.join(";");

	return toBase64Url(
		`${FORMAT_VERSION}|${flags}|${encodedNodes}|${encodedEdges}`,
	);
}

function parseNodes(section: string): GraphNode[] | null {
	if (!section) return [];

	const nodes: GraphNode[] = [];
	for (const [index, entry] of section.split(";").entries()) {
		const [label, x, y] = entry.split(",");
		const parsedX = Number(x);
		const parsedY = Number(y);
		if (label === undefined || !Number.isFinite(parsedX) || !Number.isFinite(parsedY)) {
			return null;
		}
		nodes.push({
			id: `n${index}`,
			label: decodeURIComponent(label),
			x: parsedX,
			y: parsedY,
		});
	}
	return nodes;
}

function parseEdges(section: string, nodes: GraphNode[]): GraphEdge[] | null {
	if (!section) return [];

	const edges: GraphEdge[] = [];
	for (const [index, entry] of section.split(";").entries()) {
		const [source, target, weight] = entry.split(",");
		const sourceIndex = Number(source);
		const targetIndex = Number(target);
		const parsedWeight = Number(weight);
		if (
			!nodes[sourceIndex] ||
			!nodes[targetIndex] ||
			!Number.isFinite(parsedWeight)
		) {
			return null;
		}
		edges.push({
			id: `e${index}`,
			source: nodes[sourceIndex].id,
			target: nodes[targetIndex].id,
			weight: parsedWeight,
		});
	}
	return edges;
}

/** Returns null for anything that is not a graph this version can read. */
export function decodeGraph(encoded: string): Graph | null {
	try {
		const [version, flags, nodeSection = "", edgeSection = ""] =
			fromBase64Url(encoded).split("|");
		if (version !== FORMAT_VERSION) return null;

		const parsedFlags = Number(flags);
		if (!Number.isFinite(parsedFlags)) return null;

		const nodes = parseNodes(nodeSection);
		if (!nodes) return null;

		const edges = parseEdges(edgeSection, nodes);
		if (!edges) return null;

		return {
			nodes,
			edges,
			directed: (parsedFlags & DIRECTED_FLAG) !== 0,
			weighted: (parsedFlags & WEIGHTED_FLAG) !== 0,
		};
	} catch {
		return null;
	}
}

export interface GraphLinkOptions {
	graph: Graph;
	/** Preselects an algorithm in the editor when the link is opened. */
	algorithmId?: string;
	/** Editor path for the current language. */
	basePath: string;
}

export function buildGraphLink({
	graph,
	algorithmId,
	basePath,
}: GraphLinkOptions): string {
	const parameters = new URLSearchParams();
	parameters.set(GRAPH_QUERY_PARAMETER, encodeGraph(graph));
	if (algorithmId) parameters.set(ALGORITHM_QUERY_PARAMETER, algorithmId);
	return `${basePath}?${parameters.toString()}`;
}
