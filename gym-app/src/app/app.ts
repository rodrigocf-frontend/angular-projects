import { Component, inject } from '@angular/core';
import { CreateGymUserCase } from './domain/usecases/create-gym-user.usecase';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GymUserAlreadyExistsError,
  GymUserPersistenceError,
} from './domain/errors/gym-user.errors';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected service = inject(CreateGymUserCase);
  private _snackBar = inject(MatSnackBar);

  async login() {
    try {
      await this.service.execute();
    } catch (e) {
      const isDomainError =
        e instanceof GymUserAlreadyExistsError || e instanceof GymUserPersistenceError;
      const message = isDomainError ? e.message : 'Erro inesperado.';
      if (!isDomainError) console.error(e);
      this._snackBar.open(message, 'Fechar', { duration: 5000 });
    }
  }

  async user() {}
}
