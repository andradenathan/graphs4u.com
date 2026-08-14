import type { Graph } from "@/types/graph";
import type { AlgorithmId, AlgorithmStep } from "@/lib/algorithms";
import { t, type LanguageCode } from "@/lib/i18n";

/**
 * Localized, human-readable summary of an algorithm run. The raw
 * `AlgorithmStep.description` is English-only, and these strings end up in the
 * static HTML of the content pages, so they must follow the page language.
 */
export function describeAlgorithmResult(
	algorithmId: AlgorithmId,
	graph: Graph,
	result: AlgorithmStep,
	language: LanguageCode,
): string {
	const labelOf = (nodeId: string) =>
		graph.nodes.find((node) => node.id === nodeId)?.label ?? "?";

	if (algorithmId === "topological-sort") {
		if (result.resultNodeIds.length < graph.nodes.length) {
			return t("result.cycleDetected", language);
		}
		return `${t("result.topologicalOrder", language)}: ${result.resultNodeIds
			.map(labelOf)
			.join(" → ")}`;
	}

	if (algorithmId === "bfs" || algorithmId === "dfs") {
		return `${t("result.visitOrder", language)}: ${result.resultNodeIds
			.map(labelOf)
			.join(" → ")}`;
	}

	if (algorithmId === "dijkstra" || algorithmId === "bellman-ford") {
		const distances = result.resultNodeIds
			.map((nodeId) => {
				const distance = result.distances[nodeId];
				const readableDistance =
					distance === undefined || distance === Infinity ? "∞" : distance;
				return `${labelOf(nodeId)} = ${readableDistance}`;
			})
			.join(", ");
		return `${t("result.distances", language)}: ${distances}`;
	}

	const totalWeight = result.resultEdgeIds.reduce((sum, edgeId) => {
		const edge = graph.edges.find((candidate) => candidate.id === edgeId);
		return sum + (edge?.weight ?? 0);
	}, 0);

	return t("result.spanningTree", language)
		.replace("{edges}", String(result.resultEdgeIds.length))
		.replace("{weight}", String(totalWeight));
}
