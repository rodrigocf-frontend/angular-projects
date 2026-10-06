import { GymUserMapper } from '../../../../../src/app/data/mappers/gym-user.mapper';
import { GymUser } from '../../../../../src/app/domain/entities/gym-user.entity';

describe('GymUserMapper', () => {
  describe('toEntity', () => {
    it('should map a gym member to its table row', () => {
      const user = new GymUser({
        name: 'John',
        email: 'john@gym.com',
        cpf: '12345678901',
        type: 'gymMember',
      });

      expect(GymUserMapper.toEntity(user)).toEqual({
        name: 'John',
        email: 'john@gym.com',
        cpf: '12345678901',
        type: 'gymMember',
      });
    });

    it('should map a personal trainer to its table row', () => {
      const user = new GymUser({
        name: 'Mary',
        email: 'mary@gym.com',
        cpf: '10987654321',
        type: 'personalTrainer',
      });

      expect(GymUserMapper.toEntity(user).type).toBe('personalTrainer');
    });

    it('should not send id to the table', () => {
      const user = new GymUser({
        id: '1',
        name: 'John',
        email: 'john@gym.com',
        cpf: '12345678901',
        type: 'gymMember',
      });

      expect(GymUserMapper.toEntity(user)).not.toHaveProperty('id');
    });

    it.todo('should map personalTrainerId');
  });
});
