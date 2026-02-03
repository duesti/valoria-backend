import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../..";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/roles.middleware";
import { UpdateUserRoleSchema, UpdateUserSchema } from "./users.schema";
import { usersService } from "./users.service";
import { ForbiddenError, NotFoundError } from "../../core/errors";

const usersController = new Hono<AppEnv>();

usersController.get("/", async (ctx) => {
	const users = await usersService.getAllUsers();

	return ctx.json(users);
});

usersController.get("/:userId", async (ctx) => {
	const userId = Number(ctx.req.param("userId"));

	const user = await usersService.getUser(userId);

	if (!user) {
		throw new NotFoundError("Пользователь не найден");
	}

	return ctx.json(user);
});

usersController.patch(
	"/:userId",
	isAuthorized,
	isAdmin,
	zValidator("json", UpdateUserSchema),
	async (ctx) => {
		const userId = Number(ctx.req.param("userId"));

		const currentUser = ctx.get("user");

		const isUserAdmin = ctx.get("isAdmin");

		if (currentUser.id !== userId && !isUserAdmin) {
			throw new ForbiddenError();
		}

		const payload = ctx.req.valid("json");

		const user = await usersService.getUser(userId);

		if (!user) {
			throw new NotFoundError("Пользователь не найден");
		}

		const updatedUser = await usersService.updateUser(userId, payload);

		return ctx.json(updatedUser);
	},
);

usersController.delete("/:userId", isAuthorized, isAdmin, async (ctx) => {
	const userId = Number(ctx.req.param("userId"));

	const currentUser = ctx.get("user");

	const isUserAdmin = ctx.get("isAdmin");

	if (currentUser.id !== userId && !isUserAdmin) {
		throw new ForbiddenError();
	}

	const user = await usersService.getUser(userId);

	if (!user) {
		throw new NotFoundError("Пользователь не найден");
	}

	const deletedUser = await usersService.deleteUser(userId);

	return ctx.json(deletedUser);
});

usersController.post(
	"/roles/:userId",
	isAuthorized,
	isAdmin,
	zValidator("json", UpdateUserRoleSchema),
	async (ctx) => {
		const userId = Number(ctx.req.param("userId"));

		const isUserAdmin = ctx.get("isAdmin");

		if (!isUserAdmin) {
			throw new ForbiddenError();
		}

		const user = usersService.getUser(userId);

		if (!user) {
			throw new NotFoundError("Пользователь не найден");
		}

		const payload = ctx.req.valid("json");
		const updatedUser = await usersService.updateUser(userId, {
			role_id: payload.role_id,
		});

		return ctx.json(updatedUser);
	},
);

export { usersController };
