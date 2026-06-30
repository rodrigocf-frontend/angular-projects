import { Component, computed, input } from '@angular/core';

const iconMap: Record<string, string> = {
  kanban: 'fa-solid fa-table-columns',
  tasks: 'fa-solid fa-list',
  calendar: 'fa-regular fa-calendar',
  reports: 'fa-solid fa-chart-bar',
  project: 'fa-solid fa-circle',
  add: 'fa-solid fa-plus',
  search: 'fa-solid fa-magnifying-glass',
  filter: 'fa-solid fa-filter',
  branch: 'fa-solid fa-code-branch',
  clock: 'fa-regular fa-clock',
  check: 'fa-solid fa-check',
  alert: 'fa-solid fa-circle-exclamation',
  trash: 'fa-solid fa-trash',
  edit: 'fa-solid fa-pen',
  list: 'fa-regular fa-rectangle-list',
  'rotate-right': 'fa-solid fa-rotate-right',
};

@Component({
  selector: 'i[name]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'iconClass()',
  },
})
export class Icon {
  name = input.required<string>();
  iconClass = computed(() => iconMap[this.name()] ?? '');
}
