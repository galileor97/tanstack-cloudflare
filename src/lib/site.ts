// Site-wide SEO settings. Update these for your project.
export const site = {
	name: "TanStack Start",
	// Title used on the home page (other pages use "<page title> | <name>").
	title: "TanStack Start on Cloudflare",
	description:
		"A full-stack TanStack Start app running on Cloudflare Workers with D1, Better Auth and shadcn/ui.",
	// Production origin, no trailing slash. Used for canonical URLs, Open Graph and the sitemap.
	url: "https://example.com",
	locale: "en_US",
	language: "en",
	themeColor: "#ffffff",
	// 1200x630 image in /public used when a page doesn't set its own.
	ogImage: { path: "/og.png", width: 1200, height: 630 },
	logo: "/icon-512.png",
	// Twitter/X handle, e.g. "@yourhandle". Leave empty to omit.
	twitter: "",
};

export function absoluteUrl(path = "/") {
	return new URL(path, site.url).toString();
}
