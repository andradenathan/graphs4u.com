import type { Graph } from "@/types/graph";

export type AlgorithmId =
    | "bfs"
    | "dfs"
    | "dijkstra"
    | "bellman-ford"
    | "kruskal"
    | "prim"
    | "topological-sort";

export interface AlgorithmStep {
    visitedNodeIds: string[];
    visitedEdgeIds: string[];
    resultNodeIds: string[];
    resultEdgeIds: string[];
    distances: Record<string, number>;
    description: string;
}

export interface AlgorithmMeta {
    id: AlgorithmId;
    i18nKey: string;
    requiresWeighted: boolean;
    requiresDirected: boolean;
    requiresSource: boolean;
    category: "traversal" | "shortest-path" | "mst" | "ordering";
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

export function runAlgorithm(
    id: AlgorithmId,
    graph: Graph,
    sourceId?: string,
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
    }
}
