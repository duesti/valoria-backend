import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../..";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/roles.middleware";
import { UpdateUserRoleSchema, UpdateUserSchema } from "./users.schema";
import { usersService } from "./users.service";

const usersController = new Hono<AppEnv>();

usersController.get("/", async (ctx) => {
	const users = await usersService.getAllUsers();

	return ctx.json(users);
});

usersController.get("/:userId", async (ctx) => {
	const userId = Number(ctx.req.param("userId"));

	const user = await usersService.getUser(userId);

	if (!user) {
		return ctx.json({ error: "User not found" }, 404);
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
			return ctx.json({ error: "Forbidden" }, 403);
		}

		const payload = ctx.req.valid("json");

		const user = usersService.getUser(userId);

		if (!user) {
			return ctx.json("User not found", 404);
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
		return ctx.json({ error: "Forbidden" }, 403);
	}

	const user = usersService.getUser(userId);

	if (!user) {
		return ctx.json("User not found", 404);
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
			return ctx.json({ error: "Forbidden" }, 403);
		}

		const user = usersService.getUser(userId);

		if (!user) {
			return ctx.json("User not found", 404);
		}

		const payload = ctx.req.valid("json");
		const updatedUser = await usersService.updateUser(userId, {
			role_id: payload.role_id,
		});

		return ctx.json(updatedUser);
	},
);

export { usersController };
