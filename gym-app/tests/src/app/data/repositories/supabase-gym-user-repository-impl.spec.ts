import { TestBed } from '@angular/core/testing';
import { SupabaseGymUsersRepositoryImpl } from '../../../../../src/app/data/repositories/supabase-gym-user-repository-impl';
import { GymUser } from '../../../../../src/app/domain/entities/gym-user.entity';
import { GymUsersRepository } from '../../../../../src/app/domain/repositories/gym-users.repository';

describe('SupabaseGymUsersRepositoryImpl', () => {
  const select = vi.fn();
  const insert = vi.fn(() => ({ select }));
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
    select.mockResolvedValue({ data: [], error: null });

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

    it.todo('should reject when supabase returns an error');
  });
});
