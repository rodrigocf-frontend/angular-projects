import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading-service/loading-service';

@Component({
  selector: 'app-loading-overlay',
  imports: [],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss',
})
export class LoadingOverlay {
  private loadingService = inject(LoadingService);

  isLoading = this.loadingService.isLoading;
}
