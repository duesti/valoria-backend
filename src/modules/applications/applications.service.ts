import type {
	ApplicationCreateInput,
	ApplicationUpdateInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../core/db";

export class ApplicationsService {
	async createApplication(data: ApplicationCreateInput) {
		const application = await prisma.application.create({
			data: {
				...data,
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
		data: ApplicationUpdateInput,
		isAdmin: boolean,
	) {
		const updateData = { ...data };

		if (!isAdmin) {
			delete updateData.status;
		}

		const application = await prisma.application.update({
			where: { id: applicationId },
			data: {
				...updateData,
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
