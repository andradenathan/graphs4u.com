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
import { AlgorithmFloatingPanel } from "@/components/board/algorithm-floating-panel";
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
        algorithmResult,
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

    const screenToSvg = useCallback(
        (clientX: number, clientY: number) => {
            const svg = svgRef.current;
            if (!svg) return { x: 0, y: 0 };
            const svgRect = svg.getBoundingClientRect();
            const x =
                viewBox.x +
                ((clientX - svgRect.left) / svgRect.width) * viewBox.w;
            const y =
                viewBox.y +
                ((clientY - svgRect.top) / svgRect.height) * viewBox.h;
            return { x, y };
        },
        [viewBox],
    );

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                return;

            switch (event.key.toLowerCase()) {
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
                    selectedNodeIds.forEach((nodeId) => deleteNode(nodeId));
                    selectedEdgeIds.forEach((edgeId) => deleteEdge(edgeId));
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

    const handleWheel = useCallback(
        (wheelEvent: React.WheelEvent) => {
            wheelEvent.preventDefault();
            const factor = wheelEvent.deltaY > 0 ? 1.08 : 0.92;
            const svgPoint = screenToSvg(
                wheelEvent.clientX,
                wheelEvent.clientY,
            );

            setViewBox((currentViewBox) => {
                const newWidth = currentViewBox.w * factor;
                const newHeight = currentViewBox.h * factor;

                if (newWidth < 200 || newWidth > 8000) return currentViewBox;
                const newX =
                    svgPoint.x - (svgPoint.x - currentViewBox.x) * factor;
                const newY =
                    svgPoint.y - (svgPoint.y - currentViewBox.y) * factor;
                return { x: newX, y: newY, w: newWidth, h: newHeight };
            });
        },
        [screenToSvg],
    );

    const handleBackgroundMouseDown = useCallback(
        (mouseEvent: MouseEvent<SVGSVGElement>) => {
            if (
                mouseEvent.target !== svgRef.current &&
                (mouseEvent.target as SVGElement).tagName !== "rect"
            )
                return;

            const svgPoint = screenToSvg(
                mouseEvent.clientX,
                mouseEvent.clientY,
            );

            if (activeTool === "add-node") {
                addNode(svgPoint.x, svgPoint.y);
                return;
            }

            if (activeTool === "select" || activeTool === "delete") {
                clearSelection();
            }

            if (
                mouseEvent.button === 1 ||
                (mouseEvent.button === 0 && activeTool === "select")
            ) {
                setIsPanning(true);
                setPanStart({
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY,
                    vbX: viewBox.x,
                    vbY: viewBox.y,
                });
            }
        },
        [activeTool, addNode, clearSelection, screenToSvg, viewBox],
    );

    const handleMouseMove = useCallback(
        (mouseEvent: MouseEvent<SVGSVGElement>) => {
            const svgPoint = screenToSvg(
                mouseEvent.clientX,
                mouseEvent.clientY,
            );

            if (activeTool === "add-edge" && edgeSourceId) {
                setMousePos(svgPoint);
            }

            if (isPanning) {
                const svg = svgRef.current;
                if (!svg) return;
                const svgRect = svg.getBoundingClientRect();
                const panDeltaX =
                    ((mouseEvent.clientX - panStart.x) / svgRect.width) *
                    viewBox.w;
                const panDeltaY =
                    ((mouseEvent.clientY - panStart.y) / svgRect.height) *
                    viewBox.h;
                setViewBox((currentViewBox) => ({
                    ...currentViewBox,
                    x: panStart.vbX - panDeltaX,
                    y: panStart.vbY - panDeltaY,
                }));
            }

            if (draggingNode) {
                moveNode(draggingNode, svgPoint.x, svgPoint.y);
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

    const handleNodeMouseDown = useCallback(
        (mouseEvent: MouseEvent, nodeId: string) => {
            mouseEvent.stopPropagation();

            switch (activeTool) {
                case "select":
                    selectNode(nodeId, mouseEvent.shiftKey);
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

    const handleEdgeMouseDown = useCallback(
        (mouseEvent: MouseEvent, edgeId: string) => {
            mouseEvent.stopPropagation();

            switch (activeTool) {
                case "select":
                    selectEdge(edgeId, mouseEvent.shiftKey);
                    break;
                case "delete":
                    deleteEdge(edgeId);
                    break;
            }
        },
        [activeTool, selectEdge, deleteEdge],
    );

    const getEdgePath = useCallback(
        (sourceId: string, targetId: string) => {
            const sourceNode = graph.nodes.find((node) => node.id === sourceId);
            const targetNode = graph.nodes.find((node) => node.id === targetId);
            if (!sourceNode || !targetNode) return "";

            const deltaX = targetNode.x - sourceNode.x;
            const deltaY = targetNode.y - sourceNode.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance === 0) return "";

            const unitX = deltaX / distance;
            const unitY = deltaY / distance;

            const startX = sourceNode.x + unitX * NODE_RADIUS;
            const startY = sourceNode.y + unitY * NODE_RADIUS;
            const endX = targetNode.x - unitX * NODE_RADIUS;
            const endY = targetNode.y - unitY * NODE_RADIUS;

            return `M ${startX} ${startY} L ${endX} ${endY}`;
        },
        [graph.nodes],
    );

    const previewLine =
        edgeSourceId && mousePos
            ? (() => {
                  const sourceNode = graph.nodes.find(
                      (node) => node.id === edgeSourceId,
                  );
                  if (!sourceNode) return null;
                  return {
                      x1: sourceNode.x,
                      y1: sourceNode.y,
                      x2: mousePos.x,
                      y2: mousePos.y,
                  };
              })()
            : null;

    const gridSize = 40;

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
            <AlgorithmFloatingPanel />

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

                    <marker
                        id="arrowhead-algo"
                        markerWidth={ARROWHEAD_SIZE}
                        markerHeight={ARROWHEAD_SIZE}
                        refX={ARROWHEAD_SIZE - 2}
                        refY={ARROWHEAD_SIZE / 2}
                        orient="auto"
                    >
                        <polygon
                            points={`0 0, ${ARROWHEAD_SIZE} ${ARROWHEAD_SIZE / 2}, 0 ${ARROWHEAD_SIZE}`}
                            fill="var(--color-algo-result)"
                        />
                    </marker>
                </defs>

                <rect
                    x={viewBox.x - viewBox.w}
                    y={viewBox.y - viewBox.h}
                    width={viewBox.w * 3}
                    height={viewBox.h * 3}
                    fill="url(#grid)"
                />

                {graph.edges.map((edge) => {
                    const isSelected = selectedEdgeIds.includes(edge.id);
                    const isAlgoResult =
                        algorithmResult?.resultEdgeIds.includes(edge.id) ??
                        false;
                    const isAlgoDimmed = algorithmResult && !isAlgoResult;
                    const path = getEdgePath(edge.source, edge.target);
                    if (!path) return null;

                    const sourceNode = graph.nodes.find(
                        (node) => node.id === edge.source,
                    );
                    const targetNode = graph.nodes.find(
                        (node) => node.id === edge.target,
                    );
                    if (!sourceNode || !targetNode) return null;

                    const midX = (sourceNode.x + targetNode.x) / 2;
                    const midY = (sourceNode.y + targetNode.y) / 2;

                    const edgeColor = isSelected
                        ? "var(--color-edge-selected)"
                        : isAlgoResult
                          ? "var(--color-algo-result)"
                          : isAlgoDimmed
                            ? "var(--color-algo-result-dim)"
                            : "var(--color-edge)";

                    return (
                        <g key={edge.id}>
                            <path
                                d={path}
                                stroke="transparent"
                                strokeWidth="12"
                                fill="none"
                                className="cursor-pointer"
                                onMouseDown={(event) =>
                                    handleEdgeMouseDown(
                                        event as unknown as MouseEvent,
                                        edge.id,
                                    )
                                }
                            />

                            <path
                                d={path}
                                stroke={edgeColor}
                                strokeWidth={
                                    isSelected ? 2.5 : isAlgoResult ? 2.5 : 1.5
                                }
                                fill="none"
                                markerEnd={
                                    graph.directed
                                        ? isSelected
                                            ? "url(#arrowhead-selected)"
                                            : isAlgoResult
                                              ? "url(#arrowhead-algo)"
                                              : "url(#arrowhead)"
                                        : undefined
                                }
                                className="pointer-events-none transition-colors"
                            />

                            {graph.weighted && (
                                <text
                                    x={midX}
                                    y={midY - 8}
                                    textAnchor="middle"
                                    className="pointer-events-none select-none text-[11px] tabular-nums"
                                    fill={edgeColor}
                                >
                                    {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}

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

                {graph.nodes.map((node) => {
                    const isSelected = selectedNodeIds.includes(node.id);
                    const isEdgeSource = edgeSourceId === node.id;
                    const isAlgoResult =
                        algorithmResult?.resultNodeIds.includes(node.id) ??
                        false;
                    const isAlgoDimmed = algorithmResult && !isAlgoResult;

                    const nodeFill =
                        isSelected || isEdgeSource
                            ? "var(--color-node)"
                            : isAlgoResult
                              ? "var(--color-algo-result)"
                              : isAlgoDimmed
                                ? "var(--color-surface-raised)"
                                : "var(--color-surface-raised)";

                    const nodeStroke =
                        isSelected || isEdgeSource
                            ? "var(--color-node)"
                            : isAlgoResult
                              ? "var(--color-algo-result)"
                              : isAlgoDimmed
                                ? "var(--color-algo-result-dim)"
                                : "var(--color-border-hover)";

                    const nodeOpacity = isAlgoDimmed ? 0.4 : 1;

                    return (
                        <g
                            key={node.id}
                            onMouseDown={(event) =>
                                handleNodeMouseDown(
                                    event as unknown as MouseEvent,
                                    node.id,
                                )
                            }
                            className="cursor-pointer"
                            opacity={nodeOpacity}
                        >
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS + 4}
                                fill="none"
                                stroke={
                                    isSelected || isEdgeSource
                                        ? "var(--color-node-selected)"
                                        : isAlgoResult
                                          ? "var(--color-algo-result)"
                                          : "transparent"
                                }
                                strokeWidth="2"
                                opacity={0.5}
                                className="transition-all"
                            />

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS}
                                fill={nodeFill}
                                stroke={nodeStroke}
                                strokeWidth="2"
                                className="transition-colors"
                            />

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={NODE_RADIUS}
                                fill="transparent"
                                className="hover:fill-[var(--color-node-hover)] hover:opacity-20"
                            />

                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={
                                    isSelected || isEdgeSource
                                        ? "var(--color-primary-foreground)"
                                        : isAlgoResult
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
