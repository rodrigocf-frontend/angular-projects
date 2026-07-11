import { Component, computed, effect, inject, untracked } from '@angular/core';
import { BoardTable } from './components/board-table/board-table';
import { Task, TaskService } from '../../core/services/task-service/task-service';
import { SnackbarService } from '../../core/services/snack-service/snack-service';
import { SidebarService } from '../../core/services/sidebar-service/sidebar-service';

@Component({
  selector: 'app-board',
  imports: [BoardTable],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly taskService = inject(TaskService);
  private readonly snackService = inject(SnackbarService);
  private readonly sidebarService = inject(SidebarService);

  private allTasks = this.taskService.allTasks;
  private currentProject = this.sidebarService.selectedProject;

  todoList = computed(() => this.allTasks().filter((item) => item.status === 'todo'));
  progressList = computed(() => this.allTasks().filter((item) => item.status === 'progress'));
  doneList = computed(() => this.allTasks().filter((item) => item.status === 'done'));

  constructor() {
    effect(() => {
      const activeProject = this.currentProject();

      if (activeProject?.id) {
        untracked(() => this.fetchTasks());
      }
    });
  }

  fetchTasks() {
    if (this.currentProject()?.id) {
      this.taskService.readTasks().subscribe({
        error: () => {
          this.snackService.error('Connection Error');
        },
      });
    }
  }

  onDropTask(newTaskData: any) {
    this.taskService.updateTask(newTaskData).subscribe({
      complete: () => this.fetchTasks(),
    });
  }

  editTask(payload: Task) {
    this.taskService.edit(payload);
  }
}
