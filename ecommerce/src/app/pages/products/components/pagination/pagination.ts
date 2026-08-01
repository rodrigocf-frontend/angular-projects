import { Component, computed, inject, input, signal } from '@angular/core';
import { FiltersPagination } from '../../store/products/products.reducers';
import { Store } from '@ngrx/store';
import { changePage } from '../../store/products/products.actions';
import { range } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  imports: [ScrollingModule],
})
export class Pagination {
  pagination = input.required<FiltersPagination>();
  private readonly store = inject(Store);
  readonly firstFiveButtons = signal<number[]>([]);

  pages = computed(() => {
    const c = this.pagination().current;
    const t = this.pagination().pages;
    const delta = 2; // quantas páginas mostrar ao redor da atual

    const range: number[] = [];
    for (let i = Math.max(2, c - delta); i <= Math.min(t - 1, c + delta); i++) {
      range.push(i);
    }

    const pages: (number | '...')[] = [];

    // sempre mostra a primeira
    pages.push(1);

    // ellipsis no início
    if (range[0] > 2) pages.push('...');

    // páginas ao redor da atual
    pages.push(...range);

    // ellipsis no fim
    if (range[range.length - 1] < t - 1) pages.push('...');

    // sempre mostra a última
    if (t > 1) pages.push(t);

    return pages;
  });

  goTo(page: number) {
    this.store.dispatch(changePage({ page }));
    const targetElement = document.querySelector('#products-list');

    // Scroll to it smoothly
    targetElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
