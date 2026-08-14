import type { RouteRecord } from "vite-react-ssg";
import { LanguageLayout } from "@/layouts/language-layout";
import { BoardPage } from "@/pages/board-page";
import { NotFoundPage } from "@/pages/not-found-page";
import type { LanguageCode } from "@/lib/i18n";

function buildLanguageRoutes(
	language: LanguageCode,
	pathPrefix: string,
): RouteRecord {
	return {
		path: pathPrefix,
		element: <LanguageLayout lang={language} />,
		children: [
			{ index: true, element: <BoardPage /> },
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
