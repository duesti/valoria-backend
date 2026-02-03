import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/roles.middleware";
import { CreateRoleSchema, UpdateRoleSchema } from "./roles.schema";
import { rolesService } from "./roles.service";
import { ForbiddenError, NotFoundError } from "../../core/errors";

const rolesController = new Hono();

rolesController.get("/", async (ctx) => {
	const roles = await rolesService.getAllRoles();

	return ctx.json(roles);
});

rolesController.get("/:roleId", async (ctx) => {
	const roleId = Number(ctx.req.param("roleId"));

	const role = await rolesService.getRole(roleId);

	if (!role) {
		throw new NotFoundError("Роль не найдена");
	}

	return ctx.json(role);
});

rolesController.post(
	"/",
	isAuthorized,
	isAdmin,
	zValidator("json", CreateRoleSchema),
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
	zValidator("json", UpdateRoleSchema),
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
	zValidator("json", CreateRoleSchema),
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
