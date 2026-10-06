import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GymUsersRepository } from './domain/repositories/gym-users.repository';
import { SupabaseGymUsersRepositoryImpl } from './data/repositories/supabase-gym-user-repository-impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: GymUsersRepository, useClass: SupabaseGymUsersRepositoryImpl },
  ],
};
