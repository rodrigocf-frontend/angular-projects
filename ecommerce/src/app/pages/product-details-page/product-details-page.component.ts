import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsGalleryComponent } from './components/product-details-gallery/product-details-gallery.component';
import { ProductDetailsInfoComponent } from './components/product-details-info/product-details-info.component';
import { ProductDetailsRelatedComponent } from './components/product-details-related/product-details-related.component';
import { Store } from '@ngrx/store';
import { selectProduct } from './store/product-details.selectors';
import { AsyncPipe } from '@angular/common';
import { loadProduct } from './store/product-details.actions';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-product-details-page',
  imports: [
    BreadcrumbComponent,
    ProductDetailsGalleryComponent,
    ProductDetailsInfoComponent,
    ProductDetailsRelatedComponent,
    AsyncPipe,
  ],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export default class ProductDetailsPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  data$ = this.store.select(selectProduct);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap((params) => {
          const id = params.get('id');
          if (id) {
            this.store.dispatch(loadProduct({ id }));
          }
        }),
      )
      .subscribe();
  }
}
