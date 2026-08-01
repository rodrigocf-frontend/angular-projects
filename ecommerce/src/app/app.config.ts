import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { productsReducer } from './pages/products/store/products/products.reducers';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideHttpClient(),
    provideState({
      name: 'products',
      reducer: productsReducer,
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    ...environment.providers,
  ],
};
