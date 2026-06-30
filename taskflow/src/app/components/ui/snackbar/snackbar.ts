import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../services/snack-service/snack-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  imports: [NgClass],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',
})
export class Snackbar {
  private snackbarService = inject(SnackbarService);

  current = this.snackbarService.current.asReadonly();
  visible = this.snackbarService.visible.asReadonly();

  dismiss() {
    this.snackbarService.dismiss();
  }
}
