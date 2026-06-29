import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-board-table',
  templateUrl: 'board-table.html',
  styleUrl: 'board-table.scss',
  imports: [CdkDropList, CdkDrag, Button, Icon],
})
export class BoardTable {
  private taskService = inject(TaskService);

  todo = computed(() => this.taskService.todo());
  progress = computed(() => this.taskService.progress());
  done = computed(() => this.taskService.done());

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
