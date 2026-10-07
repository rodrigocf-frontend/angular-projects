import { inject, Injectable } from '@angular/core';
import { GymUsersRepository } from '../repositories/gym-users.repository';
import { GymUser } from '../entities/gym-user.entity';

@Injectable({ providedIn: 'root' })
export class CreateGymUserCase {
  private gymUserRepository = inject(GymUsersRepository);

  async execute() {
    await this.gymUserRepository.create(
      new GymUser({
        cpf: '00000000000',
        email: 'aluno@email.com',
        name: 'aluno',
        type: 'gymMember',
      }),
    );
  }
}
