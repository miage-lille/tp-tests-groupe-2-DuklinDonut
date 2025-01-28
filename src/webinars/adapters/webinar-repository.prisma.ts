import { PrismaClient } from '@prisma/client';
import { Webinar } from 'src/webinars/entities/webinar.entity';

export class PrismaWebinarRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(webinar: Webinar): Promise<void> {
    await this.prisma.webinar.create({
      data: {
        id: webinar.id,
        title: webinar.title,
        startDate: webinar.startDate,
        endDate: webinar.endDate,
        seats: webinar.seats,
        organizerId: webinar.organizerId,
      },
    });
  }

  async findById(id: string): Promise<Webinar | null> {
    const prismaWebinar = await this.prisma.webinar.findUnique({
      where: { id },
    });

    if (!prismaWebinar) return null;

    return new Webinar({
      id: prismaWebinar.id,
      title: prismaWebinar.title,
      startDate: prismaWebinar.startDate,
      endDate: prismaWebinar.endDate,
      seats: prismaWebinar.seats,
      organizerId: prismaWebinar.organizerId,
    });
  }
}
