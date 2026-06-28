import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  navItems = [
    { label: 'Quadro', icon: 'ti-layout-kanban', route: '/board', badge: 12 },
    { label: 'Minhas tarefas', icon: 'ti-list', route: '/my-tasks', badge: 3, badgeWarn: true },
    { label: 'Calendário', icon: 'ti-calendar', route: '/calendar' },
    { label: 'Relatórios', icon: 'ti-chart-bar', route: '/reports' },
  ];

  projects = [
    { label: 'Angular Portfólio', color: '#5B6AF0' },
    { label: 'API Backend', color: '#22C55E' },
    { label: 'Design System', color: '#F59E0B' },
  ];

  completedTasks = signal(7);
  totalTasks = signal(12);
  progress = computed(() => Math.round((this.completedTasks() / this.totalTasks()) * 100));
}
