import { discordAuth } from "@hono/oauth-providers/discord";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { config } from "../../core/config";
import { AuthError } from "../../core/errors";
import { authService } from "./auth.service";

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
	const userDiscord = ctx.get("user-discord");

	if (!userDiscord?.id || !userDiscord.username) {
		throw new AuthError();
	}

	const { accessToken, refreshToken } = await authService.auth(
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
});

authController.post("/refresh", async (ctx) => {
	const refreshToken = getCookie(ctx, "refresh-token");

	if (!refreshToken) {
		throw new AuthError();
	}

	const { accessToken, refreshToken: newRefreshToken } =
		await authService.refresh(refreshToken);

	setCookie(ctx, "refresh-token", newRefreshToken, {
		httpOnly: true,
		sameSite: "Lax",
		maxAge: 60 * 60 * 24 * 7,
	});

	return ctx.json({ accessToken });
});

authController.post("/logout", async (ctx) => {
	const refreshToken = getCookie(ctx, "refresh-token");

	if (refreshToken) {
		await authService.logout(refreshToken);
		deleteCookie(ctx, "refresh-token");
	}

	return ctx.json({ message: "Logged out" });
});

export { authController };
