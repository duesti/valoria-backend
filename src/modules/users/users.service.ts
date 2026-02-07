import { prisma } from "@/src/infra/prisma";

import type { CreateUserDTO, UpdateUserDTO } from "./users.dto";
import { createUserSchema, updateUserSchema } from "./users.dto";

export class UsersService {
	async getUser(userId: number) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		return user;
	}

	async createUser(data: CreateUserDTO) {
		const validData = createUserSchema.parse(data)

		const user = await prisma.user.create({
			data: {
				...validData,
			},
		});

		return user;
	}

	async updateUser(userId: number, data: UpdateUserDTO) {
		const validData = updateUserSchema.parse(data)

		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				...validData,
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
