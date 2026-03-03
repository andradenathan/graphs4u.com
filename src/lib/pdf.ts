import { jsPDF } from "jspdf";
import type { Graph } from "@/types/graph";

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

function buildGraphSvg(graph: Graph): {
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
        if (node.x - NODE_RADIUS < boundsMinX) boundsMinX = node.x - NODE_RADIUS;
        if (node.y - NODE_RADIUS < boundsMinY) boundsMinY = node.y - NODE_RADIUS;
        if (node.x + NODE_RADIUS > boundsMaxX) boundsMaxX = node.x + NODE_RADIUS;
        if (node.y + NODE_RADIUS > boundsMaxY) boundsMaxY = node.y + NODE_RADIUS;
    }

    const width = boundsMaxX - boundsMinX + PADDING * 2;
    const height = boundsMaxY - boundsMinY + PADDING * 2;
    const canvasOffsetX = -boundsMinX + PADDING;
    const canvasOffsetY = -boundsMinY + PADDING;

    let svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svgMarkup += `<rect width="${width}" height="${height}" fill="#16161a" rx="12"/>`;

    if (directed) {
        svgMarkup += `<defs>
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
        const edgeLength = Math.sqrt(edgeDeltaX * edgeDeltaX + edgeDeltaY * edgeDeltaY);
        if (edgeLength === 0) continue;

        const directionUnitX = edgeDeltaX / edgeLength;
        const directionUnitY = edgeDeltaY / edgeLength;
        const edgeLineStartX = sourceNode.x + directionUnitX * NODE_RADIUS + canvasOffsetX;
        const edgeLineStartY = sourceNode.y + directionUnitY * NODE_RADIUS + canvasOffsetY;
        const edgeLineEndX = targetNode.x - directionUnitX * NODE_RADIUS + canvasOffsetX;
        const edgeLineEndY = targetNode.y - directionUnitY * NODE_RADIUS + canvasOffsetY;

        svgMarkup += `<line x1="${edgeLineStartX}" y1="${edgeLineStartY}" x2="${edgeLineEndX}" y2="${edgeLineEndY}" stroke="#3a3a50" stroke-width="2"`;
        if (directed) svgMarkup += ` marker-end="url(#arrowhead)"`;
        svgMarkup += `/>`;

        if (weighted) {
            const weightLabelOffsetX = -directionUnitY * 12;
            const weightLabelOffsetY = directionUnitX * 12;
            const weightLabelPositionX = (sourceNode.x + targetNode.x) / 2 + canvasOffsetX + weightLabelOffsetX;
            const weightLabelPositionY = (sourceNode.y + targetNode.y) / 2 + canvasOffsetY + weightLabelOffsetY;
            svgMarkup += `<text x="${weightLabelPositionX}" y="${weightLabelPositionY}" text-anchor="middle" dominant-baseline="central" fill="#c0c0e0" font-size="13" font-weight="600" font-family="Inter, system-ui, sans-serif">${edge.weight}</text>`;
        }
    }

    for (const node of nodes) {
        const nodeCenterX = node.x + canvasOffsetX;
        const nodeCenterY = node.y + canvasOffsetY;
        svgMarkup += `<circle cx="${nodeCenterX}" cy="${nodeCenterY}" r="${NODE_RADIUS}" fill="#23233a" stroke="#5b7ef6" stroke-width="2"/>`;
        svgMarkup += `<text x="${nodeCenterX}" y="${nodeCenterY}" text-anchor="middle" dominant-baseline="central" fill="#e8e8f0" font-size="12" font-weight="700" font-family="Inter, system-ui, sans-serif">${node.label}</text>`;
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

export async function exportGraphAsPdf(graph: Graph): Promise<void> {
    if (graph.nodes.length === 0) return;

    const { svg: graphSvgMarkup, width: graphSvgWidth, height: graphSvgHeight } = buildGraphSvg(graph);
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
    pdfDocument.text("graphs4u", margin + logoImageSize + 10, headerHeight / 2 + 5);

    const appTitleWidth = pdfDocument.getTextWidth("graphs4u");
    const headerSeparatorX = margin + logoImageSize + 10 + appTitleWidth + 14;
    pdfDocument.setDrawColor(58, 58, 80);
    pdfDocument.setLineWidth(0.5);
    pdfDocument.line(headerSeparatorX, headerHeight / 2 - 8, headerSeparatorX, headerHeight / 2 + 8);

    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.setFontSize(9);
    pdfDocument.setTextColor(120, 120, 160);
    const graphMetadataText = [
        `${graph.nodes.length} node${graph.nodes.length !== 1 ? "s" : ""}`,
        `${graph.edges.length} edge${graph.edges.length !== 1 ? "s" : ""}`,
        graph.directed ? "directed" : "undirected",
        graph.weighted ? "weighted" : "unweighted",
    ].join("  ·  ");
    pdfDocument.text(graphMetadataText, headerSeparatorX + 14, headerHeight / 2 + 4);

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - headerHeight - footerHeight - margin * 2;
    const aspectRatio = graphSvgWidth / graphSvgHeight;
    let graphImageWidth = availableWidth;
    let graphImageHeight = graphImageWidth / aspectRatio;
    if (graphImageHeight > availableHeight) {
        graphImageHeight = availableHeight;
        graphImageWidth = graphImageHeight * aspectRatio;
    }
    const graphImagePositionX = (pageWidth - graphImageWidth) / 2;
    const graphImagePositionY = headerHeight + margin + (availableHeight - graphImageHeight) / 2;
    pdfDocument.addImage(graphDataUrl, "PNG", graphImagePositionX, graphImagePositionY, graphImageWidth, graphImageHeight);

    pdfDocument.setFontSize(8);
    pdfDocument.setTextColor(60, 60, 90);
    pdfDocument.setFont("helvetica", "normal");
    pdfDocument.text("graphs4u.com", margin, pageHeight - 10);
    const formattedExportDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    pdfDocument.text(formattedExportDate, pageWidth - margin, pageHeight - 10, { align: "right" });

    pdfDocument.save("graph.pdf");
}
