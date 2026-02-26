export interface GraphNode {
    id: string;
    x: number;
    y: number;
    label: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    weight: number;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    directed: boolean;
    weighted: boolean;
}

export type Tool = "select" | "add-node" | "add-edge" | "delete";

export interface AlgorithmResult {
    algorithmId: string;
    visitedNodeIds: string[];
    visitedEdgeIds: string[];
    resultNodeIds: string[];
    resultEdgeIds: string[];
    distances: Record<string, number>;
    description: string;
}

export interface GraphState {
    graph: Graph;
    selectedNodeIds: string[];
    selectedEdgeIds: string[];
    activeTool: Tool;
    edgeSourceId: string | null;
    algorithmResult: AlgorithmResult | null;
}
