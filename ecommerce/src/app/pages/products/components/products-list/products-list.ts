import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';
import { AsyncPipe } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { orderBy } from 'lodash-es';
import { map, tap } from 'rxjs';

export enum ListOrder {
  relevance,
  minor_price,
  major_price,
  newest,
}

@Component({
  selector: 'app-products-list',
  imports: [AsyncPipe],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  private productsFilterService = inject(ProductFilterService);
  orderedby = input.required<ListOrder>();
  products = signal<Product[]>([]);
  productsFiltered$ = this.productsFilterService.productsFiltered$.pipe(
    map((product) => this.orderProductsBy(product)),
    tap((e) => this.products.set(e)),
  );

  constructor() {
    effect(() => {
      const k = this.orderedby();
      if (k) {
        this.productsFiltered$.pipe(map((product) => this.orderProductsBy(product))).subscribe();
      }
    });
  }
  getSizes(product: Product): string[] {
    const sizes = new Set<string>();
    product.variants.forEach((variant) => {
      variant.sizes.forEach((size) => sizes.add(size.label));
    });
    return Array.from(sizes);
  }

  orderProductsBy(products: Product[]) {
    switch (this.orderedby()) {
      case ListOrder.major_price:
        return orderBy(products, ['price'], ['desc']);
      case ListOrder.minor_price:
        return orderBy(products, ['price'], ['asc']);
      case ListOrder.newest:
        return orderBy(products, ['isNew'], ['desc']);
      default:
        return products;
    }
  }
}
