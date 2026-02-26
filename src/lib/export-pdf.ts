import type { Graph } from "@/types/graph";

const NODE_RADIUS = 20;
const PADDING = 60;

export function exportGraphAsPdf(graph: Graph) {
    const { nodes, edges, directed, weighted } = graph;

    if (nodes.length === 0) return;

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
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
        svg += `<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">`;
        svg += `<polygon points="0 0, 10 5, 0 10" fill="#666"/>`;
        svg += `</marker></defs>`;
    }

    for (const edge of edges) {
        const src = nodes.find((n) => n.id === edge.source);
        const tgt = nodes.find((n) => n.id === edge.target);
        if (!src || !tgt) continue;

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) continue;

        const ux = dx / dist;
        const uy = dy / dist;
        const sx = src.x + ux * NODE_RADIUS + offsetX;
        const sy = src.y + uy * NODE_RADIUS + offsetY;
        const tx = tgt.x - ux * NODE_RADIUS + offsetX;
        const ty = tgt.y - uy * NODE_RADIUS + offsetY;

        svg += `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="#666" stroke-width="1.5"`;
        if (directed) svg += ` marker-end="url(#ah)"`;
        svg += `/>`;

        if (weighted) {
            const mx = (src.x + tgt.x) / 2 + offsetX;
            const my = (src.y + tgt.y) / 2 + offsetY - 8;
            svg += `<text x="${mx}" y="${my}" text-anchor="middle" fill="#999" font-size="11" font-family="Inter, sans-serif">${edge.weight}</text>`;
        }
    }

    for (const node of nodes) {
        const cx = node.x + offsetX;
        const cy = node.y + offsetY;
        svg += `<circle cx="${cx}" cy="${cy}" r="${NODE_RADIUS}" fill="#2a2a32" stroke="#555" stroke-width="2"/>`;
        svg += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" fill="#eee" font-size="12" font-weight="600" font-family="Inter, sans-serif">${node.label}</text>`;
    }

    svg += `</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "graph.svg";
        a.click();
        URL.revokeObjectURL(url);
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
			<img src="${url}" alt="Graph export" />
			<script>
				window.onafterprint = function() { window.close(); };
				setTimeout(function() { window.print(); }, 300);
			<\/script>
		</body>
		</html>
	`);
    printWindow.document.close();
}
