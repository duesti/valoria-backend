class Logger {
	info(message: string) {
		console.info(`[INFO] ${(new Date()).toUTCString()} - ${message}`);
	}

	warn(message: string) {
		console.info(`[WARN] ${(new Date()).toUTCString()} - ${message}`);
	}

	error(message: string) {
		console.info(`[ERROR] ${(new Date()).toUTCString()} - ${message}`);
	}
}

export const logger = new Logger();
