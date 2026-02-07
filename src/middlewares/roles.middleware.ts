import { createMiddleware } from "hono/factory";
import type { AppEnv } from "..";
import { InternalServerError } from "../core/errors";
import { rolesService } from "../modules/roles/roles.service";

const isAdmin = createMiddleware<AppEnv>(async (ctx, next) => {
	const userRoleId = ctx.get("role_id");

	const userRole = await rolesService.getRole(userRoleId);

	if (!userRole) {
		throw new InternalServerError();
	}

	ctx.set("isAdmin", userRole.admin);

	await next();
});

export { isAdmin };
