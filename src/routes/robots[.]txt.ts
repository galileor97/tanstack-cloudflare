import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/site";

// Private pages use a `noindex` meta tag instead of Disallow here, because
// crawlers can't see noindex on pages they're not allowed to fetch.
const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: () =>
				new Response(robots, {
					headers: {
						"Content-Type": "text/plain; charset=utf-8",
						"Cache-Control": "public, max-age=86400",
					},
				}),
		},
	},
});
