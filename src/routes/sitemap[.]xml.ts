import type { AnyRoute } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/site";

type SitemapEntry = {
	path: string;
	lastModified?: Date;
	changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
	priority?: number;
};

// Static pages are collected from the router: every page route without path
// params, unless it (or a parent layout) sets `staticData: { sitemap: false }`.
async function getStaticEntries(): Promise<SitemapEntry[]> {
	const { getRouter } = await import("@/router");
	const routes = Object.values(getRouter().routesById) as AnyRoute[];

	const excluded = (route: AnyRoute | undefined): boolean =>
		!!route &&
		(route.options.staticData?.sitemap === false ||
			excluded(route.parentRoute));

	return routes
		.filter(
			(route) =>
				!route.isRoot &&
				!route.children && // skip layouts
				route.options.component && // skip server-only routes (API, this file)
				!route.fullPath.includes("$") && // dynamic pages go in getDynamicEntries
				!excluded(route),
		)
		.map((route) => ({
			path: route.fullPath,
			priority: route.fullPath === "/" ? 1 : 0.7,
		}));
}

// Add URLs for dynamic pages here, e.g. blog posts loaded from D1:
//   const posts = await db.select().from(postsTable);
//   return posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.updatedAt }));
async function getDynamicEntries(): Promise<SitemapEntry[]> {
	return [];
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function toXml(entries: SitemapEntry[]) {
	const urls = entries.map((entry) =>
		[
			"  <url>",
			`    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
			entry.lastModified &&
				`    <lastmod>${entry.lastModified.toISOString()}</lastmod>`,
			entry.changeFrequency &&
				`    <changefreq>${entry.changeFrequency}</changefreq>`,
			entry.priority !== undefined &&
				`    <priority>${entry.priority.toFixed(1)}</priority>`,
			"  </url>",
		]
			.filter(Boolean)
			.join("\n"),
	);

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const entries = [
					...(await getStaticEntries()),
					...(await getDynamicEntries()),
				];
				return new Response(toXml(entries), {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			},
		},
	},
});
