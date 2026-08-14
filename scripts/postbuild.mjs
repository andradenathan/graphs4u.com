import { copyFile, readdir, stat, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");
const SITE_URL = "https://graphs4u.com";

/** Every prerendered route, derived from the emitted `index.html` files. */
async function collectPrerenderedRoutes(directory = distDirectory, routePrefix = "") {
	const routes = [];
	const entries = await readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		if (entry.isDirectory()) {
			if (entry.name === "assets" || entry.name === "og") continue;
			routes.push(
				...(await collectPrerenderedRoutes(
					path.join(directory, entry.name),
					`${routePrefix}/${entry.name}`,
				)),
			);
			continue;
		}
		if (entry.name === "index.html") {
			routes.push(routePrefix === "" ? "/" : `${routePrefix}/`);
		}
	}

	return routes;
}

function buildSitemap(routes, lastModified) {
	const urlEntries = routes
		.map((route) => {
			const depth = route.split("/").filter(Boolean).length;
			const priority = route === "/" ? "1.0" : depth <= 1 ? "0.9" : "0.8";
			return [
				"\t<url>",
				`\t\t<loc>${SITE_URL}${route}</loc>`,
				`\t\t<lastmod>${lastModified}</lastmod>`,
				"\t\t<changefreq>weekly</changefreq>",
				`\t\t<priority>${priority}</priority>`,
				"\t</url>",
			].join("\n");
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

const allRoutes = await collectPrerenderedRoutes();
const indexableRoutes = allRoutes.filter((route) => !route.startsWith("/404")).sort();

const lastModified = new Date().toISOString().slice(0, 10);
await writeFile(
	path.join(distDirectory, "sitemap.xml"),
	buildSitemap(indexableRoutes, lastModified),
);
console.log(`sitemap.xml written with ${indexableRoutes.length} urls`);

// GitHub Pages serves 404.html for any unmatched path.
const notFoundSource = path.join(distDirectory, "404", "index.html");
if (await fileExists(notFoundSource)) {
	await copyFile(notFoundSource, path.join(distDirectory, "404.html"));
	console.log("404.html written");
} else {
	throw new Error("expected prerendered /404 route to exist");
}

// Prevent GitHub Pages from ever running the output through Jekyll.
await writeFile(path.join(distDirectory, ".nojekyll"), "");

// The custom domain breaks if CNAME is missing from the published artifact.
const cnamePath = path.join(distDirectory, "CNAME");
if (!(await fileExists(cnamePath))) {
	throw new Error("CNAME missing from dist — custom domain would break");
}
const cnameStats = await stat(cnamePath);
if (cnameStats.size === 0) throw new Error("CNAME is empty");

console.log("postbuild checks passed");
