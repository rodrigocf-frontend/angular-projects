import { TestBed } from '@angular/core/testing';
import { App } from '../../../src/app/app';
import { CreateGymUserCase } from '../../../src/app/domain/usecases/create-gym-user.usecase';

describe('App', () => {
  const createGymUserCase = {
    execute: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: CreateGymUserCase, useValue: createGymUserCase }],
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
});
