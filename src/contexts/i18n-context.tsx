import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { t as translate, type LanguageCode } from "@/lib/i18n";

export interface I18nContextValue {
	lang: LanguageCode;
	t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
	/** Language comes from the URL, so every page has a stable, crawlable locale. */
	lang: LanguageCode;
	children: ReactNode;
}

export function I18nProvider({ lang, children }: I18nProviderProps) {
	const t = useCallback((key: string) => translate(key, lang), [lang]);
	const value = useMemo(() => ({ lang, t }), [lang, t]);

	return <I18nContext value={value}>{children}</I18nContext>;
}
