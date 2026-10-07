import { TestBed } from '@angular/core/testing';
import { SupabaseGymUsersRepositoryImpl } from '../../../../../src/app/data/repositories/supabase-gym-user-repository-impl';
import { GymUser } from '../../../../../src/app/domain/entities/gym-user.entity';
import {
  GymUserAlreadyExistsError,
  GymUserPersistenceError,
} from '../../../../../src/app/domain/errors/gym-user.errors';
import { GymUsersRepository } from '../../../../../src/app/domain/repositories/gym-users.repository';

describe('SupabaseGymUsersRepositoryImpl', () => {
  const insert = vi.fn();
  const from = vi.fn(() => ({ insert }));

  let repository: GymUsersRepository;

  const user = new GymUser({
    name: 'John',
    email: 'john@gym.com',
    cpf: '12345678901',
    type: 'gymMember',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    insert.mockResolvedValue({ data: null, error: null });

    TestBed.configureTestingModule({
      providers: [{ provide: GymUsersRepository, useClass: SupabaseGymUsersRepositoryImpl }],
    });

    repository = TestBed.inject(GymUsersRepository);
    // the client is built inside the repository, so it is swapped for a fake one here
    Object.assign(repository, { supabase: { from } });
  });

  it('should be provided as the GymUsersRepository', () => {
    expect(repository).toBeInstanceOf(SupabaseGymUsersRepositoryImpl);
  });

  describe('create', () => {
    it('should insert into the tb_gym_users table', async () => {
      await repository.create(user);

      expect(from).toHaveBeenCalledTimes(1);
      expect(from).toHaveBeenCalledWith('tb_gym_users');
    });

    it('should insert the mapped user', async () => {
      await repository.create(user);

      expect(insert).toHaveBeenCalledWith([
        { name: 'John', email: 'john@gym.com', cpf: '12345678901', type: 'gymMember' },
      ]);
    });

    it('should resolve with nothing', async () => {
      await expect(repository.create(user)).resolves.toBeUndefined();
    });

    it('should reject with GymUserAlreadyExistsError on a unique violation', async () => {
      insert.mockResolvedValue({ data: null, error: { code: '23505', message: 'duplicate key' } });

      await expect(repository.create(user)).rejects.toBeInstanceOf(GymUserAlreadyExistsError);
    });

    it('should reject with GymUserPersistenceError on any other error', async () => {
      insert.mockResolvedValue({ data: null, error: { code: '42501', message: 'rls' } });

      await expect(repository.create(user)).rejects.toBeInstanceOf(GymUserPersistenceError);
    });

    it('should keep the supabase error as the cause', async () => {
      const error = { code: '42501', message: 'rls' };
      insert.mockResolvedValue({ data: null, error });

      await expect(repository.create(user)).rejects.toHaveProperty('cause', error);
    });
  });
});
