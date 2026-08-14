import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(currentDirectory, "../public");

const BACKGROUND_COLOR = "#18181b";
const STROKE_COLOR = "#5b7ef6";

function buildIconSvg({ size, paddingRatio, rounded }) {
	const glyphSize = size * (1 - paddingRatio * 2);
	const glyphOffset = size * paddingRatio;
	const cornerRadius = rounded ? size * 0.22 : 0;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
	<rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${BACKGROUND_COLOR}" />
	<g transform="translate(${glyphOffset}, ${glyphOffset}) scale(${glyphSize / 24})" fill="none" stroke="${STROKE_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="12" cy="4.5" r="2.5" />
		<path d="m10.2 6.3-3.9 3.9" />
		<circle cx="4.5" cy="12" r="2.5" />
		<path d="M7 12h10" />
		<circle cx="19.5" cy="12" r="2.5" />
		<path d="m13.8 17.7 3.9-3.9" />
		<circle cx="12" cy="19.5" r="2.5" />
	</g>
</svg>`;
}

const icons = [
	{ fileName: "apple-touch-icon.png", size: 180, paddingRatio: 0.16, rounded: false },
	{ fileName: "icon-192.png", size: 192, paddingRatio: 0.16, rounded: true },
	{ fileName: "icon-512.png", size: 512, paddingRatio: 0.16, rounded: true },
	{ fileName: "icon-maskable-512.png", size: 512, paddingRatio: 0.26, rounded: false },
];

for (const icon of icons) {
	const svgMarkup = buildIconSvg(icon);
	const pngBuffer = await sharp(Buffer.from(svgMarkup)).png().toBuffer();
	await writeFile(path.join(publicDirectory, icon.fileName), pngBuffer);
	console.log(`generated ${icon.fileName}`);
}
