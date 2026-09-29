import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/functions";

// Layout route: every route under `_authed/` requires a signed-in user.
export const Route = createFileRoute("/_authed")({
	// Private pages: keep them out of search results and the sitemap.
	head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
	staticData: { sitemap: false },
	beforeLoad: async ({ location }) => {
		const session = await getSession();
		if (!session) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: location.href },
			});
		}
		return { session };
	},
	component: Outlet,
});
