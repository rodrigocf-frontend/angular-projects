import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
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

// @angular/common/locales/pt é a variante brasileira nos dados do CLDR
// (pt-PT é que fica em um arquivo separado para a variante europeia).
registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
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
