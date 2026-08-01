import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { CategoryFilter } from '../../../pages/products/store/products/products.reducers';

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

  getProducts({ page = 0, categories }: { page?: number; categories?: CategoryFilter[] }) {
    let params = new HttpParams();

    if (categories) {
      categories.forEach((category) => {
        params = params.append('category', this.slugify(category.name));
      });
    }

    console.log(params, 'categorieas');
    return this.http.get<Pagination<Product>>(
      `http://localhost:3000/products?_page=${page}&_per_page=9`,
      {
        params,
      },
    );
  }

  slugify(str: string): string {
    return str
      .normalize('NFD') // Separa os acentos das letras (ex: 'á' vira 'a' + ´)
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos que foram separados
      .toLowerCase(); // Passa tudo para minúsculo
  }
}
