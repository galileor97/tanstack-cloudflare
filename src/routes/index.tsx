import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
			<img src="/logo-black.svg" alt="" width={56} height={56} />
			<h1 className="text-3xl font-bold tracking-tight">
				TanStack Start on Cloudflare
			</h1>
			<p className="text-muted-foreground">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>
			<Link to="/dashboard" className={buttonVariants()}>
				Go to dashboard
			</Link>
		</main>
	);
}
