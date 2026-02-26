import {
    useRef,
    useState,
    useEffect,
    useCallback,
    type MouseEvent,
} from "react";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { BoardToolbar } from "@/components/board/board-toolbar";
import { twMerge } from "tailwind-merge";

const NODE_RADIUS = 20;
const ARROWHEAD_SIZE = 10;

interface ViewBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function GraphBoard() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        state,
        addNode,
        addEdge,
        deleteNode,
        deleteEdge,
        selectNode,
        selectEdge,
        clearSelection,
        setEdgeSource,
        moveNode,
        setTool,
    } = useGraph();
    const { t } = useI18n();

    const {
        graph,
        activeTool,
        selectedNodeIds,
        selectedEdgeIds,
        edgeSourceId,
    } = state;

    const [viewBox, setViewBox] = useState<ViewBox>({
        x: -500,
        y: -350,
        w: 1000,
        h: 700,
    });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0, vbX: 0, vbY: 0 });
    const [draggingNode, setDraggingNode] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
        null,
    );

    // Convert screen coords to SVG coords
    const screenToSvg = useCallback(
        (clientX: number, clientY: number) => {
            const svg = svgRef.current;
            if (!svg) return { x: 0, y: 0 };
            const rect = svg.getBoundingClientRect();
            const x =
                viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w;
            const y =
                viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h;
            return { x, y };
        },
        [viewBox],
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                return;

            switch (e.key.toLowerCase()) {
                case "v":
                    setTool("select");
                    break;
                case "n":
                    setTool("add-node");
                    break;
                case "e":
                    setTool("add-edge");
                    break;
                case "d":
                    setTool("delete");
                    break;
                case "delete":
                case "backspace":
                    selectedNodeIds.forEach((id) => deleteNode(id));
                    selectedEdgeIds.forEach((id) => deleteEdge(id));
                    break;
                case "escape":
                    clearSelection();
                    break;
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [
        selectedNodeIds,
        selectedEdgeIds,
        deleteNode,
        deleteEdge,
        clearSelection,
        setTool,
    ]);

    // Zoom with mouse wheel
    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 1.08 : 0.92;
            const svgPt = screenToSvg(e.clientX, e.clientY);

            setViewBox((vb) => {
                const newW = vb.w * factor;
                const newH = vb.h * factor;
                // Clamp zoom
                if (newW < 200 || newW > 8000) return vb;
                const newX = svgPt.x - (svgPt.x - vb.x) * factor;
                const newY = svgPt.y - (svgPt.y - vb.y) * factor;
                return { x: newX, y: newY, w: newW, h: newH };
            });
        },
        [screenToSvg],
    );

    // Mouse down on SVG background
    const handleBackgroundMouseDown = useCallback(
        (e: MouseEvent<SVGSVGElement>) => {
            if (
                e.target !== svgRef.current &&
                (e.target as SVGElement).tagName !== "rect"
            )
                return;

            const svgPt = screenToSvg(e.clientX, e.clientY);

            if (activeTool === "add-node") {
                addNode(svgPt.x, svgPt.y);
                return;
            }

            if (activeTool === "select" || activeTool === "delete") {
                clearSelection();
            }

            // Start panning with middle button or space
            if (e.button === 1 || (e.button === 0 && activeTool === "select")) {
                setIsPanning(true);
                setPanStart({
                    x: e.clientX,
                    y: e.clientY,
                    vbX: viewBox.x,
                    vbY: viewBox.y,
                });
            }
        },
        [activeTool, addNode, clearSelection, screenToSvg, viewBox],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent<SVGSVGElement>) => {
            const svgPt = screenToSvg(e.clientX, e.clientY);

            if (activeTool === "add-edge" && edgeSourceId) {
                setMousePos(svgPt);
            }

            if (isPanning) {
                const svg = svgRef.current;
                if (!svg) return;
                const rect = svg.getBoundingClientRect();
                const dx = ((e.clientX - panStart.x) / rect.width) * viewBox.w;
                const dy = ((e.clientY - panStart.y) / rect.height) * viewBox.h;
                setViewBox((vb) => ({
                    ...vb,
                    x: panStart.vbX - dx,
                    y: panStart.vbY - dy,
                }));
            }

            if (draggingNode) {
                moveNode(draggingNode, svgPt.x, svgPt.y);
            }
        },
        [
            isPanning,
            panStart,
            viewBox,
            screenToSvg,
            draggingNode,
            moveNode,
            activeTool,
            edgeSourceId,
        ],
    );

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggingNode(null);
    }, []);

    // Node interactions
    const handleNodeMouseDown = useCallback(
        (e: MouseEvent, nodeId: string) => {
            e.stopPropagation();

            switch (activeTool) {
                case "select":
                    selectNode(nodeId, e.shiftKey);
                    setDraggingNode(nodeId);
                    break;
                case "add-edge":
                    if (!edgeSourceId) {
                        setEdgeSource(nodeId);
                        selectNode(nodeId);
                    } else {
                        addEdge(edgeSourceId, nodeId);
                    }
                    break;
                case "delete":
                    deleteNode(nodeId);
                    break;
            }
        },
        [
            activeTool,
            edgeSourceId,
            selectNode,
            setEdgeSource,
            addEdge,
            deleteNode,
        ],
    );

    // Edge interactions
    const handleEdgeMouseDown = useCallback(
        (e: MouseEvent, edgeId: string) => {
            e.stopPropagation();

            switch (activeTool) {
                case "select":
                    selectEdge(edgeId, e.shiftKey);
                    break;
                case "delete":
                    deleteEdge(edgeId);
                    break;
            }
        },
        [activeTool, selectEdge, deleteEdge],
    );

    // Compute edge path with offset for directed graphs
    const getEdgePath = useCallback(
        (sourceId: string, targetId: string) => {
            const source = graph.nodes.find((n) => n.id === sourceId);
            const target = graph.nodes.find((n) => n.id === targetId);
            if (!source || !target) return "";

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return "";

            const ux = dx / dist;
            const uy = dy / dist;

            const sx = source.x + ux * NODE_RADIUS;
            const sy = source.y + uy * NODE_RADIUS;
            const tx = target.x - ux * NODE_RADIUS;
            const ty = target.y - uy * NODE_RADIUS;

            return `M ${sx} ${sy} L ${tx} ${ty}`;
        },
        [graph.nodes],
    );

    // Preview edge line (while creating edge)
    const previewLine =
        edgeSourceId && mousePos
            ? (() => {
                  const source = graph.nodes.find((n) => n.id === edgeSourceId);
                  if (!source) return null;
                  return {
                      x1: source.x,
                      y1: source.y,
                      x2: mousePos.x,
                      y2: mousePos.y,
                  };
              })()
            : null;

    // Grid pattern
    const gridSize = 40;

    // Cursor
    const cursorClass =
        activeTool === "add-node"
            ? "cursor-crosshair"
            : activeTool === "add-edge"
              ? "cursor-crosshair"
              : activeTool === "delete"
                ? "cursor-pointer"
                : isPanning
                  ? "cursor-grabbing"
                  : "cursor-default";

    return (
        <div
            ref={containerRef}
            className="relative flex-1 overflow-hidden bg-surface"
            data-slot="graph-board"
        >
            <BoardToolbar />

            {/* Status bar */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg border border-border bg-surface/90 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-sm">
                {activeTool === "add-edge" && edgeSourceId && (
                    <span className="text-primary">
                        {t("board.clickTarget")}
                    </span>
                )}
                {activeTool === "add-node" && (
                    <span>{t("board.clickPlace")}</span>
                )}
                {activeTool === "select" &&
                    !selectedNodeIds.length &&
                    !selectedEdgeIds.length && (
                        <span>{t("board.panZoom")}</span>
                    )}
                {activeTool === "select" &&
                    (selectedNodeIds.length > 0 ||
                        selectedEdgeIds.length > 0) && (
                        <span>
                            {selectedNodeIds.length > 0 &&
                                `${selectedNodeIds.length} ${selectedNodeIds.length === 1 ? t("header.node") : t("header.nodes")}`}
                            {selectedNodeIds.length > 0 &&
                                selectedEdgeIds.length > 0 &&
                                ", "}
                            {selectedEdgeIds.length > 0 &&
                                `${selectedEdgeIds.length} ${selectedEdgeIds.length === 1 ? t("header.edge") : t("header.edges")}`}
                            {` ${t("board.selected")}`}
                        </span>
                    )}
                {activeTool === "delete" && (
                    <span>{t("board.clickDelete")}</span>
                )}
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-3 right-3 z-10 rounded-lg border border-border bg-surface/90 px-2 py-1 text-[11px] tabular-nums text-muted-foreground backdrop-blur-sm">
                {Math.round((1000 / viewBox.w) * 100)}%
            </div>

            <svg
                ref={svgRef}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                className={twMerge("size-full", cursorClass)}
                onMouseDown={handleBackgroundMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* Grid pattern */}
                <defs>
                    <pattern
                        id="grid"
                        width={gridSize}
                        height={gridSize}
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx={gridSize / 2}
                            cy={gridSize / 2}
                            r="1"
                            fill="var(--color-grid)"
                        />
                    </pattern>

                    {/* Arrowhead marker */}
                    <marker
                        id="arrowhead"
                        markerWidth={ARROWHEAD_SIZE}
                        markerHeight={ARROWHEAD_SIZE}
                        refX={ARROWHEAD_SIZE - 2}
                        refY={ARROWHEAD_SIZE / 2}
                        orient="auto"
                    >
                        <polygon
                            points={`0 0, ${ARROWHEAD_SIZE} ${ARROWHEAD_SIZE / 2}, 0 ${ARROWHEAD_SIZE}`}
                            fill="var(--color-edge)"
                        />
                    </marker>

                    <marker
                        id="arrowhead-selected"
                        markerWidth={ARROWHEAD_SIZE}
                        markerHeight={ARROWHEAD_SIZE}
                        refX={ARROWHEAD_SIZE - 2}
                        refY={ARROWHEAD_SIZE / 2}
                        orient="auto"
                    >
                        <polygon
                            points={`0 0, ${ARROWHEAD_SIZE} ${ARROWHEAD_SIZE / 2}, 0 ${ARROWHEAD_SIZE}`}
                            fill="var(--color-edge-selected)"
                        />
                    </marker>
                </defs>

                {/* Grid background */}
                <rect
                    x={viewBox.x - viewBox.w}
                    y={viewBox.y - viewBox.h}
                    width={viewBox.w * 3}
                    height={viewBox.h * 3}
                    fill="url(#grid)"
                />

                {/* Edges */}
                {graph.edges.map((edge) => {
                    const isSelected = selectedEdgeIds.includes(edge.id);
                    const path = getEdgePath(edge.source, edge.target);
                    if (!path) return null;

                    const source = graph.nodes.find(
                        (n) => n.id === edge.source,
                    );
                    const target = graph.nodes.find(
                        (n) => n.id === edge.target,
                    );
                    if (!source || !target) return null;

                    const midX = (source.x + target.x) / 2;
                    const midY = (source.y + target.y) / 2;

                    return (
                        <g key={edge.id}>
                            {/* Hit area (wider invisible path for easier clicking) */}
                            <path
                                d={path}
                                stroke="transparent"
                                strokeWidth="12"
                                fill="none"
                                className="cursor-pointer"
                                onMouseDown={(e) =>
                                    handleEdgeMouseDown(
                                        e as unknown as MouseEvent,
                                        edge.id,
                                    )
                                }
                            />
                            {/* Visible edge */}
                            <path
                                d={path}
                                stroke={
                                    isSelected
                                        ? "var(--color-edge-selected)"
                                        : "var(--color-edge)"
                                }
                                strokeWidth={isSelected ? 2.5 : 1.5}
                                fill="none"
                                markerEnd={
                                    graph.directed
                                        ? isSelected
                                            ? "url(#arrowhead-selected)"
                                            : "url(#arrowhead)"
                                        : undefined
                                }
                                className="pointer-events-none transition-colors"
                            />
                            {/* Weight label */}
                            {graph.weighted && (
                                <text
                                    x={midX}
                                    y={midY - 8}
                                    textAnchor="middle"
                                    className="pointer-events-none select-none text-[11px] tabular-nums"
                                    fill={
                                        isSelected
                                            ? "var(--color-edge-selected)"
                                            : "var(--color-foreground-subtle)"
                                    }
                                >
                                    {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Preview edge line */}
                {previewLine && (
                    <line
                        x1={previewLine.x1}
                        y1={previewLine.y1}
                        x2={previewLine.x2}
                        y2={previewLine.y2}
                        stroke="var(--color-primary)"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        className="pointer-events-none"
                        opacity={0.6}
                    />
                )}

                {/* Nodes */}
                {graph.nodes.map((node) => {
                    const isSelected = selectedNodeIds.includes(node.id);
                    const isEdgeSource = edgeSourceId === node.id;

                    return (
                        <g
                            key={node.id}
                            onMouseDown={(e) =>
                                handleNodeMouseDown(
                                    e as unknown as MouseEvent,
                                    node.id,
                                )
                            }
                            className="cursor-pointer"
                        >
                            {/* Selection / hover ring */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS + 4}
                                fill="none"
                                stroke={
                                    isSelected || isEdgeSource
                                        ? "var(--color-node-selected)"
                                        : "transparent"
                                }
                                strokeWidth="2"
                                opacity={0.5}
                                className="transition-all"
                            />

                            {/* Node circle */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS}
                                fill={
                                    isSelected || isEdgeSource
                                        ? "var(--color-node)"
                                        : "var(--color-surface-raised)"
                                }
                                stroke={
                                    isSelected || isEdgeSource
                                        ? "var(--color-node)"
                                        : "var(--color-border-hover)"
                                }
                                strokeWidth="2"
                                className="transition-colors"
                            />

                            {/* Hover highlight */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS}
                                fill="transparent"
                                className="hover:fill-[var(--color-node-hover)] hover:opacity-20"
                            />

                            {/* Label */}
                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={
                                    isSelected || isEdgeSource
                                        ? "var(--color-primary-foreground)"
                                        : "var(--color-foreground)"
                                }
                                className="pointer-events-none select-none text-xs font-semibold"
                            >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
