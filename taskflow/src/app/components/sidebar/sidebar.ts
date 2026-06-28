import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type NavBarTypes = 'NAV_ITEMS' | 'NAV_PROJECTS';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  navItems = [
    { label: 'Quadro', icon: 'fa-solid fa-table-columns', route: '/board', badge: 12 },
    {
      label: 'Minhas tarefas',
      icon: 'fa-solid fa-list',
      route: '/my-tasks',
      badge: 3,
      badgeWarn: true,
    },
    { label: 'Calendário', icon: 'fa-regular fa-calendar', route: '/calendar' },
    { label: 'Relatórios', icon: 'fa-solid fa-chart-bar', route: '/reports' },
  ];

  navProjects = [
    { label: 'Angular Portfólio', color: '#5B6AF0' },
    { label: 'API Backend', color: '#22C55E' },
    { label: 'Design System', color: '#F59E0B' },
  ];

  completedTasks = signal(1);
  totalTasks = signal(12);
  progress = computed(() => Math.round((this.completedTasks() / this.totalTasks()) * 100));
  navItemActive = signal(0);
  projectActive = signal(0);

  onSelect(value: number, from: NavBarTypes) {
    if (from === 'NAV_ITEMS') {
      this.navItemActive.set(value);
      return;
    }
    if (from === 'NAV_PROJECTS') {
      this.projectActive.set(value);
    }
  }
}
