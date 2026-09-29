import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "../client";

export function SignOutButton(props: React.ComponentProps<typeof Button>) {
	const router = useRouter();

	const signOut = async () => {
		await authClient.signOut();
		await router.invalidate();
		await router.navigate({ to: "/sign-in" });
	};

	return (
		<Button variant="outline" onClick={signOut} {...props}>
			Sign out
		</Button>
	);
}
