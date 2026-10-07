import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { App } from '../../../src/app/app';
import {
  GymUserAlreadyExistsError,
  GymUserPersistenceError,
} from '../../../src/app/domain/errors/gym-user.errors';
import { CreateGymUserCase } from '../../../src/app/domain/usecases/create-gym-user.usecase';

describe('App', () => {
  const createGymUserCase = {
    execute: vi.fn(),
  };
  const snackBar = {
    open: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    createGymUserCase.execute.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: CreateGymUserCase, useValue: createGymUserCase },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the login and user buttons', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = Array.from(compiled.querySelectorAll('button')).map((button) =>
      button.textContent?.trim(),
    );
    expect(labels).toEqual(['login', 'user']);
  });

  it('should not create a gym user before any click', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(createGymUserCase.execute).not.toHaveBeenCalled();
  });

  it('should create a gym user when login is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll('button')[0].click();
    expect(createGymUserCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should not create a gym user when user is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelectorAll('button')[1].click();
    expect(createGymUserCase.execute).not.toHaveBeenCalled();
  });

  describe('login', () => {
    it('should not open the snackbar when the user is created', async () => {
      const fixture = TestBed.createComponent(App);

      await fixture.componentInstance.login();

      expect(snackBar.open).not.toHaveBeenCalled();
    });

    it('should show the error message when the user already exists', async () => {
      createGymUserCase.execute.mockRejectedValue(new GymUserAlreadyExistsError());
      const fixture = TestBed.createComponent(App);

      await fixture.componentInstance.login();

      expect(snackBar.open).toHaveBeenCalledWith('Usuário já existe.', 'Fechar', {
        duration: 5000,
      });
    });

    it('should show the error message when persistence fails', async () => {
      createGymUserCase.execute.mockRejectedValue(new GymUserPersistenceError());
      const fixture = TestBed.createComponent(App);

      await fixture.componentInstance.login();

      expect(snackBar.open).toHaveBeenCalledWith('Erro de persistência.', 'Fechar', {
        duration: 5000,
      });
    });

    it('should show a generic message and log an unexpected error', async () => {
      const error = new Error('boom');
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      createGymUserCase.execute.mockRejectedValue(error);
      const fixture = TestBed.createComponent(App);

      await fixture.componentInstance.login();

      expect(snackBar.open).toHaveBeenCalledWith('Erro inesperado.', 'Fechar', { duration: 5000 });
      expect(consoleError).toHaveBeenCalledWith(error);
      consoleError.mockRestore();
    });
  });
});
