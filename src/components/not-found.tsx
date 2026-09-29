import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export function NotFound() {
	return (
		<main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
			<p className="text-sm font-medium text-muted-foreground">404</p>
			<h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
			<p className="text-muted-foreground">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<Link to="/" className={buttonVariants()}>
				Back to home
			</Link>
		</main>
	);
}
