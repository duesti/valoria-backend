import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";

import { AppError, InternalServerError } from "@/src/core/errors";
import { logger } from "@/src/core/utils/logger";

const handleErrors = async (err: Error | HTTPResponseError, ctx: Context) => {
	let currentError: AppError;

	if (err instanceof AppError) {
		currentError = err;
	} else if (err instanceof Error) {
		logger.error(`Unhandled error: ${err.message}`);
		currentError = new InternalServerError();
	} else {
		logger.error("FATAL! Unknown error");
		currentError = new InternalServerError();
	}

	const statusCode = currentError.statusCode;
	ctx.status(statusCode as StatusCode);

	logger.error(currentError.message);

	return ctx.json({
		status_code: currentError.statusCode,
		message: currentError.message,
		code: currentError.code,
	});
};

export { handleErrors };
