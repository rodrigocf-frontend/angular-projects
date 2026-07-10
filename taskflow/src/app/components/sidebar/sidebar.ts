import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../ui/icon/icon';
import { Project, ProjectService } from '../../services/project-service/project-service';
import { TaskService } from '../../services/task-service/task-service';
import { SnackbarService } from '../../services/snack-service/snack-service';
import { SidebarService } from '../../services/sidebar-service/sidebar-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly sidebarService = inject(SidebarService);

  private projects = signal<Project[]>([]);
  private allTasks = this.taskService.allTasks;
  currentProject = this.sidebarService.selectedProject;

  navProjects = this.projects.asReadonly();

  todoCount = computed(() => this.allTasks().filter((item) => item.status === 'todo').length);
  progressCount = computed(
    () => this.allTasks().filter((item) => item.status === 'progress').length,
  );
  doneCount = computed(() => this.allTasks().filter((item) => item.status === 'done').length);
  overdueCount = computed(() => this.allTasks().filter((item) => item.overdue).length);

  progressFill = computed(() => {
    const total = this.currentProject()?.total;

    if (total) {
      return Math.round((this.doneCount() / total) * 100);
    }
    return 0;
  });

  navItems = [
    {
      label: 'Quadro',
      icon: 'kanban',
      route: '',
    },
    {
      label: 'Minhas tarefas',
      icon: 'tasks',
      route: 'my-tasks',
    },
    {
      label: 'Calendário',
      icon: 'calendar',
      route: 'calendar',
    },
    { label: 'Relatórios', icon: 'reports', route: 'reports' },
  ];

  constructor() {
    effect(() => {
      const activeProject = this.currentProject();
      if (activeProject?.id) {
        untracked(() => {
          this.fetchTasks();
        });
      }
    });
  }

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.projectService.getAll().subscribe({
      next: (res) => {
        this.projects.set(res);
        this.sidebarService.setProject(res[0]);
      },
    });
  }

  fetchTasks() {
    if (this.currentProject()?.id) {
      this.taskService.readTasks().subscribe({
        error: () => {
          this.snackbarService.error('Connection Error');
        },
      });
    }
  }

  onSelect(value: number) {
    this.router.navigate(['']);
    this.sidebarService.setProject(this.projects()[value]);
  }

  openNewProjectForm() {
    this.projectService.open();
  }
}
