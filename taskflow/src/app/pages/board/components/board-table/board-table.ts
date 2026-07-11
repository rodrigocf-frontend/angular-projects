import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Button } from '../../../../shared/components/ui/button/button';
import { Icon } from '../../../../shared/components/ui/icon/icon';
import { Task, TaskWithProjectDto } from '../../../../shared/dto/task.dto';
import { UserService } from '../../../../core/services/user-service/user-service';
import { isThisWeek } from 'date-fns';

enum Filters {
  ALL,
  HIGH_PRIORITY,
  TO_ME,
  THIS_WEEK,
}

@Component({
  selector: 'app-board-table',
  templateUrl: 'board-table.html',
  styleUrl: 'board-table.scss',
  imports: [CdkDropList, CdkDrag, Button, Icon],
})
export class BoardTable {
  private userService = inject(UserService);

  todo = input<TaskWithProjectDto[]>([]);
  progress = input<TaskWithProjectDto[]>([]);
  done = input<TaskWithProjectDto[]>([]);
  onDropTask = output<TaskWithProjectDto>();
  onClickTask = output<TaskWithProjectDto>();

  private chip = signal(0);
  private userId = this.userService.userIdentification;

  chips = ['Todas', 'Alta prioridade', 'Atribuídas a mim', 'Esta semana'];

  currentChip = this.chip.asReadonly();

  todosListFiltered = computed(() => this.filterBy(this.currentChip(), this.todo()));
  doneListFiltered = computed(() => this.filterBy(this.currentChip(), this.done()));
  progressListFiltered = computed(() => this.filterBy(this.currentChip(), this.progress()));

  filterBy(chipIndex: number, tasks: TaskWithProjectDto[]) {
    switch (chipIndex) {
      case Filters.ALL:
        return tasks;
      case Filters.HIGH_PRIORITY:
        return tasks.filter((item) => item.priority === 'high');
      case Filters.TO_ME:
        return tasks.filter((item) => item.userId === this.userId());
      case Filters.THIS_WEEK:
        return tasks.filter((item) => item.dueDate && isThisWeek(new Date(item.dueDate)));
      default:
        return tasks;
    }
  }

  onClickChip(index: number) {
    this.chip.set(index);
  }

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

  tapTask(payload: TaskWithProjectDto) {
    this.onClickTask.emit(payload);
  }
}
