import { discordAuth } from "@hono/oauth-providers/discord";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { describeRoute } from "hono-openapi";
import { config } from "@/src/core/config/config";
import { AuthError } from "@/src/core/errors";
import { authService } from "./auth.service";

const authController = new Hono();

authController.use(
	"/discord",
	discordAuth({
		client_id: config.ouath2.clientId,
		client_secret: config.ouath2.clientSecret,
		scope: ["identify", "email", "guilds"],
		redirect_uri: config.ouath2.redirectUri
	}),
);

authController.get(
	"/discord",
	describeRoute({
		description: "Авторизация через discord",
	}),
	async (ctx) => {
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
			`${config.app.frontendUrl}/auth/discord?token=${accessToken}`,
		);
	},
);

authController.post(
	"/refresh",
	describeRoute({
		description: "Обновить JWT токены",
	}),
	async (ctx) => {
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
	},
);

authController.post(
	"/logout",
	describeRoute({
		description: "Удалить токены, выйти из аккаунта",
	}),
	async (ctx) => {
		const refreshToken = getCookie(ctx, "refresh-token");

		if (refreshToken) {
			await authService.logout(refreshToken);
			deleteCookie(ctx, "refresh-token");
		}

		return ctx.json({ message: "Logged out" });
	},
);

export { authController };
