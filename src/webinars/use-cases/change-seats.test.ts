import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';
import { testUser } from 'src/users/tests/user-seeds';
import { Webinar } from 'src/webinars/entities/webinar.entity';

describe('Change seats - Unit Tests', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;

  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: testUser.alice.props.id, // Lié correctement à l'organisateur
    title: 'Test Webinar',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600 * 1000), // Une heure après
    seats: 100,
  });

  beforeEach(() => {
    // ARRANGE : Initialiser les dépendances
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(webinarRepository);
  });

  it('should allow the organizer to change the number of seats', async () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 200,
    };

    // ACT : Appeler le use-case
    await useCase.execute(payload);

    // ASSERT : Vérifier que le nombre de sièges a changé
    const updatedWebinar = await webinarRepository.findById('webinar-id');
    expect(updatedWebinar?.props.seats).toEqual(200);
  });

  it('should throw an error if the user is not the organizer', async () => {
    const payload = {
      user: testUser.bob, // Pas l’organisateur
      webinarId: 'webinar-id',
      seats: 200,
    };

    // ACT & ASSERT : Vérifier que l’exception est levée
    await expect(useCase.execute(payload)).rejects.toThrowError(
      'User is not the organizer',
    );
  });

  it('should verify the organizer', async () => {
    const webinar = await webinarRepository.findById('webinar-id');
    expect(webinar?.isOrganizer(testUser.alice)).toBe(true); // Alice est l’organisatrice
    expect(webinar?.isOrganizer(testUser.bob)).toBe(false); // Bob ne l'est pas
  });

  it('should not allow reducing the number of seats', async () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 50, // Réduction du nombre de sièges
    };

    // ACT & ASSERT : Vérifier que l’exception est levée
    await expect(useCase.execute(payload)).rejects.toThrowError(
      'Seats cannot be decreased',
    );
  });

  it('should throw an error if the number of seats exceeds 1000', async () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 1500, // Trop de sièges
    };

    // ACT & ASSERT : Vérifier que l’exception est levée
    await expect(useCase.execute(payload)).rejects.toThrowError(
      'Seats cannot exceed 1000',
    );
  });
});
