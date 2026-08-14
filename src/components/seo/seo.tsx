import { Head } from "vite-react-ssg";
import type { LanguageCode } from "@/lib/i18n";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";
import {
	DEFAULT_LANGUAGE,
	languageLocales,
	languageOpenGraphLocales,
	listPageAlternates,
} from "@/lib/routes";

export interface SeoProps {
	language: LanguageCode;
	/** Identity of the page across languages, used to emit hreflang alternates. */
	pageKey: string;
	path: string;
	title: string;
	description: string;
	/** Absolute or root-relative open graph image. Defaults to the site image. */
	imagePath?: string;
	noIndex?: boolean;
	/** JSON-LD blocks describing the page content for search and answer engines. */
	structuredData?: Record<string, unknown>[];
}

export function Seo({
	language,
	pageKey,
	path,
	title,
	description,
	imagePath,
	noIndex = false,
	structuredData = [],
}: SeoProps) {
	const canonicalUrl = buildAbsoluteUrl(path);
	const imageUrl = buildAbsoluteUrl(
		imagePath ?? (language === "pt" ? "/og/default-pt.png" : "/og/default.png"),
	);
	const alternates = listPageAlternates(pageKey);

	return (
		<Head>
			<html lang={languageLocales[language]} />

			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonicalUrl} />
			{noIndex && <meta name="robots" content="noindex, follow" />}

			{alternates.map((alternate) => (
				<link
					key={alternate.language}
					rel="alternate"
					hrefLang={languageLocales[alternate.language]}
					href={buildAbsoluteUrl(alternate.path)}
				/>
			))}
			{alternates.length > 0 && (
				<link
					rel="alternate"
					hrefLang="x-default"
					href={buildAbsoluteUrl(
						alternates.find(
							(alternate) => alternate.language === DEFAULT_LANGUAGE,
						)?.path ?? "/",
					)}
				/>
			)}

			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:locale" content={languageOpenGraphLocales[language]} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />

			{structuredData.map((block, index) => (
				<script key={index} type="application/ld+json">
					{JSON.stringify(block)}
				</script>
			))}
		</Head>
	);
}
