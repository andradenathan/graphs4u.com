import { useId } from "react";
import { twMerge } from "tailwind-merge";
import type { Graph } from "@/types/graph";
import type { AlgorithmStep } from "@/lib/algorithms";
import { EXAMPLE_VIEW_BOX } from "@/lib/example-graphs";

const NODE_RADIUS = 18;

export interface GraphPreviewProps {
	graph: Graph;
	result?: AlgorithmStep | null;
	/** Accessible description of what the picture shows. */
	title: string;
	className?: string;
}

function shortenEdge(
	source: { x: number; y: number },
	target: { x: number; y: number },
	distanceFromTarget: number,
) {
	const deltaX = target.x - source.x;
	const deltaY = target.y - source.y;
	const length = Math.hypot(deltaX, deltaY) || 1;
	return {
		x: target.x - (deltaX / length) * distanceFromTarget,
		y: target.y - (deltaY / length) * distanceFromTarget,
	};
}

/**
 * Static, non-interactive rendering of a graph. Unlike the editor board this
 * renders on the server, so the worked example ships inside the HTML.
 */
export function GraphPreview({ graph, result, title, className }: GraphPreviewProps) {
	const markerId = useId().replace(/:/g, "");
	const resultEdgeIds = new Set(result?.resultEdgeIds ?? []);
	const resultNodeIds = new Set(result?.resultNodeIds ?? []);
	const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));

	return (
		<svg
			data-slot="graph-preview"
			role="img"
			aria-label={title}
			viewBox={`0 0 ${EXAMPLE_VIEW_BOX.width} ${EXAMPLE_VIEW_BOX.height}`}
			className={twMerge("h-auto w-full", className)}
		>
			<title>{title}</title>
			<defs>
				<marker
					id={`arrow-${markerId}`}
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" className="fill-edge" />
				</marker>
				<marker
					id={`arrow-result-${markerId}`}
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" className="fill-algo-result" />
				</marker>
			</defs>

			{graph.edges.map((edge) => {
				const source = nodesById.get(edge.source);
				const target = nodesById.get(edge.target);
				if (!source || !target) return null;

				const isResult = resultEdgeIds.has(edge.id);
				const endpoint = shortenEdge(
					source,
					target,
					graph.directed ? NODE_RADIUS + 6 : 0,
				);
				const midpoint = {
					x: (source.x + target.x) / 2,
					y: (source.y + target.y) / 2,
				};

				return (
					<g key={edge.id}>
						<line
							x1={source.x}
							y1={source.y}
							x2={endpoint.x}
							y2={endpoint.y}
							strokeWidth={isResult ? 3 : 2}
							className={isResult ? "stroke-algo-result" : "stroke-edge"}
							markerEnd={
								graph.directed
									? `url(#arrow${isResult ? "-result" : ""}-${markerId})`
									: undefined
							}
						/>
						{graph.weighted && (
							<text
								x={midpoint.x}
								y={midpoint.y - 6}
								textAnchor="middle"
								className={twMerge(
									"font-mono text-[13px]",
									isResult
										? "fill-algo-result"
										: "fill-muted-foreground",
								)}
							>
								{edge.weight}
							</text>
						)}
					</g>
				);
			})}

			{graph.nodes.map((node) => {
				const isResult = resultNodeIds.has(node.id);
				return (
					<g key={node.id}>
						<circle
							cx={node.x}
							cy={node.y}
							r={NODE_RADIUS}
							strokeWidth={2.5}
							className={twMerge(
								"fill-surface",
								isResult ? "stroke-algo-result" : "stroke-node",
							)}
						/>
						<text
							x={node.x}
							y={node.y + 5}
							textAnchor="middle"
							className="fill-foreground text-[14px] font-semibold"
						>
							{node.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
}
