import { z } from "zod";

export const applicationContentSchema = z.object({
	name: z.string(),
	age: z.string(),
	bio: z.string(),
});

export const createApplicationSchema = z.object({
	author_id: z.number(),
	content: applicationContentSchema,
	status: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export type CreateApplicationDTO = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDTO = z.infer<typeof updateApplicationSchema>;
