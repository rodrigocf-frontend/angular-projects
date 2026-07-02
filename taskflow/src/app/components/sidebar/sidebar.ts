import { Component, computed, effect, inject, OnInit, untracked } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../ui/icon/icon';
import { ProjectService } from '../../services/project-service/project-service';
import { TaskService } from '../../services/task-service/task-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private readonly router = inject(Router);
  navProjects = this.projectService.projectsList;
  selectedProject = this.projectService.selectedProject;

  inProgressCount = computed(() => this.taskService.progressList().length);
  doneCount = computed(() => this.taskService.doneList().length);
  todoCount = computed(() => this.taskService.todoList().length);
  overdueCount = computed(() => this.taskService.overdueList().length);

  progressFill = computed(() => {
    const total = this.selectedProject()?.total;

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
      const activeProject = this.projectService.selectedProject();

      if (activeProject?.id) {
        untracked(() => {
          this.taskService.readTasks(activeProject.id);
        });
      }
    });
  }

  ngOnInit(): void {
    this.projectService.getAll();
  }

  onSelect(value: number) {
    this.router.navigate(['']);
    this.projectService.setCurrentProject(value);
  }

  openNewProjectForm() {
    this.projectService.open();
  }
}
