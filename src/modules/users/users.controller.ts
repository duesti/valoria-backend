import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ForbiddenError, NotFoundError } from "@/src/core/errors";
import { isAuthorized } from "@/src/middlewares/auth.middleware";
import { isAdmin } from "@/src/middlewares/roles.middleware";
import type { AppEnv } from "../..";
import { updateUserRoleSchema, updateUserSchema } from "./users.dto";
import { usersService } from "./users.service";

const usersController = new Hono<AppEnv>();

usersController.get(
	"/",
	describeRoute({
		description: "Получить список всех пользователей",
	}),
	async (ctx) => {
		const users = await usersService.getAllUsers();

		return ctx.json(users);
	},
);

usersController.get(
	"/:userId",
	describeRoute({
		description: "Получить пользователя по айди",
	}),
	async (ctx) => {
		const userId = Number(ctx.req.param("userId"));

		const user = await usersService.getUser(userId);

		if (!user) {
			throw new NotFoundError("Пользователь не найден");
		}

		return ctx.json(user);
	},
);

usersController.patch(
	"/:userId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Обновить пользователя",
	}),
	zValidator("json", updateUserSchema),
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

usersController.delete(
	"/:userId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Удалить пользователя",
	}),
	async (ctx) => {
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
	},
);

usersController.patch(
	"/roles/:userId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Обновить роль пользователя",
	}),
	zValidator("json", updateUserRoleSchema),
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
