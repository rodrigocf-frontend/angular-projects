import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoadingService } from '../loading-service/loading-service';

export type TaskStatus = 'todo' | 'progress' | 'done';
export type TaskPriority = 'low' | 'med' | 'high';

export interface TasksAPIResponse {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  overdue: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
  tagClass: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private todo = signal<TasksAPIResponse[]>([]);
  private progress = signal<TasksAPIResponse[]>([]);
  private done = signal<TasksAPIResponse[]>([]);

  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);

  readonly todoList = this.todo.asReadonly();
  readonly progressList = this.progress.asReadonly();
  readonly doneList = this.done.asReadonly();

  fetchTasks() {
    this.loadingService.start();
    this.http.get<TasksAPIResponse[]>('http://localhost:3000/tasks').subscribe({
      next: (data) => {
        this.todo.set(data.filter((item) => item.status === 'todo'));
        this.progress.set(data.filter((item) => item.status === 'progress'));
        this.done.set(data.filter((item) => item.status === 'done'));
      },
      error: () => this.loadingService.stop(),
      complete: () => this.loadingService.stop(),
    });
  }
}
