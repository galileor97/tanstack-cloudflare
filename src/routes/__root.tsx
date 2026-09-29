import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { seo } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import "../styles.css";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: ({ matches }) => {
		// One canonical URL per page, built from the matched path (query string dropped).
		const url = absoluteUrl(matches.at(-1)?.pathname ?? "/");

		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "theme-color", content: site.themeColor },
				{ property: "og:site_name", content: site.name },
				{ property: "og:locale", content: site.locale },
				{ property: "og:url", content: url },
				...(site.twitter
					? [
							{ name: "twitter:site", content: site.twitter },
							{ name: "twitter:creator", content: site.twitter },
						]
					: []),
				// Defaults; routes override these with their own `seo()` call.
				...seo().meta,
				{
					"script:ld+json": {
						"@context": "https://schema.org",
						"@graph": [
							{
								"@type": "WebSite",
								"@id": `${site.url}/#website`,
								name: site.name,
								url: site.url,
								description: site.description,
								inLanguage: site.language,
								publisher: { "@id": `${site.url}/#organization` },
							},
							{
								"@type": "Organization",
								"@id": `${site.url}/#organization`,
								name: site.name,
								url: site.url,
								logo: absoluteUrl(site.logo),
							},
						],
					},
				},
			],
			links: [
				{ rel: "canonical", href: url },
				{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
				{ rel: "manifest", href: "/manifest.json" },
			],
		};
	},
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={site.language}>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<TooltipProvider>{children}</TooltipProvider>
				<Toaster closeButton />
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
