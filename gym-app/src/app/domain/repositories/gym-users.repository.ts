import { GymUser } from '../entities/gym-user.entity';

export abstract class GymUsersRepository {
  abstract create(data: GymUser): Promise<void>;
}
