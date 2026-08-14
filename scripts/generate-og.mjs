import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(currentDirectory, "../public/og");

const OPEN_GRAPH_WIDTH = 1200;
const OPEN_GRAPH_HEIGHT = 630;

const colors = {
	surface: "#18181b",
	surfaceRaised: "#232327",
	border: "#2e2e33",
	primary: "#5b7ef6",
	foreground: "#e6e6ea",
	mutedForeground: "#8a8a95",
	accent: "#4ade80",
};

function escapeXml(value) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function buildDecorativeGraph() {
	const nodes = [
		{ x: 1010, y: 96, r: 13 },
		{ x: 1112, y: 168, r: 13 },
		{ x: 1073, y: 286, r: 13 },
		{ x: 947, y: 286, r: 13 },
		{ x: 908, y: 168, r: 13 },
		{ x: 1010, y: 196, r: 16 },
	];
	const edges = [
		[0, 5],
		[1, 5],
		[2, 5],
		[3, 5],
		[4, 5],
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[4, 0],
	];
	const highlighted = new Set([0, 5, 2]);

	const edgeMarkup = edges
		.map(([from, to]) => {
			const isHighlighted = highlighted.has(from) && highlighted.has(to);
			return `<line x1="${nodes[from].x}" y1="${nodes[from].y}" x2="${nodes[to].x}" y2="${nodes[to].y}" stroke="${
				isHighlighted ? colors.accent : colors.border
			}" stroke-width="${isHighlighted ? 4 : 2.5}" />`;
		})
		.join("");

	const nodeMarkup = nodes
		.map((node, index) => {
			const isHighlighted = highlighted.has(index);
			return `<circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${colors.surface}" stroke="${
				isHighlighted ? colors.accent : colors.primary
			}" stroke-width="4" />`;
		})
		.join("");

	return `<g opacity="0.9">${edgeMarkup}${nodeMarkup}</g>`;
}

function buildOpenGraphSvg({ title, subtitle, eyebrow, footnote }) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${OPEN_GRAPH_WIDTH}" height="${OPEN_GRAPH_HEIGHT}" viewBox="0 0 ${OPEN_GRAPH_WIDTH} ${OPEN_GRAPH_HEIGHT}">
	<defs>
		<linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="${colors.surface}" />
			<stop offset="100%" stop-color="${colors.surfaceRaised}" />
		</linearGradient>
		<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
			<path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.border}" stroke-width="1" opacity="0.45" />
		</pattern>
	</defs>

	<rect width="${OPEN_GRAPH_WIDTH}" height="${OPEN_GRAPH_HEIGHT}" fill="url(#background)" />
	<rect width="${OPEN_GRAPH_WIDTH}" height="${OPEN_GRAPH_HEIGHT}" fill="url(#grid)" />
	<rect x="0" y="0" width="${OPEN_GRAPH_WIDTH}" height="6" fill="${colors.primary}" />

	${buildDecorativeGraph()}

	<g transform="translate(80, 96)">
		<g transform="translate(0, 0) scale(1.6)" fill="none" stroke="${colors.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="4.5" r="2.5" />
			<path d="m10.2 6.3-3.9 3.9" />
			<circle cx="4.5" cy="12" r="2.5" />
			<path d="M7 12h10" />
			<circle cx="19.5" cy="12" r="2.5" />
			<path d="m13.8 17.7 3.9-3.9" />
			<circle cx="12" cy="19.5" r="2.5" />
		</g>
		<text x="52" y="34" font-family="sans-serif" font-size="30" font-weight="700" fill="${colors.foreground}">graphs4u</text>
	</g>

	<text x="80" y="228" font-family="sans-serif" font-size="22" font-weight="600" letter-spacing="3" fill="${colors.primary}">${escapeXml(
		eyebrow.toUpperCase(),
	)}</text>

	${title
		.map(
			(line, index) =>
				`<text x="80" y="${310 + index * 74}" font-family="sans-serif" font-size="62" font-weight="700" fill="${
					colors.foreground
				}">${escapeXml(line)}</text>`,
		)
		.join("\n\t")}

	<text x="80" y="${310 + title.length * 74 + 4}" font-family="sans-serif" font-size="27" font-weight="400" fill="${
		colors.mutedForeground
	}">${escapeXml(subtitle)}</text>

	<g transform="translate(80, 508)">
		<rect x="0" y="0" width="640" height="1" fill="${colors.border}" />
		<text x="0" y="48" font-family="sans-serif" font-size="25" font-weight="500" fill="${colors.mutedForeground}">graphs4u.com · ${escapeXml(footnote)}</text>
	</g>
</svg>`;
}

const openGraphImages = [
	{
		fileName: "default.png",
		eyebrow: "Graph algorithm visualizer",
		title: ["Build graphs.", "Run algorithms."],
		subtitle: "BFS · DFS · Dijkstra · Bellman-Ford · Kruskal · Prim · topological sort",
		footnote: "Free & open source · No sign-up",
	},
	{
		fileName: "default-pt.png",
		eyebrow: "Visualizador de algoritmos em grafos",
		title: ["Monte grafos.", "Rode algoritmos."],
		subtitle: "BFS · DFS · Dijkstra · Bellman-Ford · Kruskal · Prim · ordenação topológica",
		footnote: "Grátis e open source · Sem cadastro",
	},
];

await mkdir(publicDirectory, { recursive: true });

for (const openGraphImage of openGraphImages) {
	const svgMarkup = buildOpenGraphSvg(openGraphImage);
	const pngBuffer = await sharp(Buffer.from(svgMarkup)).png().toBuffer();
	await writeFile(path.join(publicDirectory, openGraphImage.fileName), pngBuffer);
	console.log(`generated og/${openGraphImage.fileName}`);
}
