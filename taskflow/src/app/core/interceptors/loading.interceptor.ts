import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading-service/loading-service';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  loadingService.start();
  return next(req).pipe(finalize(() => loadingService.stop()));
};
