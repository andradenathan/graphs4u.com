import type { Graph } from "@/types/graph";

export type AlgorithmId =
    | "bfs"
    | "dfs"
    | "dijkstra"
    | "bellman-ford"
    | "kruskal"
    | "prim"
    | "topological-sort"
    | "a-star"
    | "floyd-warshall"
    | "connected-components"
    | "max-flow";

export interface AlgorithmStep {
    visitedNodeIds: string[];
    visitedEdgeIds: string[];
    resultNodeIds: string[];
    resultEdgeIds: string[];
    distances: Record<string, number>;
    description: string;
    /**
     * Scalars that cannot be recovered from the node and edge sets alone, such
     * as the value of a maximum flow. Used to describe results in any language.
     */
    metrics?: {
        maxFlow?: number;
        componentCount?: number;
        expandedNodeCount?: number;
        pathCost?: number;
    };
}

export interface AlgorithmMeta {
    id: AlgorithmId;
    i18nKey: string;
    requiresWeighted: boolean;
    requiresDirected: boolean;
    requiresSource: boolean;
    /** Algorithms that also need a destination node, such as A* and max flow. */
    requiresTarget?: boolean;
    category:
        | "traversal"
        | "shortest-path"
        | "mst"
        | "ordering"
        | "components"
        | "flow";
}

export const algorithms: AlgorithmMeta[] = [
    {
        id: "bfs",
        i18nKey: "algo.bfs",
        requiresWeighted: false,
        requiresDirected: false,
        requiresSource: true,
        category: "traversal",
    },
    {
        id: "dfs",
        i18nKey: "algo.dfs",
        requiresWeighted: false,
        requiresDirected: false,
        requiresSource: true,
        category: "traversal",
    },
    {
        id: "dijkstra",
        i18nKey: "algo.dijkstra",
        requiresWeighted: true,
        requiresDirected: false,
        requiresSource: true,
        category: "shortest-path",
    },
    {
        id: "bellman-ford",
        i18nKey: "algo.bellmanFord",
        requiresWeighted: true,
        requiresDirected: true,
        requiresSource: true,
        category: "shortest-path",
    },
    {
        id: "kruskal",
        i18nKey: "algo.kruskal",
        requiresWeighted: true,
        requiresDirected: false,
        requiresSource: false,
        category: "mst",
    },
    {
        id: "prim",
        i18nKey: "algo.prim",
        requiresWeighted: true,
        requiresDirected: false,
        requiresSource: true,
        category: "mst",
    },
    {
        id: "topological-sort",
        i18nKey: "algo.topologicalSort",
        requiresWeighted: false,
        requiresDirected: true,
        requiresSource: false,
        category: "ordering",
    },
    {
        id: "a-star",
        i18nKey: "algo.aStar",
        requiresWeighted: true,
        requiresDirected: false,
        requiresSource: true,
        requiresTarget: true,
        category: "shortest-path",
    },
    {
        id: "floyd-warshall",
        i18nKey: "algo.floydWarshall",
        requiresWeighted: true,
        requiresDirected: false,
        requiresSource: true,
        category: "shortest-path",
    },
    {
        id: "connected-components",
        i18nKey: "algo.connectedComponents",
        requiresWeighted: false,
        requiresDirected: false,
        requiresSource: false,
        category: "components",
    },
    {
        id: "max-flow",
        i18nKey: "algo.maxFlow",
        requiresWeighted: true,
        requiresDirected: true,
        requiresSource: true,
        requiresTarget: true,
        category: "flow",
    },
];

interface Neighbor {
    nodeId: string;
    edgeId: string;
    weight: number;
}

