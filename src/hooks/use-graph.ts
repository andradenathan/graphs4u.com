import { useContext } from "react";
import { GraphContext } from "@/contexts/graph-context";

export function useGraph() {
    const ctx = useContext(GraphContext);
    if (!ctx) throw new Error("useGraph must be used within GraphProvider");
    return ctx;
}
