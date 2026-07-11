import { Component, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';
import { Avatar } from '../ui/avatar/avatar';
import { TaskService } from '../../../core/services/task-service/task-service';

@Component({
  selector: 'app-top-bar',
  imports: [Button, Icon, Avatar],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  private taskService = inject(TaskService);

  openNewTaskForm() {
    this.taskService.open();
  }
}
