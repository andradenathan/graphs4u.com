import type { LanguageCode } from "@/lib/i18n";
import type { AlgorithmId } from "@/lib/algorithms";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

/** Locale codes used in `hreflang` and `og:locale`. */
export const languageLocales: Record<LanguageCode, string> = {
	en: "en",
	pt: "pt-BR",
};

export const languageOpenGraphLocales: Record<LanguageCode, string> = {
	en: "en_US",
	pt: "pt_BR",
};

/**
 * Section slugs per language. The English tree lives at the root and the
 * Portuguese tree under `/pt`, so every page has one canonical URL per language.
 */
const sectionSlugs = {
	algorithms: { en: "algorithms", pt: "algoritmos" },
} as const;

export const algorithmSlugs: Record<AlgorithmId, Record<LanguageCode, string>> = {
	bfs: { en: "bfs", pt: "bfs" },
	dfs: { en: "dfs", pt: "dfs" },
	dijkstra: { en: "dijkstra", pt: "dijkstra" },
	"bellman-ford": { en: "bellman-ford", pt: "bellman-ford" },
	kruskal: { en: "kruskal", pt: "kruskal" },
	prim: { en: "prim", pt: "prim" },
	"topological-sort": { en: "topological-sort", pt: "ordenacao-topologica" },
};

function withLanguagePrefix(language: LanguageCode, path: string): string {
	const normalizedPath = path.replace(/^\/+|\/+$/g, "");
	const prefix = language === DEFAULT_LANGUAGE ? "" : `/${language}`;
	if (!normalizedPath) return prefix || "/";
	return `${prefix}/${normalizedPath}`;
}

export function buildHomePath(language: LanguageCode): string {
	return withLanguagePrefix(language, "");
}

export function buildAlgorithmsIndexPath(language: LanguageCode): string {
	return withLanguagePrefix(language, sectionSlugs.algorithms[language]);
}

export function buildAlgorithmPath(
	algorithmId: AlgorithmId,
	language: LanguageCode,
): string {
	return withLanguagePrefix(
		language,
		`${sectionSlugs.algorithms[language]}/${algorithmSlugs[algorithmId][language]}`,
	);
}

export function findAlgorithmIdBySlug(
	slug: string,
	language: LanguageCode,
): AlgorithmId | null {
	const entry = Object.entries(algorithmSlugs).find(
		([, slugsByLanguage]) => slugsByLanguage[language] === slug,
	);
	return entry ? (entry[0] as AlgorithmId) : null;
}

export interface PageDescriptor {
	/** Stable identity of the page across languages, used to build hreflang links. */
	pageKey: string;
	language: LanguageCode;
	path: string;
	/** Sitemap priority, 1.0 for the home page. */
	priority: number;
}

/** Every prerendered, indexable page of the site, in both languages. */
export function listSitePages(): PageDescriptor[] {
	const languages: LanguageCode[] = ["en", "pt"];
	const pages: PageDescriptor[] = [];

	for (const language of languages) {
		pages.push({
			pageKey: "home",
			language,
			path: buildHomePath(language),
			priority: 1,
		});
	}

	return pages;
}

function normalizePath(path: string): string {
	if (path === "/") return "/";
	return path.replace(/\/+$/, "") || "/";
}

/**
 * Same page in another language, so the language switcher navigates instead of
 * mutating client state. Falls back to that language's home page.
 */
export function translatePath(
	currentPath: string,
	targetLanguage: LanguageCode,
): string {
	const pages = listSitePages();
	const currentPage = pages.find(
		(page) => normalizePath(page.path) === normalizePath(currentPath),
	);
	if (!currentPage) return buildHomePath(targetLanguage);

	const translatedPage = pages.find(
		(page) =>
			page.pageKey === currentPage.pageKey && page.language === targetLanguage,
	);
	return translatedPage?.path ?? buildHomePath(targetLanguage);
}

/** Language alternates of a page, for `<link rel="alternate" hreflang>`. */
export function listPageAlternates(
	pageKey: string,
): { language: LanguageCode; path: string }[] {
	return listSitePages()
		.filter((page) => page.pageKey === pageKey)
		.map((page) => ({ language: page.language, path: page.path }));
}
