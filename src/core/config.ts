import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
	PORT: z.string().default("3030").transform(Number),

	DATABASE_URL: z.string().min(1, {
		message: "Путь к базе данных указан не верно",
	}),

	ACCESS_SECRET: z.string().min(12, {
		message: "Access secret слишком слаб",
	}),
	REFRESH_SECRET: z.string().min(12, {
		message: "Refresh secret слишком слаб",
	}),

	CLIENT_ID: z.string().min(1, {
		message: "Ид клиента дискорд oauth указан не верно",
	}),
	CLIENT_SECRET: z.string().min(1, {
		message: "Секрет клиента дискорд oauth указан не верно",
	}),
	FRONTEND_URL: z.string().url(),
});

const validationResult = envSchema.safeParse(Bun.env);

if (!validationResult.success) {
	console.error(`Ошибка валидации конфига: ${validationResult.error.issues}`);
}

export const config = validationResult.data;
