import type { Graph } from "@/types/graph";

const NODE_RADIUS = 20;
const PADDING = 60;

export function exportGraphAsPdf(graph: Graph) {
    const { nodes, edges, directed, weighted } = graph;

    if (nodes.length === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
        if (node.x - NODE_RADIUS < minX) minX = node.x - NODE_RADIUS;
        if (node.y - NODE_RADIUS < minY) minY = node.y - NODE_RADIUS;
        if (node.x + NODE_RADIUS > maxX) maxX = node.x + NODE_RADIUS;
        if (node.y + NODE_RADIUS > maxY) maxY = node.y + NODE_RADIUS;
    }

    const width = maxX - minX + PADDING * 2;
    const height = maxY - minY + PADDING * 2;
    const offsetX = -minX + PADDING;
    const offsetY = -minY + PADDING;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="#1a1a1f"/>`;

    if (directed) {
        svg += `<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">`;
        svg += `<polygon points="0 0, 10 5, 0 10" fill="#666"/>`;
        svg += `</marker></defs>`;
    }

    for (const edge of edges) {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        if (!sourceNode || !targetNode) continue;

        const deltaX = targetNode.x - sourceNode.x;
        const deltaY = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance === 0) continue;

        const unitX = deltaX / distance;
        const unitY = deltaY / distance;
        const startX = sourceNode.x + unitX * NODE_RADIUS + offsetX;
        const startY = sourceNode.y + unitY * NODE_RADIUS + offsetY;
        const endX = targetNode.x - unitX * NODE_RADIUS + offsetX;
        const endY = targetNode.y - unitY * NODE_RADIUS + offsetY;

        svg += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#666" stroke-width="1.5"`;
        if (directed) svg += ` marker-end="url(#arrowhead)"`;
        svg += `/>`;

        if (weighted) {
            const midpointX = (sourceNode.x + targetNode.x) / 2 + offsetX;
            const midpointY = (sourceNode.y + targetNode.y) / 2 + offsetY - 8;
            svg += `<text x="${midpointX}" y="${midpointY}" text-anchor="middle" fill="#999" font-size="11" font-family="Inter, sans-serif">${edge.weight}</text>`;
        }
    }

    for (const node of nodes) {
        const centerX = node.x + offsetX;
        const centerY = node.y + offsetY;
        svg += `<circle cx="${centerX}" cy="${centerY}" r="${NODE_RADIUS}" fill="#2a2a32" stroke="#555" stroke-width="2"/>`;
        svg += `<text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="central" fill="#eee" font-size="12" font-weight="600" font-family="Inter, sans-serif">${node.label}</text>`;
    }

    svg += `</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = "graph.svg";
        downloadLink.click();
        URL.revokeObjectURL(blobUrl);
        return;
    }

    printWindow.document.write(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>graphs4u — Export</title>
			<style>
				* { margin: 0; padding: 0; }
				body { background: #1a1a1f; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
				img { max-width: 100%; height: auto; }
				@media print {
					body { background: white; }
				}
			</style>
		</head>
		<body>
			<img src="${blobUrl}" alt="Graph export" />
			<script>
				window.onafterprint = function() { window.close(); };
				setTimeout(function() { window.print(); }, 300);
			<\/script>
		</body>
		</html>
	`);
    printWindow.document.close();
}
