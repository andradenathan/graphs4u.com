import { generateId } from "@/lib/utils";
import type {
    Graph,
    GraphNode,
    GraphEdge,
    GraphState,
    Tool,
    AlgorithmResult,
} from "@/types/graph";

export type Action =
    | { type: "ADD_NODE"; payload: { x: number; y: number } }
    | {
          type: "UPDATE_NODE";
          payload: { id: string; updates: Partial<Omit<GraphNode, "id">> };
      }
    | { type: "DELETE_NODE"; payload: { id: string } }
    | { type: "ADD_EDGE"; payload: { source: string; target: string } }
    | {
          type: "UPDATE_EDGE";
          payload: { id: string; updates: Partial<Omit<GraphEdge, "id">> };
      }
    | { type: "DELETE_EDGE"; payload: { id: string } }
    | { type: "SELECT_NODE"; payload: { id: string; multi?: boolean } }
    | { type: "SELECT_EDGE"; payload: { id: string; multi?: boolean } }
    | { type: "CLEAR_SELECTION" }
    | { type: "SET_TOOL"; payload: { tool: Tool } }
    | { type: "SET_EDGE_SOURCE"; payload: { id: string | null } }
    | { type: "SET_DIRECTED"; payload: { directed: boolean } }
    | { type: "SET_WEIGHTED"; payload: { weighted: boolean } }
    | { type: "CLEAR_GRAPH" }
    | { type: "MOVE_NODE"; payload: { id: string; x: number; y: number } }
    | { type: "SET_ALGORITHM_RESULT"; payload: { result: AlgorithmResult } }
    | { type: "CLEAR_ALGORITHM_RESULT" };

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
    algorithmResult: null,
};

let nodeCounter = 0;

function getNextLabel(): string {
    const label = String.fromCharCode(65 + (nodeCounter % 26));
    const suffix =
        nodeCounter >= 26 ? Math.floor(nodeCounter / 26).toString() : "";
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
                algorithmResult: null,
            };
        }

        case "UPDATE_NODE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    nodes: state.graph.nodes.map((node) =>
                        node.id === action.payload.id
                            ? { ...node, ...action.payload.updates }
                            : node,
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
                    nodes: state.graph.nodes.filter(
                        (node) => node.id !== nodeId,
                    ),
                    edges: state.graph.edges.filter(
                        (edge) =>
                            edge.source !== nodeId && edge.target !== nodeId,
                    ),
                },
                selectedNodeIds: state.selectedNodeIds.filter(
                    (id) => id !== nodeId,
                ),
                edgeSourceId:
                    state.edgeSourceId === nodeId ? null : state.edgeSourceId,
                algorithmResult: null,
            };
        }

        case "ADD_EDGE": {
            const { source, target } = action.payload;
            const exists = state.graph.edges.some(
                (edge) =>
                    (edge.source === source && edge.target === target) ||
                    (!state.graph.directed &&
                        edge.source === target &&
                        edge.target === source),
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
                algorithmResult: null,
            };
        }

        case "UPDATE_EDGE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    edges: state.graph.edges.map((edge) =>
                        edge.id === action.payload.id
                            ? { ...edge, ...action.payload.updates }
                            : edge,
                    ),
                },
            };
        }

        case "DELETE_EDGE": {
            return {
                ...state,
                graph: {
                    ...state.graph,
                    edges: state.graph.edges.filter(
                        (edge) => edge.id !== action.payload.id,
                    ),
                },
                selectedEdgeIds: state.selectedEdgeIds.filter(
                    (id) => id !== action.payload.id,
                ),
                algorithmResult: null,
            };
        }

        case "SELECT_NODE": {
            const { id, multi } = action.payload;
            return {
                ...state,
                selectedNodeIds: multi
                    ? state.selectedNodeIds.includes(id)
                        ? state.selectedNodeIds.filter(
                              (nodeId) => nodeId !== id,
                          )
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
                        ? state.selectedEdgeIds.filter(
                              (edgeId) => edgeId !== id,
                          )
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
                    nodes: state.graph.nodes.map((node) =>
                        node.id === action.payload.id
                            ? {
                                  ...node,
                                  x: action.payload.x,
                                  y: action.payload.y,
                              }
                            : node,
                    ),
                },
                algorithmResult: null,
            };

        case "SET_ALGORITHM_RESULT":
            return {
                ...state,
                algorithmResult: action.payload.result,
            };

        case "CLEAR_ALGORITHM_RESULT":
            return {
                ...state,
                algorithmResult: null,
            };

        default:
            return state;
    }
}
