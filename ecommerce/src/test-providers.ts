import { LOCALE_ID, type Provider } from '@angular/core';

// Mirrors the LOCALE_ID provider registered in app.config.ts so CurrencyPipe/DatePipe
// format the same way (pt-BR) under test as they do in the real app.
const providers: Provider[] = [{ provide: LOCALE_ID, useValue: 'pt-BR' }];

export default providers;
