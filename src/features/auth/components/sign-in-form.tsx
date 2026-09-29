import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "../client";
import { GoogleIcon } from "./google-icon";

export function SignInForm({
	redirectTo = "/dashboard",
}: {
	redirectTo?: string;
}) {
	const router = useRouter();
	const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const email = String(form.get("email"));
		const password = String(form.get("password"));

		setPending(true);
		setError(null);
		const { error } =
			mode === "sign-in"
				? await authClient.signIn.email({ email, password })
				: await authClient.signUp.email({
						email,
						password,
						name: String(form.get("name")),
					});
		setPending(false);

		if (error) {
			setError(error.message ?? "Something went wrong");
			return;
		}
		await router.invalidate();
		await router.navigate({ href: redirectTo });
	};

	const signInWithGoogle = async () => {
		setError(null);
		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: redirectTo,
		});
		if (error) setError(error.message ?? "Something went wrong");
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-xl">
					{mode === "sign-in" ? "Sign in" : "Create an account"}
				</CardTitle>
				<CardDescription>
					{mode === "sign-in"
						? "Welcome back. Sign in to continue."
						: "Enter your details to get started."}
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Button variant="outline" type="button" onClick={signInWithGoogle}>
					<GoogleIcon />
					Continue with Google
				</Button>

				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					<span className="h-px flex-1 bg-border" />
					or
					<span className="h-px flex-1 bg-border" />
				</div>

				<form onSubmit={onSubmit} className="grid gap-3">
					{mode === "sign-up" && (
						<div className="grid gap-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" autoComplete="name" required />
						</div>
					)}
					<div className="grid gap-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete={
								mode === "sign-in" ? "current-password" : "new-password"
							}
							minLength={8}
							required
						/>
					</div>
					{error && (
						<p role="alert" className="text-sm text-destructive">
							{error}
						</p>
					)}
					<Button type="submit" disabled={pending}>
						{pending
							? "Please wait…"
							: mode === "sign-in"
								? "Sign in"
								: "Create account"}
					</Button>
				</form>

				<p className="text-center text-sm text-muted-foreground">
					{mode === "sign-in"
						? "Don't have an account?"
						: "Already have an account?"}{" "}
					<button
						type="button"
						className="font-medium text-foreground underline-offset-4 hover:underline"
						onClick={() => {
							setMode(mode === "sign-in" ? "sign-up" : "sign-in");
							setError(null);
						}}
					>
						{mode === "sign-in" ? "Sign up" : "Sign in"}
					</button>
				</p>
			</CardContent>
		</Card>
	);
}
