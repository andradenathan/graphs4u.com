import { Outlet } from "react-router-dom";
import { I18nProvider } from "@/contexts/i18n-context";
import { GraphProvider } from "@/contexts/graph-context";
import type { LanguageCode } from "@/lib/i18n";

export interface LanguageLayoutProps {
	lang: LanguageCode;
}

/**
 * One layout per language subtree. The graph provider lives here so the graph
 * survives navigation between the board and the content pages.
 */
export function LanguageLayout({ lang }: LanguageLayoutProps) {
	return (
		<I18nProvider lang={lang}>
			<GraphProvider>
				<Outlet />
			</GraphProvider>
		</I18nProvider>
	);
}
