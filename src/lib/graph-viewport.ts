import type { GraphNode } from "@/types/graph";

export interface ViewBox {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** Room kept around the outermost nodes: node radius, selection halo and breathing space. */
const FIT_PADDING = 80;
/** Small graphs keep the default 100% zoom instead of being blown up to fill the board. */
const MINIMUM_FIT_WIDTH = 1000;
const MAXIMUM_FIT_WIDTH = 8000;

/**
 * Computes the viewBox that centers every node on the board.
 * The result has the same aspect ratio as the board, otherwise the SVG letterboxes
 * the content and pointer-to-canvas conversion drifts.
 * Returns null when there are no nodes, as there is nothing to fit.
 */
export function calculateFitViewBox(
	nodes: readonly Pick<GraphNode, "x" | "y">[],
	boardAspectRatio: number,
): ViewBox | null {
	if (nodes.length === 0 || !Number.isFinite(boardAspectRatio) || boardAspectRatio <= 0) return null;

	const nodeXs = nodes.map((node) => node.x);
	const nodeYs = nodes.map((node) => node.y);
	const minimumX = Math.min(...nodeXs);
	const maximumX = Math.max(...nodeXs);
	const minimumY = Math.min(...nodeYs);
	const maximumY = Math.max(...nodeYs);

	const contentWidth = maximumX - minimumX + FIT_PADDING * 2;
	const contentHeight = maximumY - minimumY + FIT_PADDING * 2;

	const widthNeededForContent = Math.max(contentWidth, contentHeight * boardAspectRatio);
	const fitWidth = Math.min(Math.max(widthNeededForContent, MINIMUM_FIT_WIDTH), MAXIMUM_FIT_WIDTH);
	const fitHeight = fitWidth / boardAspectRatio;

	const graphCenterX = (minimumX + maximumX) / 2;
	const graphCenterY = (minimumY + maximumY) / 2;

	return {
		x: graphCenterX - fitWidth / 2,
		y: graphCenterY - fitHeight / 2,
		w: fitWidth,
		h: fitHeight,
	};
}
