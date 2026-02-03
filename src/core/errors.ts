class AppError extends Error {
	constructor(
		public statusCode: number,
		public override message: string,
		public code: string,
	) {
		super(message);
		this.name = "AppError";
	}
}

class NotFoundError extends AppError {
	constructor(message: string = "Запрашиваемая информация не найдена") {
		super(404, message, "NOT_FOUND");
	}
}

class ForbiddenError extends AppError {
	constructor(message: string = "Недостаточно прав") {
		super(403, message, "FORBIDDEN");
	}
}

class AuthError extends AppError {
	constructor(message: string = "Неавторизован") {
		super(401, message, "UNAUTHORIZED");
	}
}

class InternalServerError extends AppError {
	constructor(message: string = "Внутренняя ошибка сервера") {
		super(500, message, "INTERNAL_SERVER_ERROR");
	}
}

export {
	AppError,
	NotFoundError,
	ForbiddenError,
	InternalServerError,
	AuthError,
};