function buildAdjacencyList(graph: Graph): Map<string, Neighbor[]> {
    const adjacency = new Map<string, Neighbor[]>();

    for (const node of graph.nodes) {
        adjacency.set(node.id, []);
    }

    for (const edge of graph.edges) {
        adjacency.get(edge.source)?.push({
            nodeId: edge.target,
            edgeId: edge.id,
            weight: edge.weight,
        });

        if (!graph.directed) {
            adjacency.get(edge.target)?.push({
                nodeId: edge.source,
                edgeId: edge.id,
                weight: edge.weight,
            });
        }
    }

    return adjacency;
}

function findNodeLabel(graph: Graph, nodeId: string): string {
    return graph.nodes.find((node) => node.id === nodeId)?.label ?? "?";
}

export function runBfs(graph: Graph, sourceId: string): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const visited = new Set<string>();
    const visitedEdges = new Set<string>();
    const queue: string[] = [sourceId];
    const order: string[] = [];
    visited.add(sourceId);

    while (queue.length > 0) {
        const current = queue.shift()!;
        order.push(current);

        for (const neighbor of adjacency.get(current) ?? []) {
            if (!visited.has(neighbor.nodeId)) {
                visited.add(neighbor.nodeId);
                visitedEdges.add(neighbor.edgeId);
                queue.push(neighbor.nodeId);
            }
        }
    }

    return {
        visitedNodeIds: order,
        visitedEdgeIds: [...visitedEdges],
        resultNodeIds: order,
        resultEdgeIds: [...visitedEdges],
        distances: {},
        description: `BFS: ${order.map((nodeId) => findNodeLabel(graph, nodeId)).join(" → ")}`,
    };
}

export function runDfs(graph: Graph, sourceId: string): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const visited = new Set<string>();
    const visitedEdges = new Set<string>();
    const order: string[] = [];

    function depthFirstSearch(nodeId: string) {
        visited.add(nodeId);
        order.push(nodeId);

        for (const neighbor of adjacency.get(nodeId) ?? []) {
            if (!visited.has(neighbor.nodeId)) {
                visitedEdges.add(neighbor.edgeId);
                depthFirstSearch(neighbor.nodeId);
            }
        }
    }

    depthFirstSearch(sourceId);

    return {
        visitedNodeIds: order,
        visitedEdgeIds: [...visitedEdges],
        resultNodeIds: order,
        resultEdgeIds: [...visitedEdges],
        distances: {},
        description: `DFS: ${order.map((nodeId) => findNodeLabel(graph, nodeId)).join(" → ")}`,
    };
}

export function runDijkstra(graph: Graph, sourceId: string): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const distances: Record<string, number> = {};
    const predecessors: Record<string, string | null> = {};
    const predecessorEdges: Record<string, string | null> = {};
    const visited = new Set<string>();
    const order: string[] = [];

    for (const node of graph.nodes) {
        distances[node.id] = Infinity;
        predecessors[node.id] = null;
        predecessorEdges[node.id] = null;
    }
    distances[sourceId] = 0;

    while (true) {
        let closestNodeId: string | null = null;
        let minimumDistance = Infinity;

        for (const node of graph.nodes) {
            if (!visited.has(node.id) && distances[node.id] < minimumDistance) {
                minimumDistance = distances[node.id];
                closestNodeId = node.id;
            }
        }

        if (closestNodeId === null) break;

        visited.add(closestNodeId);
        order.push(closestNodeId);

        for (const neighbor of adjacency.get(closestNodeId) ?? []) {
            const alternativeDistance =
                distances[closestNodeId] + neighbor.weight;

            if (alternativeDistance < distances[neighbor.nodeId]) {
                distances[neighbor.nodeId] = alternativeDistance;
                predecessors[neighbor.nodeId] = closestNodeId;
                predecessorEdges[neighbor.nodeId] = neighbor.edgeId;
            }
        }
    }

    const resultEdges: string[] = [];
    for (const node of graph.nodes) {
        if (predecessorEdges[node.id]) {
            resultEdges.push(predecessorEdges[node.id]!);
        }
    }

    return {
        visitedNodeIds: order,
        visitedEdgeIds: resultEdges,
        resultNodeIds: order,
        resultEdgeIds: resultEdges,
        distances,
        description: `Dijkstra: ${order.map((nodeId) => `${findNodeLabel(graph, nodeId)}(${distances[nodeId] === Infinity ? "∞" : distances[nodeId]})`).join(", ")}`,
    };
}

