import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading-service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start as not loading', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('start() should set isLoading to true', () => {
    service.start();
    expect(service.isLoading()).toBe(true);
  });

  it('stop() should set isLoading to false', () => {
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('two start() calls should keep isLoading true', () => {
    service.start();
    service.start();
    expect(service.isLoading()).toBe(true);
  });

  it('two start() calls require two stop() calls to clear loading', () => {
    service.start();
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(true);
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('stop() when not loading should not throw and should stay false', () => {
    expect(() => service.stop()).not.toThrow();
    expect(service.isLoading()).toBe(false);
  });
});
