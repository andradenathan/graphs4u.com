import { Link } from "react-router-dom";
import { Waypoints } from "lucide-react";
import { Seo } from "@/components/seo/seo";
import { useI18n } from "@/hooks/use-i18n";
import type { LanguageCode } from "@/lib/i18n";
import { buildHomePath } from "@/lib/routes";

const notFoundCopy: Record<
	LanguageCode,
	{ title: string; description: string; action: string }
> = {
	en: {
		title: "Page not found",
		description: "This page does not exist. The graph editor is still one click away.",
		action: "Open the graph editor",
	},
	pt: {
		title: "Página não encontrada",
		description: "Esta página não existe. O editor de grafos está a um clique.",
		action: "Abrir o editor de grafos",
	},
};

export function NotFoundPage() {
	const { lang } = useI18n();
	const copy = notFoundCopy[lang];

	return (
		<>
			<Seo
				language={lang}
				pageKey="not-found"
				path="/404"
				title={`404 — ${copy.title} · graphs4u`}
				description={copy.description}
				noIndex
			/>

			<main className="flex h-dvh flex-col items-center justify-center gap-6 bg-surface px-6 text-center text-foreground">
				<Waypoints className="size-10 text-primary" />
				<div className="flex flex-col gap-2">
					<p className="font-mono text-sm text-muted-foreground">404</p>
					<h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
					<p className="max-w-md text-sm text-foreground-subtle">
						{copy.description}
					</p>
				</div>
				<Link
					to={buildHomePath(lang)}
					className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
				>
					{copy.action}
				</Link>
			</main>
		</>
	);
}
