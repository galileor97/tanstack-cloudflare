import { absoluteUrl, site } from "@/lib/site";

type SeoOptions = {
	/** Page title. Rendered as "<title> | <site name>"; omit for the site title. */
	title?: string;
	description?: string;
	/** Absolute URL or path in /public. Defaults to the site's Open Graph image. */
	image?: string;
	imageAlt?: string;
	type?: "website" | "article";
	/** Keep the page out of search results (auth pages, dashboards, etc.). */
	noindex?: boolean;
};

/**
 * Page-level meta tags. Use in a route's `head`:
 *
 *   head: () => seo({ title: "Pricing", description: "..." })
 *
 * The root route adds the site-wide tags (canonical URL, og:url, og:site_name,
 * JSON-LD), and child routes override tags with the same name/property.
 */
export function seo({
	title,
	description = site.description,
	image,
	imageAlt,
	type = "website",
	noindex = false,
}: SeoOptions = {}) {
	const fullTitle = title ? `${title} | ${site.name}` : site.title;
	const imageUrl = absoluteUrl(image ?? site.ogImage.path);

	return {
		meta: [
			{ title: fullTitle },
			{ name: "description", content: description },
			{ property: "og:type", content: type },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: description },
			{ property: "og:image", content: imageUrl },
			{ property: "og:image:alt", content: imageAlt ?? fullTitle },
			...(image
				? []
				: [
						{ property: "og:image:width", content: String(site.ogImage.width) },
						{
							property: "og:image:height",
							content: String(site.ogImage.height),
						},
					]),
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: fullTitle },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: imageUrl },
			...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
		],
	};
}
