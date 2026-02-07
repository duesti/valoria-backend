import { prisma } from "@/src/infra/prisma";

import type { CreateRoleDTO, UpdateRoleDTO } from "./roles.dto";
import { createRoleSchema, updateRoleSchema } from "./roles.dto";

export class RolesService {
	async getRole(roleId: number) {
		const role = await prisma.role.findUnique({
			where: { id: roleId },
		});

		return role;
	}

	async createRole(data: CreateRoleDTO) {
		const validData = createRoleSchema.parse(data)

		const role = await prisma.role.create({
			data: {
				...validData,
			},
		});

		return role;
	}

	async updateRole(roleId: number, data: UpdateRoleDTO) {
		const validData = updateRoleSchema.parse(data)

		const role = await prisma.role.update({
			where: { id: roleId },
			data: {
				...validData,
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
