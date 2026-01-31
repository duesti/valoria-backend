import { prisma } from "../../core/db";
import type { CreateRoleInput, UpdateRoleInput } from "./roles.schema";

export class RolesService {
	async getRole(roleId: number) {
		const role = await prisma.role.findUnique({
			where: { id: roleId },
		});

		return role;
	}

	async createRole(data: CreateRoleInput) {
		const role = await prisma.role.create({
			data: {
				...data,
			},
		});

		return role;
	}

	async updateRole(roleId: number, data: UpdateRoleInput) {
		const role = await prisma.role.update({
			where: { id: roleId },
			data: {
				...data,
			},
		});

		return role;
	}

	async deleteRole(roleId: number) {
		const role = await prisma.role.delete({
			where: { id: roleId },
		});

		return role;
	}

	async getAllRoles() {
		const roles = await prisma.role.findMany();

		return roles;
	}
}

export const rolesService = new RolesService();
