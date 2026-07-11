import { Component, computed, input } from '@angular/core';

export type IconKey =
  | 'kanban'
  | 'tasks'
  | 'calendar'
  | 'reports'
  | 'project'
  | 'add'
  | 'search'
  | 'filter'
  | 'branch'
  | 'clock'
  | 'check'
  | 'alert'
  | 'trash'
  | 'edit'
  | 'list'
  | 'rotate-right'
  | 'circle-info'
  | 'triangle-exclamation';

const iconMap: Record<IconKey, string> = {
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
  'circle-info': 'fa-solid fa-circle-info',
  'triangle-exclamation': 'fa-solid fa-triangle-exclamation',
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
  name = input.required<IconKey>();
  iconClass = computed(() => iconMap[this.name()] ?? '');
}
