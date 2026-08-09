import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import {
  CategoryFilter,
  ColorFilter,
  PriceFilter,
  SizeFilter,
  SortFilter,
} from '../../../pages/products/store/products/products.reducers';
import { environment } from '../../../../environments/environment';

export interface Pagination<T> {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export interface CategoryFilterFromApi extends Omit<CategoryFilter, 'checked'> {}
export interface SizeFilterFromApi extends Omit<SizeFilter, 'checked'> {}
export interface ColorFilterFromApi extends Omit<ColorFilter, 'checked'> {}

export interface FiltersApiResponse {
  categories: CategoryFilterFromApi[];
  sizes: SizeFilterFromApi[];
  colors: ColorFilter[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts({
    page = 0,
    categories = [],
    colors = [],
    sizes = [],
    fromPrice = [],
    toPrice = [],
    sort = [],
    perPage = 9,
  }: {
    page?: number;
    categories?: CategoryFilter[];
    sizes?: SizeFilter[];
    colors?: ColorFilter[];
    fromPrice?: PriceFilter[];
    toPrice?: PriceFilter[];
    sort?: SortFilter[];
    perPage?: number;
  }) {
    let params = new HttpParams();

    categories.forEach((category) => {
      const currentParams = params.get('category_in');
      if (currentParams) {
        params = params.set('category_in', `${currentParams},${this.slugify(category.slug)}`);
      } else {
        params = params.append('category_in', this.slugify(category.slug));
      }
    });

    colors.forEach((color) => {
      params = params.append('colors_contains', color.hex);
    });

    sizes.forEach((size) => {
      params = params.append('sizes_contains', size.name);
    });

    fromPrice.forEach((price) => {
      params = params.append('price_gte', this.slugify(`${price.value}`));
    });

    toPrice.forEach((price) => {
      params = params.append('price_lte', this.slugify(`${price.value}`));
    });

    sort.forEach((sort) => {
      if (sort.type === 'min-price') {
        params = params.append('_sort', 'price');
      } else if (sort.type === 'max-price') {
        params = params.append('_sort', '-price');
      } else if (sort.type === 'newest') {
        params = params.append('isNew', 'true');
      } else if (sort.type === 'sale') {
        params = params.append('isSale', 'true');
      } else if (sort.type === 'featured') {
        params = params.append('featured', 'true');
      }
    });

    return this.http.get<Pagination<Product>>(
      `${environment.apiUrl}/products?_page=${page}&_per_page=${perPage}`,
      {
        params,
      },
    );
  }

  getFilters() {
    return this.http.get<FiltersApiResponse>(`${environment.apiUrl}/filters`);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  getRelatedProducts(product: Product) {
    return this.http.get<Pagination<Product>>(
      `${environment.apiUrl}/products?category=${product.category}&id:ne=${product.id}&_page=0&_per_page=4`,
    );
  }

  slugify(str: string): string {
    return str
      .normalize('NFD') // Separa os acentos das letras (ex: 'á' vira 'a' + ´)
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos que foram separados
      .toLowerCase(); // Passa tudo para minúsculo
  }
}
