import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { productsReducer } from './pages/products/store/products/products.reducer';
export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideState({
      name: 'products',
      reducer: productsReducer,
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
