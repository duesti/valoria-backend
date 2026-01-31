import { Hono } from "hono";
import { config } from "./core/config";
import { router } from "./routes";

export type AppEnv = {
	Variables: {
		user: {
			id: number;
		};
		role_id: number;
		isAdmin: boolean;
	}
}

const app = new Hono();
app.route("/api/v1", router);

Bun.serve({
	fetch: app.fetch,
	port: config?.PORT,
});
