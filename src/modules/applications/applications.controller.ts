import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ForbiddenError, NotFoundError } from "@/src/core/errors";
import { isAuthorized } from "@/src/middlewares/auth.middleware";
import { isAdmin } from "@/src/middlewares/roles.middleware";
import type { AppEnv } from "../..";
import {
	createApplicationSchema,
	updateApplicationSchema,
} from "./applications.dto";
import { applicationsService } from "./applications.service";

const applicationsController = new Hono<AppEnv>();

applicationsController.get(
	"/",
	describeRoute({
		description: "Получить список всех заявок",
	}),
	async (ctx) => {
		const applications = await applicationsService.getAllApplications();

		return ctx.json(applications);
	},
);

applicationsController.get(
	"/:applicationId",
	describeRoute({
		description: "Получить заявку по айди",
	}),
	async (ctx) => {
		const applicationId = Number(ctx.req.param("applicationId"));

		const application = await applicationsService.getApplication(applicationId);

		if (!application) {
			throw new NotFoundError("Заявка не найдена");
		}

		return ctx.json(application);
	},
);

applicationsController.post(
	"/",
	isAuthorized,
	describeRoute({
		description: "Создать новую заявку",
	}),
	zValidator("json", createApplicationSchema),
	async (ctx) => {
		const currentUser = ctx.get("user");
		const validatedPayload = ctx.req.valid("json");

		const payload = {
			content: validatedPayload.content,
			author_id: currentUser.id,
		};

		const application = await applicationsService.createApplication(payload);

		return ctx.json(application);
	},
);

applicationsController.patch(
	"/:applicationId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Обновить заявку",
	}),
	zValidator("json", updateApplicationSchema),
	async (ctx) => {
		const applicationId = Number(ctx.req.param("applicationId"));

		const application = await applicationsService.getApplication(applicationId);

		if (!application) {
			throw new NotFoundError("Заявка не найдена");
		}

		const currentUser = ctx.get("user");
		const isUserAdmin = ctx.get("isAdmin");

		if (currentUser.id !== application.author_id && !isUserAdmin) {
			throw new ForbiddenError();
		}

		const payload = ctx.req.valid("json");

		const updatedApplication = await applicationsService.updateApplication(
			applicationId,
			{
				...payload,
				content: payload.content,
			},
			isUserAdmin,
		);

		return ctx.json(updatedApplication);
	},
);

applicationsController.delete(
	"/:applicationId",
	isAuthorized,
	isAdmin,
	describeRoute({
		description: "Удалить заявку",
	}),
	async (ctx) => {
		const applicationId = Number(ctx.req.param("applicationId"));

		const application = await applicationsService.getApplication(applicationId);

		if (!application) {
			throw new NotFoundError("Заявка не найдена");
		}

		const currentUser = ctx.get("user");
		const isUserAdmin = ctx.get("isAdmin");

		if (currentUser.id !== application.author_id && !isUserAdmin) {
			throw new ForbiddenError();
		}

		const deletedApplication =
			await applicationsService.deleteApplication(applicationId);

		return ctx.json(deletedApplication);
	},
);

export { applicationsController };
