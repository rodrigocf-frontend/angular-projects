import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SidebarService } from '../sidebar-service/sidebar-service';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, TaskWithProjectDto } from '../../../shared/dto/task.dto';
import { UserService } from '../user-service/user-service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly sidebarService = inject(SidebarService);
  private readonly userService = inject(UserService);
  private http = inject(HttpClient);

  private tasks = signal<TaskWithProjectDto[]>([]);

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

  edit(payload: TaskWithProjectDto) {
    this.edittingTask.set(payload);
    this.open();
  }

  setTasks(tasksList: TaskWithProjectDto[]) {
    this.tasks.set(tasksList);
  }

  createTask(payload: Task) {
    console.log('create');
    return this.http.post(`${environment.apiUrl}/v1/tasks`, {
      ...payload,
      userId: this.userService.userIdentification(),
    });
  }

  readTasks() {
    return this.http
      .get<
        TaskWithProjectDto[]
      >(`${environment.apiUrl}/v1/tasks?projectId=${this.currentProject().id}`)
      .pipe(tap((res) => this.setTasks(res)));
  }

  updateTask(payload: Task) {
    return this.http.patch(`${environment.apiUrl}/v1/tasks/${payload.id}`, payload);
  }

  readMyTask() {
    return this.http.get<TaskWithProjectDto[]>(
      `${environment.apiUrl}/v1/tasks?userId=${this.userService.userIdentification()}&_expand=project`,
    );
  }
}
