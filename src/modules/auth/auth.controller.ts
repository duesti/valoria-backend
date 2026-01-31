import { discordAuth } from "@hono/oauth-providers/discord";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { config } from "../../core/config";
import { authSevice } from "./auth.service";

const authController = new Hono();

authController.use(
	"/discord",
	discordAuth({
		client_id: config?.CLIENT_ID,
		client_secret: config?.CLIENT_SECRET,
		scope: ["identify", "email", "guilds"],
	}),
);

authController.get("/discord", async (ctx) => {
	try {
		const userDiscord = ctx.get("user-discord");

		if (!userDiscord?.id || !userDiscord.username) {
			return ctx.text("Auth failed", 401);
		}

		const { accessToken, refreshToken } = await authSevice.auth(
			userDiscord.id,
			userDiscord.username,
		);

		setCookie(ctx, "refresh-token", refreshToken, {
			httpOnly: true,
			sameSite: "Lax",
			maxAge: 60 * 60 * 24 * 7,
		});

		console.log(`access - ${accessToken}\nrefresh - ${refreshToken}`);

		return ctx.redirect(
			`${config?.FRONTEND_URL}/auth/discord?token=${accessToken}`,
		);
	} catch (e) {
		if (e instanceof Error) {
			return ctx.json({ error: e.message }, 401);
		}
	}
});

authController.post("/refresh", async (ctx) => {
	try {
		const refreshToken = getCookie(ctx, "refresh-token");

		if (!refreshToken) {
			return ctx.json({ error: "No refresh token" }, 401);
		}

		const { accessToken, refreshToken: newRefreshToken } =
			await authSevice.refresh(refreshToken);

		setCookie(ctx, "refresh-token", newRefreshToken, {
			httpOnly: true,
			sameSite: "Lax",
			maxAge: 60 * 60 * 24 * 7,
		});

		return ctx.json({ accessToken });
	} catch (e) {
		if (e instanceof Error) {
			return ctx.json({ error: e.message }, 401);
		}
	}
});

authController.post("/logout", async (ctx) => {
	const refreshToken = getCookie(ctx, "refresh-token");

	if (refreshToken) {
		await authSevice.logout(refreshToken);
		deleteCookie(ctx, "refresh-token");
	}

	return ctx.json({ message: "Logged out" });
});

export { authController };
