import { createContext, useState, useCallback, type ReactNode } from "react";
import { t as translate, type LanguageCode } from "@/lib/i18n";

export interface I18nContextValue {
    lang: LanguageCode;
    setLang: (lang: LanguageCode) => void;
    t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): LanguageCode {
    const stored = localStorage.getItem("graphs4u-lang");
    if (stored === "pt" || stored === "en") return stored;
    const browser = navigator.language.slice(0, 2);
    if (browser === "pt") return "pt";
    return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<LanguageCode>(getInitialLang);

    const setLang = useCallback((code: LanguageCode) => {
        setLangState(code);
        localStorage.setItem("graphs4u-lang", code);
    }, []);

    const t = useCallback((key: string) => translate(key, lang), [lang]);

    return <I18nContext value={{ lang, setLang, t }}>{children}</I18nContext>;
}
