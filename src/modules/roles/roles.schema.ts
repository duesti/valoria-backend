import { z } from "zod";

interface CreateRoleInput {
	name: string;
	admin: boolean;
}

interface UpdateRoleInput {
	name?: string;
	admin?: boolean;
}

const UpdateRoleSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Название слишком короткое",
		})
		.optional(),
	admin: z.boolean().optional(),
});

const CreateRoleSchema = z.object({
	name: z.string().min(1, { message: "Название слишком короткое" }),
	admin: z.boolean().default(false),
});

export type { CreateRoleInput, UpdateRoleInput };
export { UpdateRoleSchema, CreateRoleSchema };
