import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Test simple : Créer et récupérer un webinaire
  const webinar = await prisma.webinar.create({
    data: {
      title: 'Test Webinar',
      startDate: new Date(),
      endDate: new Date(),
      seats: 50,
      organizerId: 'organizer-id',
    },
  });
  console.log('Webinar created:', webinar);

  const fetchedWebinar = await prisma.webinar.findUnique({
    where: { id: webinar.id },
  });
  console.log('Fetched Webinar:', fetchedWebinar);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
