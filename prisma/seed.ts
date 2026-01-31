import { prisma } from "../src/core/db";

async function seed() {
	const userRole = await prisma.role.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			name: "Пользователь",
			admin: false,
		},
	});

	const adminRole = await prisma.role.upsert({
		where: { id: 2 },
		update: {},
		create: {
			id: 2,
			name: "Админ",
			admin: true,
		},
	});

	console.log(
    "Seed: созданные/обновленные роли: ", { userRole, adminRole }
  );
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e)
    }
    await prisma.$disconnect()
    process.exit(1)
  })