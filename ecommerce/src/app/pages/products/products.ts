import { Component, inject, OnInit, signal } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';
import { ListOrder, ProductsList } from './components/products-list/products-list';
import { Pagination } from './components/pagination/pagination';
import { isPriceFilter, ProductFilter } from './store/products/products.reducers';
import { AsyncPipe } from '@angular/common';
import { ProductFilterService } from '../../core/services/product/product-filter.service';
import { Product } from '../../shared/models/product.model';
import { isNumber, toNumber } from 'lodash-es';
import { map } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar, ProductsList, Pagination, AsyncPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products implements OnInit {
  private productsFilterService = inject(ProductFilterService);
  filtersActives$ = this.productsFilterService.filtersActives$.pipe(
    map((value) =>
      value.map((i) => {
        if (isPriceFilter(i)) {
          return {
            ...i,
            name: `Min. R$${i.value}`,
          };
        }
        if (isPriceFilter(i)) {
          return {
            ...i,
            name: `Máx. R$ ${i.value}`,
          };
        }
        return i;
      }),
    ),
  );
  readonly orderedBy = signal<ListOrder>(ListOrder.relevance);

  readonly orderSelects: {
    label: string;
    value: ListOrder;
  }[] = [
    {
      label: 'Relevância',
      value: ListOrder.relevance,
    },
    {
      label: 'Menor Preço',
      value: ListOrder.minor_price,
    },
    {
      label: 'Maior Preço',
      value: ListOrder.major_price,
    },
    {
      label: 'Novidades',
      value: ListOrder.newest,
    },
  ];

  ngOnInit(): void {
    this.productsFilterService.syncProducts();
  }

  handleFilter(item: ProductFilter) {
    this.productsFilterService.startFilter(item);
  }
  clearFilter() {
    this.productsFilterService.clearFilter();
  }

  onSelectOrder(value: string) {
    const valueToNumber = toNumber(value);
    if (valueToNumber) {
      const findedSelect = this.orderSelects.filter((_, index) => index === valueToNumber)[0];
      this.orderedBy.set(findedSelect.value);
    }
  }
}
