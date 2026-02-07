import { Hono } from "hono";
import { applicationsController } from "@/src/modules/applications/applications.controller";
import { authController } from "@/src/modules/auth/auth.controller";
import { rolesController } from "@/src/modules/roles/roles.controller";
import { usersController } from "@/src/modules/users/users.controller";

const router = new Hono();
router.route("/auth", authController);
router.route("/users", usersController);
router.route("/roles", rolesController);
router.route("/applications", applicationsController);

export { router };
