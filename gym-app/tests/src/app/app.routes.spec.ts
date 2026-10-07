import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../src/app/app.routes';
import HomePage from '../../../src/app/presentation/pages/home/home.component';
import LoginPage from '../../../src/app/presentation/pages/login/login.component';

describe('routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should load the home page on /home', async () => {
    expect(await harness.navigateByUrl('/home')).toBeInstanceOf(HomePage);
  });

  it('should load the login page on /login', async () => {
    expect(await harness.navigateByUrl('/login')).toBeInstanceOf(LoginPage);
  });

  it('should redirect the root path to /home', async () => {
    expect(await harness.navigateByUrl('/')).toBeInstanceOf(HomePage);
    expect(TestBed.inject(Router).url).toBe('/home');
  });

  it('should redirect an unknown path to /home', async () => {
    expect(await harness.navigateByUrl('/unknown/path')).toBeInstanceOf(HomePage);
    expect(TestBed.inject(Router).url).toBe('/home');
  });
});
