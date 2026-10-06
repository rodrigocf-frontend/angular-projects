import { GymUser } from '../../domain/entities/gym-user.entity';
import { GymUserDTO } from '../models/gym-user.dto';

export class GymUserMapper {
  static toEntity(data: GymUser): GymUserDTO {
    return {
      name: data.Name,
      email: data.Email,
      type: data.Type,
      cpf: data.CPF,
    };
  }
}
