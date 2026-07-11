import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snack-service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no current snack and not visible', () => {
    expect(service.current()).toBeNull();
    expect(service.visible()).toBe(false);
  });

  it('show() should set current snack and make it visible', () => {
    service.show('success', 'Operação concluída');
    expect(service.current()).toEqual({ type: 'success', message: 'Operação concluída' });
    expect(service.visible()).toBe(true);
  });

  it('success() should show a success snack', () => {
    service.success('Salvo!');
    expect(service.current()?.type).toBe('success');
    expect(service.current()?.message).toBe('Salvo!');
  });

  it('error() should show an error snack', () => {
    service.error('Connection Error');
    expect(service.current()?.type).toBe('error');
    expect(service.current()?.message).toBe('Connection Error');
  });

  it('warning() should show a warning snack', () => {
    service.warning('Atenção!');
    expect(service.current()?.type).toBe('warning');
  });

  it('info() should show an info snack', () => {
    service.info('Informação');
    expect(service.current()?.type).toBe('info');
  });

  it('dismiss() should hide the snack immediately', () => {
    service.success('Teste');
    service.dismiss();
    expect(service.visible()).toBe(false);
  });

  it('should auto-dismiss after the default duration', () => {
    vi.useFakeTimers();
    service.show('info', 'Auto', 3500);
    expect(service.visible()).toBe(true);
    vi.advanceTimersByTime(3500);
    expect(service.visible()).toBe(false);
    vi.useRealTimers();
  });

  it('calling show() twice should reset the timer', () => {
    vi.useFakeTimers();
    service.show('success', 'Primeiro', 3500);
    vi.advanceTimersByTime(2000);
    service.show('success', 'Segundo', 3500);
    vi.advanceTimersByTime(2000);
    expect(service.visible()).toBe(true);
    vi.advanceTimersByTime(1500);
    expect(service.visible()).toBe(false);
    vi.useRealTimers();
  });
});
