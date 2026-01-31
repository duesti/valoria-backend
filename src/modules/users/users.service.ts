import { prisma } from "../../core/db";
import type { CreateUserInput, UpdateUserInput } from "./users.schema";

export class UsersService {
	async getUser(userId: number) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		return user;
	}

	async createUser(data: CreateUserInput) {
		const user = await prisma.user.create({
			data: {
				...data,
			},
		});

		return user;
	}

	async updateUser(userId: number, data: UpdateUserInput) {
		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				...data,
			},
		});

		return user;
	}

	async deleteUser(userId: number) {
		return await prisma.user.delete({
			where: { id: userId },
		});
	}

	async getAllUsers() {
		return await prisma.user.findMany();
	}

	async getUserByDiscordId(discordId: string) {
		const user = await prisma.user.findUnique({
			where: { discord_id: discordId },
		});

		return user;
	}
}

export const usersService = new UsersService();
