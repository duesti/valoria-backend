import { Hono } from "hono";
import { config } from "./core/config";
import { docsRouter } from "./core/docs";
import { handleErrors } from "./middlewares/errors.middleware";
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

app.route("/api/v1", router);
app.route("/", docsRouter);

Bun.serve({
	fetch: app.fetch,
	hostname: "0.0.0.0",
	port: config?.PORT,
});
