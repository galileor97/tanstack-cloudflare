import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getSession } from "@/features/auth/functions";
import { seo } from "@/lib/seo";

const searchSchema = z.object({
	// Only allow same-origin paths to avoid open redirects.
	redirect: z
		.string()
		.regex(/^\/(?!\/)/)
		.optional()
		.catch(undefined),
});

export const Route = createFileRoute("/sign-in")({
	validateSearch: searchSchema,
	head: () =>
		seo({
			title: "Sign in",
			description: "Sign in or create an account.",
			noindex: true,
		}),
	staticData: { sitemap: false },
	beforeLoad: async ({ search }) => {
		const session = await getSession();
		if (session) {
			throw redirect({ href: search.redirect ?? "/dashboard" });
		}
	},
	component: SignInPage,
});

function SignInPage() {
	const { redirect } = Route.useSearch();

	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<SignInForm redirectTo={redirect} />
		</main>
	);
}
