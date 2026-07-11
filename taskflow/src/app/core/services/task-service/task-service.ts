import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SidebarService } from '../sidebar-service/sidebar-service';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, TaskWithProjectDto } from '../../../shared/dto/task.dto';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly sidebarService = inject(SidebarService);
  private http = inject(HttpClient);

  private tasks = signal<Task[]>([]);

  private visibleState = signal(false);
  readonly visible = this.visibleState.asReadonly();
  private edittingTask = signal<TaskWithProjectDto | null>(null);
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
      .get<
        TaskWithProjectDto[]
      >(`${environment.apiUrl}/tasks?projectId=${this.currentProject()?.id}`)
      .pipe(tap((res) => this.setTasks(res)));
  }

  updateTask(payload: Partial<Task>) {
    return this.http.patch(`${environment.apiUrl}/tasks/${payload.id}`, payload);
  }

  readMyTask() {
    return this.http.get<TaskWithProjectDto[]>(
      `${environment.apiUrl}/tasks?userId=${1}&_expand=project`,
    );
  }

  deleteTask() {}
}
