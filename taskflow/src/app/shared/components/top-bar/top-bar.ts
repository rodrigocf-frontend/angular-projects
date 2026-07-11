import { Component, computed, effect, inject, signal } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';
import { Avatar } from '../ui/avatar/avatar';
import { TaskService } from '../../../core/services/task-service/task-service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarService } from '../../../core/services/sidebar-service/sidebar-service';

@Component({
  selector: 'app-top-bar',
  imports: [Button, Icon, Avatar],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  private sidebarService = inject(SidebarService);
  private taskService = inject(TaskService);
  private activatedRoute = inject(ActivatedRoute);
  private currentNavigation = signal('');
  private url = toSignal(this.activatedRoute.url);

  currentRoute = this.currentNavigation.asReadonly();
  selectedProject = this.sidebarService.selectedProject;

  constructor() {
    effect(() => {
      const currentUrl = this.url();
      if (currentUrl && currentUrl.length > 0) {
        this.currentNavigation.set(currentUrl[0].path);
      }
    });
  }

  protected openNewTaskForm() {
    this.taskService.open();
  }

  protected getTitle() {
    switch (this.currentNavigation()) {
      case '':
        return 'Quadro';
      case 'my-tasks':
        return 'Minhas tarefas';
      case 'calendar':
        return 'Calendário';
      case 'reports':
        return 'Relatórios';
      default:
        return '';
    }
  }
}
