import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { provideState, provideStore } from '@ngrx/store';
import {
  cartReducers,
  PRODUCT_CART_STORE_KEY,
} from './pages/product-cart-page/store/product-cart.reducers';
import { provideEffects } from '@ngrx/effects';
import { ProductCartEffects } from './pages/product-cart-page/store/product-cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideState({
      name: PRODUCT_CART_STORE_KEY,
      reducer: cartReducers,
    }),
    provideEffects(ProductCartEffects),
    ...environment.providers,
  ],
};
