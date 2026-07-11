import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Icon, IconKey } from '../icon/icon';
import { SnackbarService } from '../../../../core/services/snack-service/snack-service';

@Component({
  selector: 'app-snackbar',
  imports: [NgClass, Icon],
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

  snackIcon(): IconKey {
    switch (this.current()!.type) {
      case 'success':
        return 'check';
      case 'error':
        return 'alert';
      case 'info':
        return 'circle-info';
      case 'warning':
        return 'triangle-exclamation';
    }
  }
}
