import { sign, verify } from "hono/jwt";
import { config } from "../../core/config";
import { prisma } from "../../core/db";
import { usersService } from "../users/users.service";

const ACCESS_SECRET = config?.ACCESS_SECRET as string;
const REFRESH_SECRET = config?.REFRESH_SECRET as string;

export class AuthService {
	private async generateTokensPair(userId: number) {
		const accessToken = await sign(
			{
				sub: userId,
				exp: Math.floor(Date.now() / 1000) + 60 * 5,
			},
			ACCESS_SECRET,
		);

		const refreshToken = await sign(
			{
				sub: userId,
				exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 * 1000,
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
		let user = await usersService.getUserByDiscordId(discordId)

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

		if (!payload.sub) throw new Error("Unknown error");

		const dbToken = await prisma.token.findFirst({
			where: { token: oldRefreshToken, revoked: false },
		});

		if (!dbToken) throw new Error("Invalid token provided");

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

export const authSevice = new AuthService();
