import { TestBed } from '@angular/core/testing';
import { GymUser } from '../../../../../src/app/domain/entities/gym-user.entity';
import { GymUsersRepository } from '../../../../../src/app/domain/repositories/gym-users.repository';
import { CreateGymUserCase } from '../../../../../src/app/domain/usecases/create-gym-user.usecase';

describe('CreateGymUserCase', () => {
  const gymUsersRepository = {
    create: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    gymUsersRepository.create.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: GymUsersRepository, useValue: gymUsersRepository }],
    });
  });

  it('should be created with its repository', () => {
    expect(TestBed.inject(CreateGymUserCase)).toBeInstanceOf(CreateGymUserCase);
  });

  it('should not touch the repository on creation', () => {
    TestBed.inject(CreateGymUserCase);

    expect(gymUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should fail to be created without the repository', () => {
    TestBed.resetTestingModule();

    expect(() => TestBed.inject(CreateGymUserCase)).toThrow();
  });

  describe('execute', () => {
    it('should create a single gym user through the repository', () => {
      TestBed.inject(CreateGymUserCase).execute();

      expect(gymUsersRepository.create).toHaveBeenCalledTimes(1);
      expect(gymUsersRepository.create.mock.calls[0][0]).toBeInstanceOf(GymUser);
    });

    it('should create the user as a gym member', () => {
      TestBed.inject(CreateGymUserCase).execute();

      const user: GymUser = gymUsersRepository.create.mock.calls[0][0];

      expect(user.Type).toBe('gymMember');
      expect(user.isPersonalTrainer()).toBe(false);
    });

    it.todo('should create the user from the given input');
    it.todo('should wait for the repository to finish');
    it.todo('should reject when the repository fails');
  });
});
