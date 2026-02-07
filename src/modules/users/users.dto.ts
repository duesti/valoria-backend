import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string(),
	discord_id: z.string(),
	description: z.string().optional(),
	role_id: z.number().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const updateUserRoleSchema = z.object({
	role_id: z.number(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
