import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ForbiddenError, NotFoundError } from "@/src/core/errors";
import { isAuthorized } from "@/src/middlewares/auth.middleware";
import { isAdmin } from "@/src/middlewares/roles.middleware";
import { createRoleSchema, updateRoleSchema } from "./roles.dto";
import { rolesService } from "./roles.service";

const rolesController = new Hono();

rolesController.get(
	"/",
	describeRoute({
		description: "Получить список всех ролей",
	}),
	async (ctx) => {
		const roles = await rolesService.getAllRoles();

		return ctx.json(roles);
	},
);

rolesController.get(
	"/:roleId",
	describeRoute({
		description: "Получить роль по айди",
	}),
	async (ctx) => {
		const roleId = Number(ctx.req.param("roleId"));

		const role = await rolesService.getRole(roleId);

		if (!role) {
			throw new NotFoundError("Роль не найдена");
		}

		return ctx.json(role);
	},
);

rolesController.post(
	"/",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Создать новую роль",
	}),
	zValidator("json", createRoleSchema),
	async (ctx) => {
		const isUserAdmin = ctx.get("isAdmin");

		if (!isUserAdmin) {
			throw new ForbiddenError();
		}

		const payload = ctx.req.valid("json");

		const role = await rolesService.createRole({
			name: payload.name,
			admin: payload.admin,
		});

		return ctx.json(role);
	},
);

rolesController.patch(
	"/:roleId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Обновить роль",
	}),
	zValidator("json", updateRoleSchema),
	async (ctx) => {
		const roleId = Number(ctx.req.param("roleId"));

		const role = await rolesService.getRole(roleId);

		if (!role) {
			throw new NotFoundError("Роль не найдена");
		}

		const isUserAdmin = ctx.get("isAdmin");

		if (!isUserAdmin) {
			throw new ForbiddenError();
		}

		const payload = ctx.req.valid("json");

		const newRole = await rolesService.updateRole(roleId, payload);

		return ctx.json(newRole);
	},
);

rolesController.delete(
	"/:roleId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Удалить роль",
	}),
	zValidator("json", createRoleSchema),
	async (ctx) => {
		const roleId = Number(ctx.req.param("roleId"));

		const role = await rolesService.getRole(roleId);

		if (!role) {
			throw new NotFoundError("Роль не найдена");
		}

		const isUserAdmin = ctx.get("isAdmin");

		if (!isUserAdmin) {
			throw new ForbiddenError();
		}

		const deleteRole = await rolesService.deleteRole(roleId);

		return ctx.json(deleteRole);
	},
);

export { rolesController };
