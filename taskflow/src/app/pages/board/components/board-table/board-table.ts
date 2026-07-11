import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, input, output } from '@angular/core';
import { Button } from '../../../../shared/components/ui/button/button';
import { Icon } from '../../../../shared/components/ui/icon/icon';
import { Task } from '../../../../shared/dto/task.dto';

@Component({
  selector: 'app-board-table',
  templateUrl: 'board-table.html',
  styleUrl: 'board-table.scss',
  imports: [CdkDropList, CdkDrag, Button, Icon],
})
export class BoardTable {
  todo = input<any[]>([]);
  progress = input<any[]>([]);
  done = input<any[]>([]);
  onDropTask = output<any>();
  onClickTask = output<Task>();

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

      this.onDropTask.emit({
        ...event.item.data,
        status: event.container.id,
      });
    }
  }

  tapTask(payload: Task) {
    this.onClickTask.emit(payload);
  }
}