export function runBellmanFord(graph: Graph, sourceId: string): AlgorithmStep {
    const distances: Record<string, number> = {};
    const predecessorEdges: Record<string, string | null> = {};

    for (const node of graph.nodes) {
        distances[node.id] = Infinity;
        predecessorEdges[node.id] = null;
    }
    distances[sourceId] = 0;

    const nodeCount = graph.nodes.length;

    for (let iteration = 0; iteration < nodeCount - 1; iteration++) {
        for (const edge of graph.edges) {
            if (distances[edge.source] + edge.weight < distances[edge.target]) {
                distances[edge.target] = distances[edge.source] + edge.weight;
                predecessorEdges[edge.target] = edge.id;
            }
        }
    }

    let hasNegativeCycle = false;
    for (const edge of graph.edges) {
        if (distances[edge.source] + edge.weight < distances[edge.target]) {
            hasNegativeCycle = true;
            break;
        }
    }

    const reachableNodeIds = graph.nodes
        .filter((node) => distances[node.id] < Infinity)
        .map((node) => node.id);

    const resultEdges = Object.values(predecessorEdges).filter(
        (edgeId): edgeId is string => edgeId !== null,
    );

    return {
        visitedNodeIds: reachableNodeIds,
        visitedEdgeIds: resultEdges,
        resultNodeIds: reachableNodeIds,
        resultEdgeIds: resultEdges,
        distances,
        description: hasNegativeCycle
            ? "Bellman-Ford: Negative cycle detected!"
            : `Bellman-Ford: ${reachableNodeIds.map((nodeId) => `${findNodeLabel(graph, nodeId)}(${distances[nodeId] === Infinity ? "∞" : distances[nodeId]})`).join(", ")}`,
    };
}

export function runKruskal(graph: Graph): AlgorithmStep {
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};

    for (const node of graph.nodes) {
        parent[node.id] = node.id;
        rank[node.id] = 0;
    }

    function find(nodeId: string): string {
        if (parent[nodeId] !== nodeId) {
            parent[nodeId] = find(parent[nodeId]);
        }
        return parent[nodeId];
    }

    function union(nodeIdA: string, nodeIdB: string): boolean {
        const rootA = find(nodeIdA);
        const rootB = find(nodeIdB);

        if (rootA === rootB) return false;

        if (rank[rootA] < rank[rootB]) {
            parent[rootA] = rootB;
        } else if (rank[rootA] > rank[rootB]) {
            parent[rootB] = rootA;
        } else {
            parent[rootB] = rootA;
            rank[rootA]++;
        }

        return true;
    }

    const sortedEdges = [...graph.edges].sort(
        (edgeA, edgeB) => edgeA.weight - edgeB.weight,
    );
    const mstEdgeIds: string[] = [];
    const mstNodeIds = new Set<string>();

    for (const edge of sortedEdges) {
        if (union(edge.source, edge.target)) {
            mstEdgeIds.push(edge.id);
            mstNodeIds.add(edge.source);
            mstNodeIds.add(edge.target);
        }
    }

    const totalWeight = mstEdgeIds.reduce((sum, edgeId) => {
        const edge = graph.edges.find((candidate) => candidate.id === edgeId);
        return sum + (edge?.weight ?? 0);
    }, 0);

    return {
        visitedNodeIds: [...mstNodeIds],
        visitedEdgeIds: mstEdgeIds,
        resultNodeIds: [...mstNodeIds],
        resultEdgeIds: mstEdgeIds,
        distances: {},
        description: `Kruskal MST: ${mstEdgeIds.length} edges, total weight = ${totalWeight}`,
    };
}

