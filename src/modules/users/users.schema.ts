import { z } from "zod";

interface CreateUserInput {
	discord_id: string;
	name: string;
}

interface UpdateUserInput {
	name?: string;
	description?: string;
	role_id?: number;
}

const UpdateUserSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
});

const UpdateUserRoleSchema = z.object({
	role_id: z.number(),
});

export type { CreateUserInput, UpdateUserInput };
export { UpdateUserSchema, UpdateUserRoleSchema };
