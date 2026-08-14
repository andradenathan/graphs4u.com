import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useGraph } from "@/hooks/use-graph";
import { useI18n } from "@/hooks/use-i18n";
import { buildGraphLink } from "@/lib/graph-serialization";
import { buildHomePath } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

const COPIED_FEEDBACK_MILLISECONDS = 2000;

/**
 * Copies a link that carries the whole graph in the query string, so a graph
 * can be shared without an account or a backend.
 */
export function ShareGraphButton() {
	const { state } = useGraph();
	const { lang, t } = useI18n();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MILLISECONDS);
		return () => clearTimeout(timeout);
	}, [copied]);

	async function copyGraphLink() {
		const link = `${SITE_URL}${buildGraphLink({
			graph: state.graph,
			basePath: buildHomePath(lang),
		})}`;

		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
		} catch {
			window.prompt(t("share.copyLink"), link);
		}
	}

	return (
		<IconButton
			aria-label={copied ? t("share.copied") : t("share.copyLink")}
			title={copied ? t("share.copied") : t("share.copyLink")}
			onClick={copyGraphLink}
			size="sm"
			className={
				copied
					? "text-algo-result"
					: "text-muted-foreground hover:text-foreground"
			}
		>
			{copied ? <Check /> : <Share2 />}
		</IconButton>
	);
}
