import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userId = signal(1);
  userIdentification = this.userId.asReadonly();
}
