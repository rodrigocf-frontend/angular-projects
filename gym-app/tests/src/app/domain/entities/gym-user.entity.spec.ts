import { GymUser } from '../../../../../src/app/domain/entities/gym-user.entity';

describe('GymUser', () => {
  it('should expose the data it was created with', () => {
    const user = new GymUser({
      id: '1',
      name: 'John',
      email: 'john@gym.com',
      cpf: '12345678901',
      type: 'gymMember',
      personalTrainerId: '2',
    });

    expect(user.Name).toBe('John');
    expect(user.Email).toBe('john@gym.com');
    expect(user.CPF).toBe('12345678901');
    expect(user.Type).toBe('gymMember');
  });

  it('should be created without id and personalTrainerId', () => {
    const user = new GymUser({
      name: 'Mary',
      email: 'mary@gym.com',
      cpf: '10987654321',
      type: 'personalTrainer',
    });

    expect(user.Name).toBe('Mary');
    expect(user.Type).toBe('personalTrainer');
  });

  describe('isPersonalTrainer', () => {
    it('should return true for a personal trainer', () => {
      const user = new GymUser({
        name: 'Mary',
        email: 'mary@gym.com',
        cpf: '10987654321',
        type: 'personalTrainer',
      });

      expect(user.isPersonalTrainer()).toBe(true);
    });

    it('should return false for a gym member', () => {
      const user = new GymUser({
        name: 'John',
        email: 'john@gym.com',
        cpf: '12345678901',
        type: 'gymMember',
        personalTrainerId: '2',
      });

      expect(user.isPersonalTrainer()).toBe(false);
    });
  });
});
