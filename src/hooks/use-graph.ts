import { useContext } from "react";
import { GraphContext } from "@/contexts/graph-context";

export function useGraph() {
    const context = useContext(GraphContext);
    if (!context) throw new Error("useGraph must be used within GraphProvider");
    return context;
}
