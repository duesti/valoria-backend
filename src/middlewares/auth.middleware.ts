import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { config } from "@/src/core/config/config";
import { prisma } from "@/src/infra/prisma";
import type { AppEnv } from "..";

import { NotFoundError } from "../core/errors";

const ACCESS_SECRET = config.jwt.accessSecret as string;

const isAuthorized = createMiddleware<AppEnv>(async (ctx, next) => {
	const authHeader = ctx.req.header("Authorization");

	if (!authHeader?.startsWith("Bearer ")) {
		return ctx.json({ error: "Missing token" }, 401);
	}

	const token = authHeader.split(" ")[1];
	if (!token) return;

	const payload = await verify(token, ACCESS_SECRET, "HS256");
	const userId = payload.sub as number;

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new NotFoundError("Пользователь не найден");
	}

	ctx.set("user", user);
	ctx.set("role_id", user.role_id);

	await next();
});

export { isAuthorized };
