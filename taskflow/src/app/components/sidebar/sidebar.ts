import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../ui/icon/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  navItems = [
    {
      label: 'Quadro',
      icon: 'kanban',
      route: '',
      badge: 12,
    },
    {
      label: 'Minhas tarefas',
      icon: 'tasks',
      route: 'my-tasks',
      badge: 3,
      badgeWarn: true,
    },
    {
      label: 'Calendário',
      icon: 'calendar',
      route: 'calendar',
    },
    { label: 'Relatórios', icon: 'reports', route: 'reports' },
  ];

  navProjects = [
    { label: 'Angular Portfólio', color: '#5B6AF0' },
    { label: 'API Backend', color: '#22C55E' },
    { label: 'Design System', color: '#F59E0B' },
  ];

  completedTasks = signal(1);
  totalTasks = signal(12);
  progress = computed(() => Math.round((this.completedTasks() / this.totalTasks()) * 100));
  projectActive = signal(0);
  private readonly router = inject(Router);

  onSelect(value: number) {
    this.router.navigate(['']);
    this.projectActive.set(value);
  }
}
