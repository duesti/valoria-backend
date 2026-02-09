import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";
import { config } from "@/src/core/config/config";
import { handleErrors } from "@/src/middlewares/errors.middleware";
import { logger } from "./core/utils/logger";
import { router } from "./routes";

export type AppEnv = {
	Variables: {
		user: {
			id: number;
		};
		role_id: number;
		isAdmin: boolean;
	};
};

const app = new Hono();

app.onError(handleErrors);
app.get(
	"/health",
	describeRoute({
		description: "Проверка здоровья сервера",
	}),
	async (ctx) => {
		return ctx.json({
			status: "ok",
		});
	},
);

app.route("/api/v1", router);

app.get(
	"/openapi",
	openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "Valoria backend",
				version: "1.0.0",
				description: "Бекенд для взаимодействия с сайтом",
			},
			servers: [
				{
					url: "http://localhost:3030",
					description: "Локальный сервер",
				},
			],
		},
	}),
);

app.get("/docs", swaggerUI({ url: "/openapi" }));

const server = Bun.serve({
	fetch: app.fetch,
	hostname: "0.0.0.0",
	port: config.app.port,
});

if (server) {
	logger.success(`Сервер запущен на ${config.app.port} порту.`);
}
