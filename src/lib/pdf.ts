import { jsPDF } from "jspdf";
import type { Graph, AlgorithmResult } from "@/types/graph";

const NODE_RADIUS = 22;
const PADDING = 60;

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5b7ef6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="4.5" r="2.5"/>
  <path d="m10.2 6.3-3.9 3.9"/>
  <circle cx="4.5" cy="12" r="2.5"/>
  <path d="M7 12h10"/>
  <circle cx="19.5" cy="12" r="2.5"/>
  <path d="m13.8 17.7 3.9-3.9"/>
  <circle cx="12" cy="19.5" r="2.5"/>
</svg>`;

const ALGORITHM_DISPLAY_NAMES: Record<string, string> = {
    bfs: "BFS (Breadth-First Search)",
    dfs: "DFS (Depth-First Search)",
    dijkstra: "Dijkstra's Algorithm",
    "bellman-ford": "Bellman-Ford Algorithm",
    kruskal: "Kruskal's Algorithm (MST)",
    prim: "Prim's Algorithm (MST)",
    "topological-sort": "Topological Sort",
};

function buildGraphSvg(
    graph: Graph,
    algorithmResult: AlgorithmResult | null,
): {
    svg: string;
    width: number;
    height: number;
} {
    const { nodes, edges, directed, weighted } = graph;

    let boundsMinX = Infinity,
        boundsMinY = Infinity,
        boundsMaxX = -Infinity,
        boundsMaxY = -Infinity;
    for (const node of nodes) {
        if (node.x - NODE_RADIUS < boundsMinX)
            boundsMinX = node.x - NODE_RADIUS;
        if (node.y - NODE_RADIUS < boundsMinY)
            boundsMinY = node.y - NODE_RADIUS;
        if (node.x + NODE_RADIUS > boundsMaxX)
            boundsMaxX = node.x + NODE_RADIUS;
        if (node.y + NODE_RADIUS > boundsMaxY)
            boundsMaxY = node.y + NODE_RADIUS;
    }

    const width = boundsMaxX - boundsMinX + PADDING * 2;
    const height = boundsMaxY - boundsMinY + PADDING * 2;
    const canvasOffsetX = -boundsMinX + PADDING;
    const canvasOffsetY = -boundsMinY + PADDING;

    let svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svgMarkup += `<rect width="${width}" height="${height}" fill="#16161a" rx="12"/>`;

    if (directed) {
        svgMarkup += `<defs>
            <marker id="arrowhead-result" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#5b7ef6"/>
            </marker>
            <marker id="arrowhead-dim" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#2a2a45"/>
            </marker>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#5b7ef6"/>
            </marker>
        </defs>`;
    }

    for (const edge of edges) {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!sourceNode || !targetNode) continue;

        const edgeDeltaX = targetNode.x - sourceNode.x;
        const edgeDeltaY = targetNode.y - sourceNode.y;
        const edgeLength = Math.sqrt(
            edgeDeltaX * edgeDeltaX + edgeDeltaY * edgeDeltaY,
        );
        if (edgeLength === 0) continue;

        const directionUnitX = edgeDeltaX / edgeLength;
        const directionUnitY = edgeDeltaY / edgeLength;
        const edgeLineStartX =
            sourceNode.x + directionUnitX * NODE_RADIUS + canvasOffsetX;
        const edgeLineStartY =
            sourceNode.y + directionUnitY * NODE_RADIUS + canvasOffsetY;
        const edgeLineEndX =
            targetNode.x - directionUnitX * NODE_RADIUS + canvasOffsetX;
        const edgeLineEndY =
            targetNode.y - directionUnitY * NODE_RADIUS + canvasOffsetY;

        const isResultEdge =
            algorithmResult?.resultEdgeIds.includes(edge.id) ?? false;
        const isDimmedEdge = algorithmResult !== null && !isResultEdge;
        const edgeStroke = isResultEdge
            ? "#5b7ef6"
            : isDimmedEdge
              ? "#4a4a65"
              : "#3a3a50";
        const edgeStrokeWidth = isResultEdge ? 3 : 1.5;
        const edgeOpacity = isDimmedEdge ? 0.6 : 1;
        const arrowheadId = isResultEdge
            ? "arrowhead-result"
            : isDimmedEdge
              ? "arrowhead-dim"
              : "arrowhead";

        svgMarkup += `<line x1="${edgeLineStartX}" y1="${edgeLineStartY}" x2="${edgeLineEndX}" y2="${edgeLineEndY}" stroke="${edgeStroke}" stroke-width="${edgeStrokeWidth}" opacity="${edgeOpacity}"`;
        if (directed) svgMarkup += ` marker-end="url(#${arrowheadId})"`;
        svgMarkup += `/>`;

        if (weighted) {
            const weightLabelOffsetX = -directionUnitY * 12;
            const weightLabelOffsetY = directionUnitX * 12;
            const weightLabelPositionX =
                (sourceNode.x + targetNode.x) / 2 +
                canvasOffsetX +
                weightLabelOffsetX;
            const weightLabelPositionY =
                (sourceNode.y + targetNode.y) / 2 +
                canvasOffsetY +
                weightLabelOffsetY;
            const weightColor = isDimmedEdge ? "#6a6a88" : "#c0c0e0";
            svgMarkup += `<text x="${weightLabelPositionX}" y="${weightLabelPositionY}" text-anchor="middle" dominant-baseline="central" fill="${weightColor}" font-size="13" font-weight="600" font-family="Inter, system-ui, sans-serif" opacity="${edgeOpacity}">${edge.weight}</text>`;
        }
    }

    for (const node of nodes) {
        const nodeCenterX = node.x + canvasOffsetX;
        const nodeCenterY = node.y + canvasOffsetY;

        const isResultNode =
            algorithmResult?.resultNodeIds.includes(node.id) ?? false;
        const isDimmedNode = algorithmResult !== null && !isResultNode;
        const nodeFill = isResultNode ? "#1e2d6e" : "#23233a";
        const nodeStroke = isResultNode
            ? "#5b7ef6"
            : isDimmedNode
              ? "#4a4a68"
              : "#5b7ef6";
        const nodeStrokeWidth = isResultNode ? 3 : 2;
        const nodeTextColor = isDimmedNode ? "#7a7a9a" : "#e8e8f0";
        const nodeOpacity = isDimmedNode ? 0.7 : 1;

        svgMarkup += `<circle cx="${nodeCenterX}" cy="${nodeCenterY}" r="${NODE_RADIUS}" fill="${nodeFill}" stroke="${nodeStroke}" stroke-width="${nodeStrokeWidth}" opacity="${nodeOpacity}"/>`;
        svgMarkup += `<text x="${nodeCenterX}" y="${nodeCenterY}" text-anchor="middle" dominant-baseline="central" fill="${nodeTextColor}" font-size="12" font-weight="700" font-family="Inter, system-ui, sans-serif" opacity="${nodeOpacity}">${node.label}</text>`;
    }

    svgMarkup += `</svg>`;
    return { svg: svgMarkup, width, height };
}

function svgToDataUrl(svgString: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });
        const objectUrl = URL.createObjectURL(svgBlob);
        const imageElement = new Image();

        imageElement.onload = () => {
            const renderCanvas = document.createElement("canvas");

            const renderScale = 2;
            renderCanvas.width = imageElement.width * renderScale;
            renderCanvas.height = imageElement.height * renderScale;
            const canvasContext = renderCanvas.getContext("2d")!;
            canvasContext.scale(renderScale, renderScale);
            canvasContext.drawImage(imageElement, 0, 0);
            URL.revokeObjectURL(objectUrl);
            resolve(renderCanvas.toDataURL("image/png"));
        };

        imageElement.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load SVG image"));
        };

        imageElement.src = objectUrl;
    });
}

function sanitizeForPdf(text: string): string {
    return text.replace(/→/g, "->").replace(/∞/g, "inf").replace(/[^\x00-\x7F]/g, "?");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        if (currentLine.length === 0) {
            currentLine = word;
        } else if (currentLine.length + 1 + word.length <= maxCharsPerLine) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines;
}

export async function exportGraphAsPdf(
    graph: Graph,
    algorithmResult: AlgorithmResult | null = null,
): Promise<void> {
    if (graph.nodes.length === 0) return;

    const {
        svg: graphSvgMarkup,
        width: graphSvgWidth,
        height: graphSvgHeight,
    } = buildGraphSvg(graph, algorithmResult);
    const [graphDataUrl, logoDataUrl] = await Promise.all([
        svgToDataUrl(graphSvgMarkup),
        svgToDataUrl(LOGO_SVG),
    ]);

    const pageWidth = 841;
    const pageHeight = 595;
    const margin = 36;
    const headerHeight = 52;
    const footerHeight = 24;

    const pdfDocument = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
    });

    pdfDocument.setFillColor(22, 22, 26);
    pdfDocument.rect(0, 0, pageWidth, pageHeight, "F");

    pdfDocument.setFillColor(30, 30, 40);
    pdfDocument.rect(0, 0, pageWidth, headerHeight, "F");

    pdfDocument.setDrawColor(58, 58, 80);
    pdfDocument.setLineWidth(0.5);
    pdfDocument.line(0, headerHeight, pageWidth, headerHeight);

    const logoImageSize = 28;
    pdfDocument.addImage(
        logoDataUrl,
        "PNG",
        margin,
        (headerHeight - logoImageSize) / 2,
        logoImageSize,
        logoImageSize,
    );

    pdfDocument.setFont("helvetica", "bold");
    pdfDocument.setFontSize(15);
    pdfDocument.setTextColor(232, 232, 240);
    pdfDocument.text(
        "graphs4u",
        margin + logoImageSize + 10,
        headerHeight / 2 + 5,
    );

    const appTitleWidth = pdfDocument.getTextWidth("graphs4u");
    const headerSeparatorX = margin + logoImageSize + 10 + appTitleWidth + 14;
    pdfDocument.setDrawColor(58, 58, 80);
    pdfDocument.setLineWidth(0.5);
    pdfDocument.line(
        headerSeparatorX,
        headerHeight / 2 - 8,
        headerSeparatorX,
        headerHeight / 2 + 8,
    );

    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setFontSize(9);
    pdfDocument.setTextColor(120, 120, 160);
    const graphMetadataText = [
        `${graph.nodes.length} node${graph.nodes.length !== 1 ? "s" : ""}`,
        `${graph.edges.length} edge${graph.edges.length !== 1 ? "s" : ""}`,
        graph.directed ? "directed" : "undirected",
        graph.weighted ? "weighted" : "unweighted",
    ].join("  ·  ");
    pdfDocument.text(
        graphMetadataText,
        headerSeparatorX + 14,
        headerHeight / 2 + 4,
    );

    const contentAreaTop = headerHeight + margin;
    const contentAreaHeight =
        pageHeight - headerHeight - footerHeight - margin * 2;
    const totalAvailableWidth = pageWidth - margin * 2;

    if (algorithmResult) {
        const infoPanelWidth = 210;
        const infoPanelGap = 20;
        const graphAreaWidth =
            totalAvailableWidth - infoPanelWidth - infoPanelGap;
        const infoPanelX = margin + graphAreaWidth + infoPanelGap;

        pdfDocument.setFillColor(26, 26, 38);
        pdfDocument.setDrawColor(42, 42, 65);
        pdfDocument.setLineWidth(0.5);
        pdfDocument.roundedRect(
            infoPanelX,
            contentAreaTop,
            infoPanelWidth,
            contentAreaHeight,
            8,
            8,
            "FD",
        );

        const panelInnerX = infoPanelX + 16;
        let panelCursorY = contentAreaTop + 20;

        pdfDocument.setFont("helvetica", "normal");
        pdfDocument.setFontSize(7.5);
        pdfDocument.setTextColor(91, 126, 246);
        pdfDocument.text("ALGORITHM", panelInnerX, panelCursorY);
        panelCursorY += 13;

        const algorithmDisplayName =
            ALGORITHM_DISPLAY_NAMES[algorithmResult.algorithmId] ??
            algorithmResult.algorithmId;
        pdfDocument.setFont("helvetica", "bold");
        pdfDocument.setFontSize(11);
        pdfDocument.setTextColor(232, 232, 240);
        const algorithmNameLines = wrapText(algorithmDisplayName, 26);
        for (const line of algorithmNameLines) {
            pdfDocument.text(line, panelInnerX, panelCursorY);
            panelCursorY += 14;
        }

        panelCursorY += 6;

        pdfDocument.setDrawColor(42, 42, 65);
        pdfDocument.setLineWidth(0.5);
        pdfDocument.line(
            infoPanelX + 12,
            panelCursorY,
            infoPanelX + infoPanelWidth - 12,
            panelCursorY,
        );
        panelCursorY += 14;

        pdfDocument.setFont("helvetica", "normal");
        pdfDocument.setFontSize(7.5);
        pdfDocument.setTextColor(91, 126, 246);
        pdfDocument.text("RESULT", panelInnerX, panelCursorY);
        panelCursorY += 13;

        pdfDocument.setFont("helvetica", "normal");
        pdfDocument.setFontSize(8.5);
        pdfDocument.setTextColor(192, 192, 224);
        const descriptionLines = wrapText(sanitizeForPdf(algorithmResult.description), 30);
        for (const line of descriptionLines) {
            pdfDocument.text(line, panelInnerX, panelCursorY);
            panelCursorY += 12;
        }

        const distanceEntries = Object.entries(algorithmResult.distances);
        if (distanceEntries.length > 0) {
            panelCursorY += 6;

            pdfDocument.setDrawColor(42, 42, 65);
            pdfDocument.setLineWidth(0.5);
            pdfDocument.line(
                infoPanelX + 12,
                panelCursorY,
                infoPanelX + infoPanelWidth - 12,
                panelCursorY,
            );
            panelCursorY += 14;

            pdfDocument.setFont("helvetica", "normal");
            pdfDocument.setFontSize(7.5);
            pdfDocument.setTextColor(91, 126, 246);
            pdfDocument.text(
                "DISTANCES FROM SOURCE",
                panelInnerX,
                panelCursorY,
            );
            panelCursorY += 13;

            for (const [nodeId, distance] of distanceEntries) {
                if (panelCursorY > contentAreaTop + contentAreaHeight - 16)
                    break;

                const nodeLabel =
                    graph.nodes.find((node) => node.id === nodeId)?.label ??
                    nodeId;
                const distanceLabel =
                    distance === Infinity ? "inf" : String(distance);
                const isResult = algorithmResult.resultNodeIds.includes(nodeId);

                if (isResult) {
                    pdfDocument.setFillColor(30, 45, 110);
                    pdfDocument.rect(
                        infoPanelX + 10,
                        panelCursorY - 8,
                        infoPanelWidth - 20,
                        14,
                        "F",
                    );
                }

                pdfDocument.setFont("helvetica", isResult ? "bold" : "normal");
                pdfDocument.setFontSize(8.5);
                pdfDocument.setTextColor(
                    isResult ? 232 : 160,
                    isResult ? 232 : 160,
                    isResult ? 240 : 200,
                );
                pdfDocument.text(nodeLabel, panelInnerX, panelCursorY);
                pdfDocument.text(
                    distanceLabel,
                    infoPanelX + infoPanelWidth - 16,
                    panelCursorY,
                    { align: "right" },
                );
                panelCursorY += 14;
            }
        }

        const aspectRatio = graphSvgWidth / graphSvgHeight;
        let graphImageWidth = graphAreaWidth;
        let graphImageHeight = graphImageWidth / aspectRatio;
        if (graphImageHeight > contentAreaHeight) {
            graphImageHeight = contentAreaHeight;
            graphImageWidth = graphImageHeight * aspectRatio;
        }
        const graphImagePositionX =
            margin + (graphAreaWidth - graphImageWidth) / 2;
        const graphImagePositionY =
            contentAreaTop + (contentAreaHeight - graphImageHeight) / 2;
        pdfDocument.addImage(
            graphDataUrl,
            "PNG",
            graphImagePositionX,
            graphImagePositionY,
            graphImageWidth,
            graphImageHeight,
        );
    } else {
        const aspectRatio = graphSvgWidth / graphSvgHeight;
        let graphImageWidth = totalAvailableWidth;
        let graphImageHeight = graphImageWidth / aspectRatio;
        if (graphImageHeight > contentAreaHeight) {
            graphImageHeight = contentAreaHeight;
            graphImageWidth = graphImageHeight * aspectRatio;
        }
        const graphImagePositionX = (pageWidth - graphImageWidth) / 2;
        const graphImagePositionY =
            contentAreaTop + (contentAreaHeight - graphImageHeight) / 2;
        pdfDocument.addImage(
            graphDataUrl,
            "PNG",
            graphImagePositionX,
            graphImagePositionY,
            graphImageWidth,
            graphImageHeight,
        );
    }

    pdfDocument.setFontSize(8);
    pdfDocument.setTextColor(60, 60, 90);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.text("graphs4u.com", margin, pageHeight - 10);
    const formattedExportDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    pdfDocument.text(formattedExportDate, pageWidth - margin, pageHeight - 10, {
        align: "right",
    });

    pdfDocument.save("graph.pdf");
}
