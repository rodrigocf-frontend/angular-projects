import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-product-details-not-found',
  imports: [ButtonComponent],
  templateUrl: './product-details-not-found.component.html',
  styleUrl: './product-details-not-found.component.scss',
})
export class ProductDetailsNotFoundComponent {
  private router = inject(Router);

  goToProducts() {
    this.router.navigate(['/product/all']);
  }
  goHome() {
    this.router.navigate(['/']);
  }
}
