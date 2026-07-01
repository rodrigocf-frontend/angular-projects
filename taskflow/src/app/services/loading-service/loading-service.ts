import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loading = signal(false);

  readonly isLoading = this.loading.asReadonly();

  start(): void {
    if (!this.loading()) {
      this.loading.set(true);
    }
  }

  stop(): void {
    if (this.isLoading()) {
      this.loading.set(false);
    }
  }
}
