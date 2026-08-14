import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Seo } from "@/components/seo/seo";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GraphPreview } from "@/components/graph/graph-preview";
import { useI18n } from "@/hooks/use-i18n";
import { algorithms, runAlgorithm, type AlgorithmId } from "@/lib/algorithms";
import { algorithmExamples } from "@/lib/example-graphs";
import { describeAlgorithmResult } from "@/lib/algorithm-result-description";
import { buildGraphLink } from "@/lib/graph-serialization";
import { algorithmContents } from "@/content/algorithm-content";
import {
	buildAlgorithmPath,
	buildAlgorithmsIndexPath,
	buildHomePath,
} from "@/lib/routes";
import { buildAbsoluteUrl, REPOSITORY_URL, SITE_NAME } from "@/lib/site";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export interface AlgorithmPageProps {
	algorithmId: AlgorithmId;
}

export function AlgorithmPage({ algorithmId }: AlgorithmPageProps) {
	const { lang, t } = useI18n();
	const content = algorithmContents[algorithmId][lang];
	const example = algorithmExamples[algorithmId];
	const path = buildAlgorithmPath(algorithmId, lang);

	const exampleResult = runAlgorithm(
		algorithmId,
		example.graph,
		example.sourceId ?? undefined,
	);
	const exampleResultDescription = describeAlgorithmResult(
		algorithmId,
		example.graph,
		exampleResult,
		lang,
	);

	// The button opens the editor with this page's example already loaded.
	const editorLink = buildGraphLink({
		graph: example.graph,
		algorithmId,
		basePath: buildHomePath(lang),
	});

	const relatedAlgorithms = content.relatedAlgorithmIds
		.map((relatedId) => algorithms.find((entry) => entry.id === relatedId))
		.filter((entry) => entry !== undefined);

	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: content.heading,
		description: content.metaDescription,
		abstract: content.summary,
		url: buildAbsoluteUrl(path),
		inLanguage: lang === "pt" ? "pt-BR" : "en",
		isAccessibleForFree: true,
		author: { "@type": "Organization", name: SITE_NAME, url: REPOSITORY_URL },
		publisher: { "@id": "https://graphs4u.com/#app" },
		about: { "@type": "Thing", name: content.heading },
		proficiencyLevel: "Beginner",
	};

	const howToSchema = {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: content.heading,
		description: content.summary,
		inLanguage: lang === "pt" ? "pt-BR" : "en",
		step: content.howItWorks.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			text: step,
		})),
	};

	return (
		<>
			<Seo
				language={lang}
				pageKey={`algorithm:${algorithmId}`}
				path={path}
				title={`${content.metaTitle} · graphs4u`}
				description={content.metaDescription}
				structuredData={[
					articleSchema,
					howToSchema,
					buildFaqSchema(content.faq),
					buildBreadcrumbSchema([
						{ name: SITE_NAME, path: buildHomePath(lang) },
						{
							name: t("content.algorithmsTitle"),
							path: buildAlgorithmsIndexPath(lang),
						},
						{ name: content.heading, path },
					]),
				]}
			/>

			<div className="flex min-h-dvh flex-col bg-surface text-foreground">
				<Header />

				<main className="flex-1">
					<article className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-10">
						<nav
							aria-label="Breadcrumb"
							className="flex items-center gap-1.5 text-xs text-muted-foreground"
						>
							<Link
								to={buildHomePath(lang)}
								className="transition-colors hover:text-foreground"
							>
								graphs4u
							</Link>
							<ChevronRight className="size-3" />
							<Link
								to={buildAlgorithmsIndexPath(lang)}
								className="transition-colors hover:text-foreground"
							>
								{t("content.algorithmsTitle")}
							</Link>
							<ChevronRight className="size-3" />
							<span className="text-foreground-subtle">{content.heading}</span>
						</nav>

						<header className="flex flex-col gap-4">
							<p className="text-xs font-semibold uppercase tracking-wider text-primary">
								{content.categoryLabel}
							</p>
							<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
								{content.heading}
							</h1>
							<p className="max-w-3xl text-base leading-relaxed text-foreground-subtle">
								{content.summary}
							</p>
							<Link
								to={editorLink}
								className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
							>
								{t("content.openInEditor")}
								<ArrowRight className="size-4" />
							</Link>
						</header>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.facts")}
							</h2>
							<div className="overflow-x-auto">
								<table className="w-full min-w-md border-collapse text-sm">
									<thead>
										<tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
											<th scope="col" className="py-2 pr-4 font-medium">
												{t("content.property")}
											</th>
											<th scope="col" className="py-2 font-medium">
												{t("content.value")}
											</th>
										</tr>
									</thead>
									<tbody>
										{content.facts.map((fact) => (
											<tr key={fact.label} className="border-b border-border">
												<th
													scope="row"
													className="py-2.5 pr-4 text-left font-normal text-foreground-subtle"
												>
													{fact.label}
												</th>
												<td className="py-2.5 font-mono text-xs text-foreground">
													{fact.value}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.howItWorks")}
							</h2>
							<ol className="flex flex-col gap-3">
								{content.howItWorks.map((step, index) => (
									<li key={step} className="flex gap-3 text-sm leading-relaxed">
										<span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised font-mono text-xs text-primary">
											{index + 1}
										</span>
										<span className="text-foreground-subtle">{step}</span>
									</li>
								))}
							</ol>
						</section>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.example")}
							</h2>
							<p className="text-sm leading-relaxed text-foreground-subtle">
								{content.exampleNarrative}
							</p>
							<div className="rounded-xl border border-border bg-surface-raised p-4">
								<GraphPreview
									graph={example.graph}
									result={exampleResult}
									title={`${content.heading} — ${t("content.example")}`}
								/>
							</div>
							<div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface-raised p-4">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									{t("content.exampleResult")}
								</h3>
								<p className="font-mono text-sm text-foreground">
									{exampleResultDescription}
								</p>
							</div>
						</section>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.pseudocode")}
							</h2>
							<pre className="overflow-x-auto rounded-xl border border-border bg-surface-raised p-4 font-mono text-xs leading-relaxed text-foreground-subtle">
								<code>{content.pseudocode}</code>
							</pre>
						</section>

						<div className="grid gap-8 sm:grid-cols-2">
							<section className="flex flex-col gap-4">
								<h2 className="text-xl font-semibold tracking-tight">
									{t("content.useCases")}
								</h2>
								<ul className="flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed text-foreground-subtle">
									{content.useCases.map((useCase) => (
										<li key={useCase}>{useCase}</li>
									))}
								</ul>
							</section>

							<section className="flex flex-col gap-4">
								<h2 className="text-xl font-semibold tracking-tight">
									{t("content.pitfalls")}
								</h2>
								<ul className="flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed text-foreground-subtle">
									{content.pitfalls.map((pitfall) => (
										<li key={pitfall}>{pitfall}</li>
									))}
								</ul>
							</section>
						</div>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.faq")}
							</h2>
							<div className="flex flex-col gap-5">
								{content.faq.map((entry) => (
									<div key={entry.question} className="flex flex-col gap-1.5">
										<h3 className="text-sm font-semibold text-foreground">
											{entry.question}
										</h3>
										<p className="text-sm leading-relaxed text-foreground-subtle">
											{entry.answer}
										</p>
									</div>
								))}
							</div>
						</section>

						<section className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold tracking-tight">
								{t("content.related")}
							</h2>
							<div className="flex flex-wrap gap-2">
								{relatedAlgorithms.map((algorithm) => (
									<Link
										key={algorithm.id}
										to={buildAlgorithmPath(algorithm.id, lang)}
										className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground"
									>
										{t(algorithm.i18nKey)}
										<ArrowRight className="size-3.5" />
									</Link>
								))}
							</div>
						</section>
					</article>
				</main>

				<SiteFooter />
			</div>
		</>
	);
}
