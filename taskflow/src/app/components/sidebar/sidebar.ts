import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../ui/icon/icon';
import { ProjectService } from '../../services/project-service/project-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
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

  private projectService = inject(ProjectService);
  navProjects = this.projectService.projectsList;

  completedTasks = signal(1);
  totalTasks = signal(12);
  progress = computed(() => Math.round((this.completedTasks() / this.totalTasks()) * 100));
  projectActive = signal(0);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.projectService.getAll();
  }

  onSelect(value: number) {
    this.router.navigate(['']);
    this.projectActive.set(value);
  }

  openNewProjectForm() {
    this.projectService.open();
  }
}