export function runPrim(graph: Graph, sourceId: string): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const inMst = new Set<string>();
    const mstEdgeIds: string[] = [];
    const order: string[] = [];

    inMst.add(sourceId);
    order.push(sourceId);

    while (inMst.size < graph.nodes.length) {
        let bestCandidate: { edgeId: string; nodeId: string } | null = null;
        let bestWeight = Infinity;

        for (const mstNodeId of inMst) {
            for (const neighbor of adjacency.get(mstNodeId) ?? []) {
                if (
                    !inMst.has(neighbor.nodeId) &&
                    neighbor.weight < bestWeight
                ) {
                    bestWeight = neighbor.weight;
                    bestCandidate = {
                        edgeId: neighbor.edgeId,
                        nodeId: neighbor.nodeId,
                    };
                }
            }
        }

        if (!bestCandidate) break;

        inMst.add(bestCandidate.nodeId);
        mstEdgeIds.push(bestCandidate.edgeId);
        order.push(bestCandidate.nodeId);
    }

    const totalWeight = mstEdgeIds.reduce((sum, edgeId) => {
        const edge = graph.edges.find((candidate) => candidate.id === edgeId);
        return sum + (edge?.weight ?? 0);
    }, 0);

    return {
        visitedNodeIds: order,
        visitedEdgeIds: mstEdgeIds,
        resultNodeIds: order,
        resultEdgeIds: mstEdgeIds,
        distances: {},
        description: `Prim MST: ${mstEdgeIds.length} edges, total weight = ${totalWeight}`,
    };
}

export function runTopologicalSort(graph: Graph): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const visited = new Set<string>();
    const stack: string[] = [];
    let hasCycle = false;
    const currentlyVisiting = new Set<string>();

    function depthFirstSearch(nodeId: string) {
        if (hasCycle) return;

        currentlyVisiting.add(nodeId);
        visited.add(nodeId);

        for (const neighbor of adjacency.get(nodeId) ?? []) {
            if (currentlyVisiting.has(neighbor.nodeId)) {
                hasCycle = true;
                return;
            }
            if (!visited.has(neighbor.nodeId)) {
                depthFirstSearch(neighbor.nodeId);
            }
        }

        currentlyVisiting.delete(nodeId);
        stack.push(nodeId);
    }

    for (const node of graph.nodes) {
        if (!visited.has(node.id)) {
            depthFirstSearch(node.id);
        }
    }

    const order = stack.reverse();

    return {
        visitedNodeIds: order,
        visitedEdgeIds: graph.edges.map((edge) => edge.id),
        resultNodeIds: order,
        resultEdgeIds: [],
        distances: {},
        description: hasCycle
            ? "Topological Sort: Cycle detected! Not a DAG."
            : `Topological order: ${order.map((nodeId) => findNodeLabel(graph, nodeId)).join(" → ")}`,
    };
}

function euclideanDistance(
    first: { x: number; y: number },
    second: { x: number; y: number },
): number {
    return Math.hypot(second.x - first.x, second.y - first.y);
}

/**
 * Largest factor that keeps the straight-line heuristic admissible: every edge
 * must cost at least its pixel length times this factor, so the heuristic can
 * never overestimate the real cost.
 */
function buildHeuristicScale(graph: Graph): number {
    const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
    let scale = Infinity;

    for (const edge of graph.edges) {
        const source = nodeById.get(edge.source);
        const target = nodeById.get(edge.target);
        if (!source || !target) continue;

        const length = euclideanDistance(source, target);
        if (length === 0) continue;
        scale = Math.min(scale, edge.weight / length);
    }

    return Number.isFinite(scale) && scale > 0 ? scale : 0;
}

