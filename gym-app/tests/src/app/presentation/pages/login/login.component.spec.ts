import { ComponentFixture, TestBed } from '@angular/core/testing';
import LoginPage from '../../../../../../src/app/presentation/pages/login/login.component';

describe('LoginPage', () => {
  const signInWithOAuth = vi.fn();

  let fixture: ComponentFixture<LoginPage>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    vi.clearAllMocks();
    signInWithOAuth.mockResolvedValue({ data: {}, error: null });

    await TestBed.configureTestingModule({
      imports: [LoginPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    // the client is built inside the component, so it is swapped for a fake one here
    Object.assign(fixture.componentInstance, { supabase: { auth: { signInWithOAuth } } });
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the welcome title', () => {
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Bem-vindo');
  });

  it('should render the three features', () => {
    const features = Array.from(compiled.querySelectorAll('.feature span')).map((feature) =>
      feature.textContent?.trim(),
    );

    expect(features).toEqual([
      'Visualize seus treinos do dia',
      'Acompanhe seu progresso',
      'Conecte-se com seu personal',
    ]);
  });

  it('should render the Google button', () => {
    expect(compiled.querySelector('.btn-google')?.textContent).toContain('Continuar com Google');
  });

  it('should not sign in before any click', () => {
    expect(signInWithOAuth).not.toHaveBeenCalled();
  });

  it('should sign in with Google when the button is clicked', () => {
    compiled.querySelector<HTMLButtonElement>('.btn-google')?.click();

    expect(signInWithOAuth).toHaveBeenCalledTimes(1);
    expect(signInWithOAuth).toHaveBeenCalledWith({ provider: 'google' });
  });

  it('should wait for the sign in to finish', async () => {
    let finished = false;
    signInWithOAuth.mockImplementation(async () => {
      await Promise.resolve();
      finished = true;
    });

    await fixture.componentInstance.signInWithGoogle();

    expect(finished).toBe(true);
  });
});
