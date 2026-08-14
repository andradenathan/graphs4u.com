import { Link } from "react-router-dom";
import { Waypoints } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { algorithms } from "@/lib/algorithms";
import {
	buildAlgorithmPath,
	buildAlgorithmsIndexPath,
	buildHomePath,
} from "@/lib/routes";
import { REPOSITORY_URL } from "@/lib/site";

/**
 * Internal navigation shared by every content page. Besides being useful, it is
 * how crawlers discover the algorithm pages from any entry point.
 */
export function SiteFooter() {
	const { lang, t } = useI18n();

	return (
		<footer
			data-slot="site-footer"
			className="border-t border-border bg-surface px-6 py-10"
		>
			<div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
				<div className="flex flex-col gap-3">
					<Link
						to={buildHomePath(lang)}
						className="flex items-center gap-2 text-foreground"
					>
						<Waypoints className="size-5 text-primary" />
						<span className="text-sm font-semibold tracking-tight">
							graphs4u
						</span>
					</Link>
					<p className="text-xs leading-relaxed text-muted-foreground">
						{t("content.footerTagline")}
					</p>
				</div>

				<nav className="flex flex-col gap-2">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
						{t("content.footerLearn")}
					</h2>
					<Link
						to={buildAlgorithmsIndexPath(lang)}
						className="text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						{t("content.allAlgorithms")}
					</Link>
					{algorithms.map((algorithm) => (
						<Link
							key={algorithm.id}
							to={buildAlgorithmPath(algorithm.id, lang)}
							className="text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							{t(algorithm.i18nKey)}
						</Link>
					))}
				</nav>

				<nav className="flex flex-col gap-2">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
						{t("content.footerAbout")}
					</h2>
					<Link
						to={buildHomePath(lang)}
						className="text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						{t("content.backToEditor")}
					</Link>
					<a
						href={REPOSITORY_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						{t("content.sourceCode")}
					</a>
					<a
						href={`${REPOSITORY_URL}/blob/main/LICENSE.md`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						{t("content.license")}
					</a>
				</nav>
			</div>
		</footer>
	);
}