export function runAStar(
    graph: Graph,
    sourceId: string,
    targetId: string,
): AlgorithmStep {
    const adjacency = buildAdjacencyList(graph);
    const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
    const target = nodeById.get(targetId);
    const heuristicScale = buildHeuristicScale(graph);

    const heuristic = (nodeId: string) => {
        const node = nodeById.get(nodeId);
        if (!node || !target) return 0;
        return euclideanDistance(node, target) * heuristicScale;
    };

    const costFromSource: Record<string, number> = {};
    const predecessorEdges: Record<string, string | null> = {};
    const predecessors: Record<string, string | null> = {};
    for (const node of graph.nodes) {
        costFromSource[node.id] = Infinity;
        predecessorEdges[node.id] = null;
        predecessors[node.id] = null;
    }
    costFromSource[sourceId] = 0;

    const settled = new Set<string>();
    const visitOrder: string[] = [];
    const openSet = new Set<string>([sourceId]);

    while (openSet.size > 0) {
        let currentId: string | null = null;
        let bestEstimate = Infinity;
        for (const candidateId of openSet) {
            const estimate = costFromSource[candidateId] + heuristic(candidateId);
            if (estimate < bestEstimate) {
                bestEstimate = estimate;
                currentId = candidateId;
            }
        }
        if (currentId === null) break;

        openSet.delete(currentId);
        settled.add(currentId);
        visitOrder.push(currentId);
        if (currentId === targetId) break;

        for (const neighbor of adjacency.get(currentId) ?? []) {
            if (settled.has(neighbor.nodeId)) continue;
            const candidateCost = costFromSource[currentId] + neighbor.weight;
            if (candidateCost < costFromSource[neighbor.nodeId]) {
                costFromSource[neighbor.nodeId] = candidateCost;
                predecessors[neighbor.nodeId] = currentId;
                predecessorEdges[neighbor.nodeId] = neighbor.edgeId;
                openSet.add(neighbor.nodeId);
            }
        }
    }

    const pathNodeIds: string[] = [];
    const pathEdgeIds: string[] = [];
    if (costFromSource[targetId] !== Infinity) {
        let cursor: string | null = targetId;
        while (cursor) {
            pathNodeIds.unshift(cursor);
            const edgeId = predecessorEdges[cursor];
            if (edgeId) pathEdgeIds.unshift(edgeId);
            cursor = predecessors[cursor];
        }
    }

    const targetCost = costFromSource[targetId];
    return {
        visitedNodeIds: visitOrder,
        visitedEdgeIds: pathEdgeIds,
        resultNodeIds: pathNodeIds,
        resultEdgeIds: pathEdgeIds,
        distances: costFromSource,
        metrics: {
            expandedNodeCount: visitOrder.length,
            pathCost: targetCost === Infinity ? undefined : targetCost,
        },
        description:
            targetCost === Infinity
                ? `A*: no path from ${findNodeLabel(graph, sourceId)} to ${findNodeLabel(graph, targetId)}`
                : `A*: ${pathNodeIds.map((nodeId) => findNodeLabel(graph, nodeId)).join(" → ")} (cost ${targetCost}, ${visitOrder.length} nodes expanded)`,
    };
}

