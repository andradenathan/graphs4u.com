import { generateId } from "@/lib/utils";
import type { Graph, GraphNode, GraphEdge, GraphState, Tool } from "@/types/graph";

export type Action =
    | { type: "ADD_NODE"; payload: { x: number; y: number } }
    | { type: "UPDATE_NODE"; payload: { id: string; updates: Partial<Omit<GraphNode, "id">> } }
    | { type: "DELETE_NODE"; payload: { id: string } }
    | { type: "ADD_EDGE"; payload: { source: string; target: string } }
    | { type: "UPDATE_EDGE"; payload: { id: string; updates: Partial<Omit<GraphEdge, "id">> } }
    | { type: "DELETE_EDGE"; payload: { id: string } }
    | { type: "SELECT_NODE"; payload: { id: string; multi?: boolean } }
    | { type: "SELECT_EDGE"; payload: { id: string; multi?: boolean } }
    | { type: "CLEAR_SELECTION" }
    | { type: "SET_TOOL"; payload: { tool: Tool } }
    | { type: "SET_EDGE_SOURCE"; payload: { id: string | null } }
    | { type: "SET_DIRECTED"; payload: { directed: boolean } }
    | { type: "SET_WEIGHTED"; payload: { weighted: boolean } }
    | { type: "CLEAR_GRAPH" }
    | { type: "MOVE_NODE"; payload: { id: string; x: number; y: number } };

const initialGraph: Graph = {
    nodes: [],
    edges: [],
    directed: false,
    weighted: false,
};

export const initialState: GraphState = {
    graph: initialGraph,
    selectedNodeIds: [],
    selectedEdgeIds: [],
    activeTool: "select",
    edgeSourceId: null,
};

let nodeCounter = 0;

function getNextLabel(): string {
    const label = String.fromCharCode(65 + (nodeCounter % 26));
    const suffix = nodeCounter >= 26 ? Math.floor(nodeCounter / 26).toString() : "";
    nodeCounter++;
    return label + suffix;
}

export function graphReducer(state: GraphState, action: Action): GraphState {
    switch (action.type) {
        case "ADD_NODE": {
            const newNode: GraphNode = {
                id: generateId("node"),
                x: action.payload.x,
                y: action.payload.y,
                label: getNextLabel(),
            };
            return {
                ...state,
                graph: {
                    ...state.graph,
                    nodes: [...state.graph.nodes, newNode],
                },
                selectedNodeIds: [newNode.id],
                selectedEdgeIds: [],
            };
        }

        case "UPDATE_NODE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    nodes: state.graph.nodes.map((n) =>
                        n.id === action.payload.id
                            ? { ...n, ...action.payload.updates }
                            : n,
                    ),
                },
            };
        }

        case "DELETE_NODE": {
            const nodeId = action.payload.id;
            return {
                ...state,
                graph: {
                    ...state.graph,
                    nodes: state.graph.nodes.filter((n) => n.id !== nodeId),
                    edges: state.graph.edges.filter(
                        (e) => e.source !== nodeId && e.target !== nodeId,
                    ),
                },
                selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
                edgeSourceId: state.edgeSourceId === nodeId ? null : state.edgeSourceId,
            };
        }

        case "ADD_EDGE": {
            const { source, target } = action.payload;
            const exists = state.graph.edges.some(
                (e) =>
                    (e.source === source && e.target === target) ||
                    (!state.graph.directed && e.source === target && e.target === source),
            );
            if (exists || source === target) return state;

            const newEdge: GraphEdge = {
                id: generateId("edge"),
                source,
                target,
                weight: 1,
            };
            return {
                ...state,
                graph: {
                    ...state.graph,
                    edges: [...state.graph.edges, newEdge],
                },
                selectedEdgeIds: [newEdge.id],
                selectedNodeIds: [],
                edgeSourceId: null,
            };
        }

        case "UPDATE_EDGE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    edges: state.graph.edges.map((e) =>
                        e.id === action.payload.id
                            ? { ...e, ...action.payload.updates }
                            : e,
                    ),
                },
            };
        }

        case "DELETE_EDGE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    edges: state.graph.edges.filter((e) => e.id !== action.payload.id),
                },
                selectedEdgeIds: state.selectedEdgeIds.filter((id) => id !== action.payload.id),
            };
        }

        case "SELECT_NODE": {
            const { id, multi } = action.payload;
            return {
                ...state,
                selectedNodeIds: multi
                    ? state.selectedNodeIds.includes(id)
                        ? state.selectedNodeIds.filter((nid) => nid !== id)
                        : [...state.selectedNodeIds, id]
                    : [id],
                selectedEdgeIds: multi ? state.selectedEdgeIds : [],
            };
        }

        case "SELECT_EDGE": {
            const { id, multi } = action.payload;
            return {
                ...state,
                selectedEdgeIds: multi
                    ? state.selectedEdgeIds.includes(id)
                        ? state.selectedEdgeIds.filter((eid) => eid !== id)
                        : [...state.selectedEdgeIds, id]
                    : [id],
                selectedNodeIds: multi ? state.selectedNodeIds : [],
            };
        }

        case "CLEAR_SELECTION":
            return {
                ...state,
                selectedNodeIds: [],
                selectedEdgeIds: [],
                edgeSourceId: null,
            };

        case "SET_TOOL":
            return {
                ...state,
                activeTool: action.payload.tool,
                edgeSourceId: null,
            };

        case "SET_EDGE_SOURCE":
            return {
                ...state,
                edgeSourceId: action.payload.id,
            };

        case "SET_DIRECTED":
            return {
                ...state,
                graph: { ...state.graph, directed: action.payload.directed },
            };

        case "SET_WEIGHTED":
            return {
                ...state,
                graph: { ...state.graph, weighted: action.payload.weighted },
            };

        case "CLEAR_GRAPH":
            nodeCounter = 0;
            return {
                ...initialState,
                activeTool: state.activeTool,
            };

        case "MOVE_NODE":
            return {
                ...state,
                graph: {
                    ...state.graph,
                    nodes: state.graph.nodes.map((n) =>
                        n.id === action.payload.id
                            ? { ...n, x: action.payload.x, y: action.payload.y }
                            : n,
                    ),
                },
            };

        default:
            return state;
    }
}
