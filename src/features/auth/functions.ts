import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/features/auth/server/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const result = await auth.api.getSession({ headers: getRequestHeaders() });
		if (!result) return null;

		// The result is serialized to the client, so leave out the session token
		// (it's the value of the HttpOnly session cookie).
		const { token: _token, ...session } = result.session;
		return { user: result.user, session };
	},
);
