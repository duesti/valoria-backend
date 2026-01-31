import { Hono } from "hono";

import { applicationsController } from "./modules/applications/applications.controller";
import { authController } from "./modules/auth/auth.controller";
import { rolesController } from "./modules/roles/roles.controller";
import { usersController } from "./modules/users/users.controller";

const router = new Hono();
router.route("/auth", authController);
router.route("/users", usersController);
router.route("/roles", rolesController);
router.route("/applications", applicationsController);

export { router };
