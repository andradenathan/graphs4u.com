import type { RouteRecord } from "vite-react-ssg";
import { LanguageLayout } from "@/layouts/language-layout";
import { BoardPage } from "@/pages/board-page";
import { AlgorithmPage } from "@/pages/algorithm-page";
import { AlgorithmsIndexPage } from "@/pages/algorithms-index-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { algorithms, type AlgorithmId } from "@/lib/algorithms";
import { algorithmSlugs } from "@/lib/routes";
import type { LanguageCode } from "@/lib/i18n";

const algorithmSectionSlugs: Record<LanguageCode, string> = {
	en: "algorithms",
	pt: "algoritmos",
};

/**
 * Routes are declared statically, one per language, so vite-react-ssg
 * prerenders every page without needing dynamic path resolution at build time.
 */
function buildLanguageRoutes(
	language: LanguageCode,
	pathPrefix: string,
): RouteRecord {
	const sectionSlug = algorithmSectionSlugs[language];

	return {
		path: pathPrefix,
		element: <LanguageLayout lang={language} />,
		children: [
			{ index: true, element: <BoardPage /> },
			{ path: sectionSlug, element: <AlgorithmsIndexPage /> },
			...algorithms.map((algorithm) => ({
				path: `${sectionSlug}/${algorithmSlugs[algorithm.id as AlgorithmId][language]}`,
				element: <AlgorithmPage algorithmId={algorithm.id} />,
			})),
			{ path: "*", element: <NotFoundPage /> },
		],
	};
}

export const routes: RouteRecord[] = [
	buildLanguageRoutes("pt", "/pt"),
	{
		path: "/404",
		element: <LanguageLayout lang="en" />,
		children: [{ index: true, element: <NotFoundPage /> }],
	},
	buildLanguageRoutes("en", "/"),
];
