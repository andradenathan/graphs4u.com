export const SITE_URL = "https://graphs4u.com";
export const SITE_NAME = "graphs4u";
export const REPOSITORY_URL = "https://github.com/andradenathan/graphs4u.com";

/**
 * Absolute URL with a trailing slash, matching what GitHub Pages actually
 * serves for `nested` output (`/pt` is redirected to `/pt/`). Keeping canonical
 * URLs on the final form avoids indexing a redirect.
 */
export function buildAbsoluteUrl(path: string): string {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	if (normalizedPath === "/") return `${SITE_URL}/`;
	if (/\.[a-z0-9]+$/i.test(normalizedPath)) return `${SITE_URL}${normalizedPath}`;
	return `${SITE_URL}${normalizedPath.replace(/\/+$/, "")}/`;
}
