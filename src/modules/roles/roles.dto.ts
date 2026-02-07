import { z } from "zod";

export const createRoleSchema = z.object({
	name: z.string(),
	admin: z.boolean(),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
