import { z } from "zod";

const UpdateApplicationSchema = z.object({
	content: z.json().optional(),
	status: z.string().optional(),
});

const CreateApplicationSchema = z.object({
	content: z.json(),
})

export { UpdateApplicationSchema, CreateApplicationSchema };
