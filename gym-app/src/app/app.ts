import { Component, inject } from '@angular/core';
import { CreateGymUserCase } from './domain/usecases/create-gym-user.usecase';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected service = inject(CreateGymUserCase);

  async login() {
    await this.service.execute();
  }

  async user() {}
}
