import { Component, inject } from '@angular/core';
import { BoardTable } from '../../components/board-table/board-table';
import { TaskService } from '../../services/task-service/task-service';

@Component({
  selector: 'app-board',
  imports: [BoardTable],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private taskService = inject(TaskService);

  todoList = this.taskService.todoList;
  progressList = this.taskService.progressList;
  doneList = this.taskService.doneList;

  onDropTask(newTaskData: any) {
    this.taskService.updateTask(newTaskData);
  }
}