export function runFloydWarshall(
    graph: Graph,
    sourceId: string,
): AlgorithmStep {
    const nodeIds = graph.nodes.map((node) => node.id);
    const distanceMatrix = new Map<string, Map<string, number>>();

    for (const fromId of nodeIds) {
        const row = new Map<string, number>();
        for (const toId of nodeIds) {
            row.set(toId, fromId === toId ? 0 : Infinity);
        }
        distanceMatrix.set(fromId, row);
    }

    for (const edge of graph.edges) {
        const forwardRow = distanceMatrix.get(edge.source);
        if (forwardRow && edge.weight < (forwardRow.get(edge.target) ?? Infinity)) {
            forwardRow.set(edge.target, edge.weight);
        }
        if (!graph.directed) {
            const backwardRow = distanceMatrix.get(edge.target);
            if (
                backwardRow &&
                edge.weight < (backwardRow.get(edge.source) ?? Infinity)
            ) {
                backwardRow.set(edge.source, edge.weight);
            }
        }
    }

    for (const throughId of nodeIds) {
        for (const fromId of nodeIds) {
            const throughCost = distanceMatrix.get(fromId)?.get(throughId) ?? Infinity;
            if (throughCost === Infinity) continue;

            for (const toId of nodeIds) {
                const restCost =
                    distanceMatrix.get(throughId)?.get(toId) ?? Infinity;
                if (restCost === Infinity) continue;

                const candidate = throughCost + restCost;
                if (candidate < (distanceMatrix.get(fromId)?.get(toId) ?? Infinity)) {
                    distanceMatrix.get(fromId)?.set(toId, candidate);
                }
            }
        }
    }

    const hasNegativeCycle = nodeIds.some(
        (nodeId) => (distanceMatrix.get(nodeId)?.get(nodeId) ?? 0) < 0,
    );

    const distancesFromSource: Record<string, number> = {};
    for (const nodeId of nodeIds) {
        distancesFromSource[nodeId] =
            distanceMatrix.get(sourceId)?.get(nodeId) ?? Infinity;
    }

    const reachableNodeIds = nodeIds.filter(
        (nodeId) => distancesFromSource[nodeId] !== Infinity,
    );

    return {
        visitedNodeIds: reachableNodeIds,
        visitedEdgeIds: [],
        resultNodeIds: reachableNodeIds,
        resultEdgeIds: [],
        distances: distancesFromSource,
        description: hasNegativeCycle
            ? "Floyd-Warshall: negative cycle detected"
            : `Floyd-Warshall: all-pairs matrix computed (${nodeIds.length}² entries), showing row of ${findNodeLabel(graph, sourceId)}`,
    };
}

export function runConnectedComponents(graph: Graph): AlgorithmStep {
    // Direction is ignored on purpose: this is (weak) connectivity.
    const adjacency = buildAdjacencyList(graph);
    const undirectedAdjacency = new Map<string, Neighbor[]>();
    for (const node of graph.nodes) {
        undirectedAdjacency.set(node.id, [...(adjacency.get(node.id) ?? [])]);
    }
    if (graph.directed) {
        for (const edge of graph.edges) {
            undirectedAdjacency.get(edge.target)?.push({
                nodeId: edge.source,
                edgeId: edge.id,
                weight: edge.weight,
            });
        }
    }

    const visited = new Set<string>();
    const components: string[][] = [];
    const componentEdgeIds: string[] = [];

    for (const node of graph.nodes) {
        if (visited.has(node.id)) continue;

        const component: string[] = [];
        const stack = [node.id];
        visited.add(node.id);

        while (stack.length > 0) {
            const currentId = stack.pop()!;
            component.push(currentId);

            for (const neighbor of undirectedAdjacency.get(currentId) ?? []) {
                if (visited.has(neighbor.nodeId)) continue;
                visited.add(neighbor.nodeId);
                componentEdgeIds.push(neighbor.edgeId);
                stack.push(neighbor.nodeId);
            }
        }

        components.push(component);
    }

    const componentSummary = components
        .map(
            (component) =>
                `{${component.map((nodeId) => findNodeLabel(graph, nodeId)).join(", ")}}`,
        )
        .join(" ");

    return {
        visitedNodeIds: graph.nodes.map((node) => node.id),
        visitedEdgeIds: componentEdgeIds,
        resultNodeIds: graph.nodes.map((node) => node.id),
        resultEdgeIds: componentEdgeIds,
        distances: {},
        metrics: { componentCount: components.length },
        description: `Connected components: ${components.length} — ${componentSummary}`,
    };
}

