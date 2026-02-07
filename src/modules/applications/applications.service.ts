import { prisma } from "@/src/infra/prisma";

import type {
	CreateApplicationDTO,
	UpdateApplicationDTO,
} from "./applications.dto";
import {
	createApplicationSchema,
	updateApplicationSchema,
} from "./applications.dto";

export class ApplicationsService {
	async createApplication(data: CreateApplicationDTO) {
		const validData = createApplicationSchema.parse(data)

		const application = await prisma.application.create({
			data: {
				...validData,
			},
		});

		return application;
	}

	async getApplication(applicationId: number) {
		const application = await prisma.application.findUnique({
			where: { id: applicationId },
		});

		return application;
	}

	async updateApplication(
		applicationId: number,
		data: UpdateApplicationDTO,
		isAdmin: boolean,
	) {
		const validData = { ...updateApplicationSchema.parse(data) };

		if (!isAdmin) {
			delete validData.status;
		}

		const application = await prisma.application.update({
			where: { id: applicationId },
			data: {
				...validData,
			},
		});

		return application;
	}

	async getAllApplications() {
		const applications = await prisma.application.findMany();

		return applications;
	}

	async deleteApplication(applicationId: number) {
		const application = await prisma.application.delete({
			where: { id: applicationId },
		});

		return application;
	}
}

export const applicationsService = new ApplicationsService();
