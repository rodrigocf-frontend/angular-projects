import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

interface Pagination<T> {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts({ page = 0 }: { page?: number }) {
    return this.http.get<Pagination<Product>>(
      `http://localhost:3000/products?_page=${page}&_per_page=9`,
    );
  }
}
