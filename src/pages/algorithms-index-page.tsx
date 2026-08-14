import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/seo/seo";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useI18n } from "@/hooks/use-i18n";
import { algorithms } from "@/lib/algorithms";
import { algorithmContents } from "@/content/algorithm-content";
import {
	buildAlgorithmPath,
	buildAlgorithmsIndexPath,
	buildHomePath,
} from "@/lib/routes";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import type { LanguageCode } from "@/lib/i18n";

const indexPageSeo: Record<LanguageCode, { title: string; description: string }> = {
	en: {
		title: "Graph Algorithms Explained & Visualized · graphs4u",
		description:
			"BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim and topological sort: complexity, pseudocode, worked examples and an editor where you can run each one on your own graph.",
	},
	pt: {
		title: "Algoritmos em Grafos Explicados e Visualizados · graphs4u",
		description:
			"BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim e ordenação topológica: complexidade, pseudocódigo, exemplos resolvidos e um editor para rodar cada um no seu próprio grafo.",
	},
};

export function AlgorithmsIndexPage() {
	const { lang, t } = useI18n();
	const seo = indexPageSeo[lang];
	const path = buildAlgorithmsIndexPath(lang);

	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: t("content.algorithmsTitle"),
		itemListElement: algorithms.map((algorithm, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: algorithmContents[algorithm.id][lang].heading,
			url: buildAbsoluteUrl(buildAlgorithmPath(algorithm.id, lang)),
		})),
	};

	return (
		<>
			<Seo
				language={lang}
				pageKey="algorithms-index"
				path={path}
				title={seo.title}
				description={seo.description}
				structuredData={[
					itemListSchema,
					buildBreadcrumbSchema([
						{ name: SITE_NAME, path: buildHomePath(lang) },
						{ name: t("content.algorithmsTitle"), path },
					]),
				]}
			/>

			<div className="flex min-h-dvh flex-col bg-surface text-foreground">
				<Header />

				<main className="flex-1">
					<div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
						<header className="flex flex-col gap-3">
							<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
								{t("content.algorithmsTitle")}
							</h1>
							<p className="max-w-2xl text-base leading-relaxed text-foreground-subtle">
								{t("content.algorithmsSubtitle")}
							</p>
						</header>

						<ul className="grid gap-3 sm:grid-cols-2">
							{algorithms.map((algorithm) => {
								const content = algorithmContents[algorithm.id][lang];
								return (
									<li key={algorithm.id}>
										<Link
											to={buildAlgorithmPath(algorithm.id, lang)}
											className="flex h-full flex-col gap-2 rounded-xl border border-border bg-surface-raised p-5 transition-colors hover:border-border-hover"
										>
											<span className="text-xs font-semibold uppercase tracking-wider text-primary">
												{content.categoryLabel}
											</span>
											<h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
												{content.heading}
												<ArrowRight className="size-4 text-muted-foreground" />
											</h2>
											<p className="text-sm leading-relaxed text-foreground-subtle">
												{content.summary}
											</p>
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
