import { envSchema } from "./env.dto";

const validation = envSchema.safeParse(Bun.env);

if (!validation.success) {
	console.error("Ошибка валидации конфига");
}

export const config = {
	app: {
		port: validation.data?.PORT,
		frontendUrl: validation.data?.FRONTEND_URL,
		nodeEnv: validation.data?.NODE_ENV
	},
	db: {
		dbUrl: validation.data?.DATABASE_URL,
	},
	ouath2: {
		clientId: validation.data?.CLIENT_ID,
		clientSecret: validation.data?.CLIENT_SECRET,
	},
	jwt: {
		accessSecret: validation.data?.ACCESS_SECRET,
		refreshSecret: validation.data?.REFRESH_SECRET,
	}
};
