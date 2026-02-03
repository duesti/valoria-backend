import { zValidator } from "@hono/zod-validator";
import type { InputJsonValue } from "@prisma/client/runtime/client";
import { Hono } from "hono";
import type { ApplicationCreateInput } from "../../../generated/prisma/models";
import type { AppEnv } from "../..";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/roles.middleware";
import {
	CreateApplicationSchema,
	UpdateApplicationSchema,
} from "./applications.schema";
import { applicationsService } from "./applications.service";
import { ForbiddenError, NotFoundError } from "../../core/errors";

const applicationsController = new Hono<AppEnv>();

applicationsController.get("/", async (ctx) => {
	const applications = await applicationsService.getAllApplications();

	return ctx.json(applications);
});

applicationsController.get("/:applicationId", async (ctx) => {
	const applicationId = Number(ctx.req.param("applicationId"));

	const application = await applicationsService.getApplication(applicationId);

	if (!application) {
		throw new NotFoundError("Заявка не найдена");
	}

	return ctx.json(application);
});

applicationsController.post(
	"/",
	isAuthorized,
	zValidator("json", CreateApplicationSchema),
	async (ctx) => {
		const currentUser = ctx.get("user");
		const validatedPayload = ctx.req.valid("json");

		const payload: ApplicationCreateInput = {
			content: validatedPayload.content as InputJsonValue,
			user: {
				connect: {
					id: currentUser.id,
				},
			},
		};

		const application = await applicationsService.createApplication(payload);

		return ctx.json(application);
	},
);

applicationsController.patch(
	"/:applicationId",
	isAuthorized,
	isAdmin,
	zValidator("json", UpdateApplicationSchema),
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
				// biome-ignore lint/suspicious/noExplicitAny: <don't needed>
				content: payload.content as any,
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
