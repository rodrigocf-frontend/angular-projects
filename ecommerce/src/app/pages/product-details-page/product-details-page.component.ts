import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsGalleryComponent } from './components/product-details-gallery/product-details-gallery.component';
import { ProductDetailsInfoComponent } from './components/product-details-info/product-details-info.component';
import { ProductDetailsRelatedComponent } from './components/product-details-related/product-details-related.component';

@Component({
  selector: 'app-product-details-page',
  imports: [
    BreadcrumbComponent,
    ProductDetailsGalleryComponent,
    ProductDetailsInfoComponent,
    ProductDetailsRelatedComponent,
  ],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export default class ProductDetailsPageComponent {}
