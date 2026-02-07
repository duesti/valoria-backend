import { sign, verify } from "hono/jwt";
import { config } from "@/src/core/config/config";
import { AuthError, InternalServerError } from "@/src/core/errors";
import { prisma } from "@/src/infra/prisma";
import { usersService } from "../users/users.service";

const ACCESS_SECRET = config.jwt.accessSecret as string;
const REFRESH_SECRET = config.jwt.refreshSecret as string;

const ACCESS_LIFETIME = 60 * 5;
const REFRESH_LIFETIME = 7 * 24 * 60 * 60;

export class AuthService {
	private async generateTokensPair(userId: number) {
		const accessToken = await sign(
			{
				sub: userId,
				exp: Math.floor(Date.now() / 1000) + ACCESS_LIFETIME,
			},
			ACCESS_SECRET,
		);

		const refreshToken = await sign(
			{
				sub: userId,
				exp: Math.floor(Date.now() / 1000) + REFRESH_LIFETIME,
			},
			REFRESH_SECRET,
		);

		await prisma.token.create({
			data: {
				token: refreshToken,
				owner_id: userId,
				expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		});

		return { accessToken, refreshToken };
	}

	async auth(discordId: string, username: string) {
		let user = await usersService.getUserByDiscordId(discordId);

		if (!user) {
			user = await usersService.createUser({
				discord_id: discordId,
				name: username,
			});
		}

		return await this.generateTokensPair(user.id);
	}

	async refresh(oldRefreshToken: string) {
		const payload = await verify(oldRefreshToken, REFRESH_SECRET, "HS256");

		if (!payload.sub) {
			throw new InternalServerError(
				"Произошла серверная ошибка при авторизации, попробуйте позже.",
			);
		}

		const dbToken = await prisma.token.findFirst({
			where: { token: oldRefreshToken, revoked: false },
		});

		if (!dbToken) {
			throw new AuthError("Предоставлен неверный авторизационный токен");
		}

		await prisma.token.delete({
			where: { id: dbToken.id },
		});

		return await this.generateTokensPair(payload.sub as number);
	}

	async logout(refreshToken: string) {
		await prisma.token.updateMany({
			where: { token: refreshToken },
			data: { revoked: true },
		});
	}
}

export const authService = new AuthService();
