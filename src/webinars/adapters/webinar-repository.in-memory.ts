import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

export class InMemoryWebinarRepository implements IWebinarRepository {
  constructor(public database: Webinar[] = []) {}

  async findById(id: string): Promise<Webinar | null> {
    const webinar = this.database.find((webinar) => webinar.props.id === id);
    return webinar ? new Webinar(webinar.props) : null;
  }

  async save(webinar: Webinar): Promise<void> {
    const index = this.database.findIndex(
      (w) => w.props.id === webinar.props.id,
    );
    if (index !== -1) {
      this.database[index] = webinar;
    } else {
      this.database.push(webinar);
    }
    webinar.commit();
  }

  async create(webinar: Webinar): Promise<void> {
    await this.save(webinar); // Unifie la logique avec save
  }

  async update(webinar: Webinar): Promise<void> {
    await this.save(webinar); // Unifie la logique avec save
  }
}
