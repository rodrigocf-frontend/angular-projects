import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SnackbarService } from '../../core/services/snack-service/snack-service';
import { TaskService } from '../../core/services/task-service/task-service';
import { TaskWithProjectDto } from '../../shared/dto/task.dto';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { Icon } from '../../shared/components/ui/icon/icon';

@Component({
  selector: 'app-my-tasks',
  imports: [TopBar, Icon],
  templateUrl: './my-tasks.html',
  styleUrl: './my-tasks.scss',
})
export class MyTasks implements OnInit {
  private taskService = inject(TaskService);
  private snackService = inject(SnackbarService);

  private userTasks = signal<TaskWithProjectDto[]>([]);

  private totalTasks = computed(() => this.userTasks().length);
  doneTasks = computed(() => this.userTasks().filter((task) => task.status === 'done'));
  progressTasks = computed(() => this.userTasks().filter((task) => task.status === 'progress'));
  todoTasks = computed(() => this.userTasks().filter((task) => task.status === 'todo'));
  overdueTasks = computed(() => this.userTasks().filter((task) => task.overdue));

  overduePercent = computed(() =>
    this.totalTasks() === 0
      ? 0
      : Math.round((this.overdueTasks().length / this.totalTasks()) * 100),
  );
  todoPercent = computed(() =>
    this.totalTasks() === 0 ? 0 : Math.round((this.todoTasks().length / this.totalTasks()) * 100),
  );
  donePercent = computed(() =>
    this.totalTasks() === 0 ? 0 : Math.round((this.doneTasks().length / this.totalTasks()) * 100),
  );
  progressPercent = computed(() =>
    this.totalTasks() === 0
      ? 0
      : Math.round((this.progressTasks().length / this.totalTasks()) * 100),
  );

  ngOnInit(): void {
    this.fetchUserTasks();
  }

  fetchUserTasks() {
    this.taskService.readMyTask().subscribe({
      next: (data) => {
        this.userTasks.set(data);
      },
      error: () => {
        this.snackService.error('Connection Error');
      },
    });
  }
}
