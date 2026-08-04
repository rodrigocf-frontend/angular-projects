import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details-skeleton',
  imports: [],
  templateUrl: './product-details-skeleton.component.html',
  styleUrl: './product-details-skeleton.component.scss',
})
export class ProductDetailsSkeletonComponent {
  items = Array.from({ length: 4 });
  colors = Array.from({ length: 3 });
  sizes = Array.from({ length: 5 });
  perks = Array.from({ length: 3 });
}
