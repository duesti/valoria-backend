import { createMiddleware } from "hono/factory";
import type { AppEnv } from "..";
import { rolesService } from "../modules/roles/roles.service";

const isAdmin = createMiddleware<AppEnv>(async (ctx, next) => {
	const userRoleId = ctx.get("role_id");

	const userRole = await rolesService.getRole(userRoleId);

	if (!userRole) {
		return ctx.json({ error: "Internal server error" }, 500);
	}

	ctx.set("isAdmin", userRole.admin);

	await next();
});

export { isAdmin };
