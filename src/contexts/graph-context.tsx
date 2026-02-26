import { createContext, useReducer, useCallback, type ReactNode } from "react";
import type { GraphNode, GraphEdge, GraphState, Tool } from "@/types/graph";
import { graphReducer, initialState } from "@/stores/graph-store";

export interface GraphContextValue {
    state: GraphState;
    addNode: (x: number, y: number) => void;
    deleteNode: (id: string) => void;
    addEdge: (source: string, target: string) => void;
    deleteEdge: (id: string) => void;
    selectNode: (id: string, multi?: boolean) => void;
    selectEdge: (id: string, multi?: boolean) => void;
    clearSelection: () => void;
    setTool: (tool: Tool) => void;
    setEdgeSource: (id: string | null) => void;
    moveNode: (id: string, x: number, y: number) => void;
    updateNode: (id: string, updates: Partial<Omit<GraphNode, "id">>) => void;
    updateEdge: (id: string, updates: Partial<Omit<GraphEdge, "id">>) => void;
    clearGraph: () => void;
    setDirected: (directed: boolean) => void;
    setWeighted: (weighted: boolean) => void;
}

export const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(graphReducer, initialState);

    const addNode = useCallback((x: number, y: number) => {
        dispatch({ type: "ADD_NODE", payload: { x, y } });
    }, []);

    const deleteNode = useCallback((id: string) => {
        dispatch({ type: "DELETE_NODE", payload: { id } });
    }, []);

    const addEdge = useCallback((source: string, target: string) => {
        dispatch({ type: "ADD_EDGE", payload: { source, target } });
    }, []);

    const deleteEdge = useCallback((id: string) => {
        dispatch({ type: "DELETE_EDGE", payload: { id } });
    }, []);

    const selectNode = useCallback((id: string, multi?: boolean) => {
        dispatch({ type: "SELECT_NODE", payload: { id, multi } });
    }, []);

    const selectEdge = useCallback((id: string, multi?: boolean) => {
        dispatch({ type: "SELECT_EDGE", payload: { id, multi } });
    }, []);

    const clearSelection = useCallback(() => {
        dispatch({ type: "CLEAR_SELECTION" });
    }, []);

    const setTool = useCallback((tool: Tool) => {
        dispatch({ type: "SET_TOOL", payload: { tool } });
    }, []);

    const setEdgeSource = useCallback((id: string | null) => {
        dispatch({ type: "SET_EDGE_SOURCE", payload: { id } });
    }, []);

    const moveNode = useCallback((id: string, x: number, y: number) => {
        dispatch({ type: "MOVE_NODE", payload: { id, x, y } });
    }, []);

    const updateNode = useCallback(
        (id: string, updates: Partial<Omit<GraphNode, "id">>) => {
            dispatch({ type: "UPDATE_NODE", payload: { id, updates } });
        },
        [],
    );

    const updateEdge = useCallback(
        (id: string, updates: Partial<Omit<GraphEdge, "id">>) => {
            dispatch({ type: "UPDATE_EDGE", payload: { id, updates } });
        },
        [],
    );

    const clearGraph = useCallback(() => {
        dispatch({ type: "CLEAR_GRAPH" });
    }, []);

    const setDirected = useCallback((directed: boolean) => {
        dispatch({ type: "SET_DIRECTED", payload: { directed } });
    }, []);

    const setWeighted = useCallback((weighted: boolean) => {
        dispatch({ type: "SET_WEIGHTED", payload: { weighted } });
    }, []);

    return (
        <GraphContext
            value={{
                state,
                addNode,
                deleteNode,
                addEdge,
                deleteEdge,
                selectNode,
                selectEdge,
                clearSelection,
                setTool,
                setEdgeSource,
                moveNode,
                updateNode,
                updateEdge,
                clearGraph,
                setDirected,
                setWeighted,
            }}
        >
            {children}
        </GraphContext>
    );
}
