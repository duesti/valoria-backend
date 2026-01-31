import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import type { AppEnv } from "..";
import { config } from "../core/config";
import { prisma } from "../core/db";

const ACCESS_SECRET = config?.ACCESS_SECRET as string;

const isAuthorized = createMiddleware<AppEnv>(async (ctx, next) => {
	const authHeader = ctx.req.header("Authorization");

	if (!authHeader?.startsWith("Bearer ")) {
		return ctx.json({ error: "Missing token" }, 401);
	}

	const token = authHeader.split(" ")[1];
	if (!token) return;

	try {
		const payload = await verify(token, ACCESS_SECRET, "HS256");
		const userId = payload.sub as number;

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return ctx.json({ error: "User not found" }, 401);
		}

		ctx.set("user", user);
		ctx.set("role_id", user.role_id);

		await next();
	} catch (e) {
		if (e instanceof Error) {
			return ctx.json({ error: e.message }, 401);
		}
	}
});

export { isAuthorized };
