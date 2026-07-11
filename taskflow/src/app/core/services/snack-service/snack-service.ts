import { Injectable, signal } from '@angular/core';

// shared/services/snackbar.service.ts
export interface Snack {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  current = signal<Snack | null>(null);
  visible = signal(false);

  private timer: ReturnType<typeof setTimeout> = 0;

  show(type: Snack['type'], message: string, duration = 3500) {
    clearTimeout(this.timer);
    this.current.set({ type, message });
    this.visible.set(true);
    this.timer = setTimeout(() => this.dismiss(), duration);
  }

  success(message: string) {
    this.show('success', message);
  }
  error(message: string) {
    this.show('error', message);
  }
  warning(message: string) {
    this.show('warning', message);
  }
  info(message: string) {
    this.show('info', message);
  }

  dismiss() {
    this.visible.set(false);
    setTimeout(() => this.current.set(null), 200);
  }
}
