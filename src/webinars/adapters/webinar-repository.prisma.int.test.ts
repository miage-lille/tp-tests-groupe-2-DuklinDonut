import { PrismaClient } from '@prisma/client';
import { PrismaWebinarRepository } from 'src/webinars/adapters/webinar-repository.prisma';
import { Webinar } from 'src/webinars/entities/webinar.entity';

const prisma = new PrismaClient();

describe('PrismaWebinarRepository - Integration Tests', () => {
  let repository: PrismaWebinarRepository;

  beforeAll(async () => {
    repository = new PrismaWebinarRepository();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.webinar.deleteMany(); // Nettoyer la table après les tests
    await prisma.$disconnect();
  });

  it('should create and retrieve a webinar', async () => {
    // Arrange
    const webinar = new Webinar({
      id: 'test-id',
      title: 'Test Webinar',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600 * 1000),
      seats: 100,
      organizerId: 'test-organizer',
    });

    // Act
    await repository.create(webinar);
    const retrievedWebinar = await repository.findById('test-id');

    // Assert
    expect(retrievedWebinar).not.toBeNull();
    expect(retrievedWebinar?.props).toEqual(webinar.props);
  });
});
