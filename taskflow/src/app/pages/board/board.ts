import { Component, inject, OnInit } from '@angular/core';
import { BoardTable } from '../../components/board-table/board-table';
import { TaskService } from '../../services/task-service/task-service';

@Component({
  selector: 'app-board',
  imports: [BoardTable],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  private taskService = inject(TaskService);

  todoList = this.taskService.todoList;
  progressList = this.taskService.progressList;
  doneList = this.taskService.doneList;

  ngOnInit(): void {
    this.taskService.readTasks();
  }
}
