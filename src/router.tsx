import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorBoundary } from "./components/error-boundary";
import { NotFound } from "./components/not-found";
import { getContext } from "./integrations/tanstack-query/context";
import { Provider } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = getContext();

	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultStructuralSharing: true,
		scrollRestorationBehavior: "smooth",
		defaultPreloadDelay: 100,
		defaultPreloadIntentProximity: 1000,
		defaultNotFoundComponent: NotFound,
		defaultErrorComponent: ({ error, reset }) => (
			<ErrorBoundary error={error} reset={reset} />
		),
		Wrap: (props: { children: React.ReactNode }) => {
			return <Provider {...rqContext}>{props.children}</Provider>;
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		/** Set to false to leave a route (and its children) out of /sitemap.xml. */
		sitemap?: boolean;
	}
}
