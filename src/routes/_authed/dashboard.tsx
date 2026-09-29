import { createFileRoute } from "@tanstack/react-router";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_authed/dashboard")({
	head: () => seo({ title: "Dashboard", noindex: true }),
	component: Dashboard,
});

function Dashboard() {
	const { session } = Route.useRouteContext();

	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
			{session.user.image && (
				<img
					src={session.user.image}
					alt=""
					width={64}
					height={64}
					className="rounded-full"
					referrerPolicy="no-referrer"
				/>
			)}
			<h1 className="text-2xl font-bold">Hi, {session.user.name}</h1>
			<p className="text-muted-foreground">{session.user.email}</p>
			<SignOutButton />
		</main>
	);
}
