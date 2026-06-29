import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loading = signal(false);

  readonly isLoading = this.loading.asReadonly();

  start(): void {
    this.loading.set(true);
  }

  stop(): void {
    this.loading.set(false);
  }
}
