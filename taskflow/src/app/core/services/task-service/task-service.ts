import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../project-service/project-service';
import { SidebarService } from '../sidebar-service/sidebar-service';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export type TaskStatus = 'todo' | 'progress' | 'done';
export type TaskPriority = 'low' | 'med' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  overdue: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
  tagClass: string;
  projectId: number;
  userId: number;
  project?: Project;
}

type TasksAPIResponse = Task;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly sidebarService = inject(SidebarService);
  private http = inject(HttpClient);

  private tasks = signal<Task[]>([]);

  private visibleState = signal(false);
  readonly visible = this.visibleState.asReadonly();
  private edittingTask = signal<TasksAPIResponse | null>(null);
  private readonly currentProject = this.sidebarService.selectedProject;

  readonly editTaskData = this.edittingTask.asReadonly();
  readonly allTasks = this.tasks.asReadonly();

  open() {
    this.visibleState.set(true);
  }

  close() {
    this.edittingTask.set(null);
    this.visibleState.set(false);
  }

  edit(payload: any) {
    this.edittingTask.set(payload);
    this.open();
  }

  setTasks(tasksList: Task[]) {
    this.tasks.set(tasksList);
  }

  createTask(payload: any) {
    return this.http.post(`${environment.apiUrl}/tasks`, {
      ...payload,
    });
  }

  readTasks() {
    return this.http
      .get<TasksAPIResponse[]>(`${environment.apiUrl}/tasks?projectId=${this.currentProject()?.id}`)
      .pipe(tap((res) => this.setTasks(res)));
  }

  updateTask(payload: Partial<Task>) {
    return this.http.patch(`${environment.apiUrl}/tasks/${payload.id}`, payload);
  }

  readMyTask() {
    return this.http.get<TasksAPIResponse[]>(
      `${environment.apiUrl}/tasks?userId=${1}&_expand=project`,
    );
  }

  deleteTask() {}
}
