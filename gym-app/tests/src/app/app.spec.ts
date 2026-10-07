import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from '../../../src/app/app';

describe('App', () => {
  const getSession = vi.fn();
  const session = { data: { session: null }, error: null };

  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    vi.clearAllMocks();
    getSession.mockResolvedValue(session);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    // the client is built inside the component, so it is swapped for a fake one here
    Object.assign(fixture.componentInstance, { supabase: { auth: { getSession } } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should not read the session before init', () => {
    expect(getSession).not.toHaveBeenCalled();
  });

  it('should read the session once on init', async () => {
    await fixture.whenStable();

    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('should log the session', async () => {
    await fixture.whenStable();

    await vi.waitFor(() => expect(console.log).toHaveBeenCalledWith(session));
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log the error when reading the session fails', async () => {
    const error = new Error('failed');
    getSession.mockRejectedValue(error);

    await fixture.whenStable();

    await vi.waitFor(() => expect(console.error).toHaveBeenCalledWith(error));
    expect(console.log).not.toHaveBeenCalled();
  });
});
