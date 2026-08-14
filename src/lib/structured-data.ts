import type { LanguageCode } from "@/lib/i18n";
import { REPOSITORY_URL, SITE_NAME, SITE_URL, buildAbsoluteUrl } from "@/lib/site";

const APPLICATION_ID = `${SITE_URL}/#app`;

const applicationDescriptions: Record<LanguageCode, string> = {
	en: "Interactive graph editor that runs classic graph algorithms — BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim and topological sort — on graphs you draw yourself.",
	pt: "Editor interativo de grafos que executa algoritmos clássicos — BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim e ordenação topológica — em grafos desenhados por você.",
};

const applicationFeatures: Record<LanguageCode, string[]> = {
	en: [
		"Interactive graph editor with directed and weighted graphs",
		"Breadth-first search (BFS)",
		"Depth-first search (DFS)",
		"Dijkstra shortest path",
		"Bellman-Ford shortest path with negative weights",
		"Kruskal minimum spanning tree",
		"Prim minimum spanning tree",
		"Topological sort",
		"Export results to PDF",
	],
	pt: [
		"Editor interativo de grafos direcionados e ponderados",
		"Busca em largura (BFS)",
		"Busca em profundidade (DFS)",
		"Caminho mínimo com Dijkstra",
		"Caminho mínimo com Bellman-Ford e pesos negativos",
		"Árvore geradora mínima com Kruskal",
		"Árvore geradora mínima com Prim",
		"Ordenação topológica",
		"Exportação do resultado em PDF",
	],
};

export function buildSoftwareApplicationSchema(
	language: LanguageCode,
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"@id": APPLICATION_ID,
		name: SITE_NAME,
		url: `${SITE_URL}/`,
		applicationCategory: "EducationalApplication",
		applicationSubCategory: "Graph algorithm visualizer",
		operatingSystem: "Any (web browser)",
		browserRequirements: "Requires JavaScript",
		description: applicationDescriptions[language],
		inLanguage: ["en", "pt-BR"],
		isAccessibleForFree: true,
		license: "https://opensource.org/licenses/MIT",
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		featureList: applicationFeatures[language],
		codeRepository: REPOSITORY_URL,
		softwareHelp: REPOSITORY_URL,
	};
}

export function buildWebSiteSchema(language: LanguageCode): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		url: `${SITE_URL}/`,
		name: SITE_NAME,
		inLanguage: language === "pt" ? "pt-BR" : "en",
		publisher: { "@id": APPLICATION_ID },
	};
}

export interface BreadcrumbEntry {
	name: string;
	path: string;
}

export function buildBreadcrumbSchema(
	entries: BreadcrumbEntry[],
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: entries.map((entry, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: entry.name,
			item: buildAbsoluteUrl(entry.path),
		})),
	};
}

export interface FaqEntry {
	question: string;
	answer: string;
}

export function buildFaqSchema(entries: FaqEntry[]): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: entries.map((entry) => ({
			"@type": "Question",
			name: entry.question,
			acceptedAnswer: { "@type": "Answer", text: entry.answer },
		})),
	};
}
