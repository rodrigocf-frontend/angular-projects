import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-list',
  imports: [],
  templateUrl: './loading-list.component.html',
  styleUrl: './loading-list.component.scss',
})
export class LoadingListComponent {
  count = input<number>(9);
  items = computed(() => Array.from({ length: this.count() }));
}