export function runMaxFlow(
    graph: Graph,
    sourceId: string,
    sinkId: string,
): AlgorithmStep {
    // Edmonds-Karp: BFS augmenting paths over a residual capacity map.
    const residualCapacity = new Map<string, Map<string, number>>();
    const edgeIdByPair = new Map<string, string>();

    const ensureRow = (nodeId: string) => {
        if (!residualCapacity.has(nodeId)) {
            residualCapacity.set(nodeId, new Map<string, number>());
        }
        return residualCapacity.get(nodeId)!;
    };

    for (const node of graph.nodes) ensureRow(node.id);

    for (const edge of graph.edges) {
        const forwardRow = ensureRow(edge.source);
        ensureRow(edge.target);
        forwardRow.set(
            edge.target,
            (forwardRow.get(edge.target) ?? 0) + Math.max(edge.weight, 0),
        );
        edgeIdByPair.set(`${edge.source}>${edge.target}`, edge.id);
    }

    let maxFlow = 0;
    const usedEdgeIds = new Set<string>();
    const visitedNodeIds = new Set<string>([sourceId]);

    while (true) {
        const predecessor = new Map<string, string>();
        const queue = [sourceId];
        predecessor.set(sourceId, sourceId);

        while (queue.length > 0 && !predecessor.has(sinkId)) {
            const currentId = queue.shift()!;
            for (const [neighborId, capacity] of residualCapacity.get(currentId) ??
                []) {
                if (capacity > 0 && !predecessor.has(neighborId)) {
                    predecessor.set(neighborId, currentId);
                    visitedNodeIds.add(neighborId);
                    queue.push(neighborId);
                }
            }
        }

        if (!predecessor.has(sinkId)) break;

        let bottleneck = Infinity;
        let cursor = sinkId;
        while (cursor !== sourceId) {
            const previous = predecessor.get(cursor)!;
            bottleneck = Math.min(
                bottleneck,
                residualCapacity.get(previous)?.get(cursor) ?? 0,
            );
            cursor = previous;
        }

        cursor = sinkId;
        while (cursor !== sourceId) {
            const previous = predecessor.get(cursor)!;
            const forwardRow = residualCapacity.get(previous)!;
            forwardRow.set(cursor, (forwardRow.get(cursor) ?? 0) - bottleneck);

            const backwardRow = ensureRow(cursor);
            backwardRow.set(previous, (backwardRow.get(previous) ?? 0) + bottleneck);

            const edgeId = edgeIdByPair.get(`${previous}>${cursor}`);
            if (edgeId) usedEdgeIds.add(edgeId);

            cursor = previous;
        }

        maxFlow += bottleneck;
    }

    return {
        visitedNodeIds: [...visitedNodeIds],
        visitedEdgeIds: [...usedEdgeIds],
        resultNodeIds: [...visitedNodeIds],
        resultEdgeIds: [...usedEdgeIds],
        distances: {},
        metrics: { maxFlow },
        description: `Max flow from ${findNodeLabel(graph, sourceId)} to ${findNodeLabel(graph, sinkId)} = ${maxFlow}`,
    };
}

export function runAlgorithm(
    id: AlgorithmId,
    graph: Graph,
    sourceId?: string,
    targetId?: string,
): AlgorithmStep {
    switch (id) {
        case "bfs":
            return runBfs(graph, sourceId!);
        case "dfs":
            return runDfs(graph, sourceId!);
        case "dijkstra":
            return runDijkstra(graph, sourceId!);
        case "bellman-ford":
            return runBellmanFord(graph, sourceId!);
        case "kruskal":
            return runKruskal(graph);
        case "prim":
            return runPrim(graph, sourceId!);
        case "topological-sort":
            return runTopologicalSort(graph);
        case "a-star":
            return runAStar(graph, sourceId!, targetId!);
        case "floyd-warshall":
            return runFloydWarshall(graph, sourceId!);
        case "connected-components":
            return runConnectedComponents(graph);
        case "max-flow":
            return runMaxFlow(graph, sourceId!, targetId!);
    }
}
