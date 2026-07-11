import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { TopBar } from './shared/components/top-bar/top-bar';
import { BottomBar } from './shared/components/bottom-bar/bottom-bar';
import { LoadingOverlay } from './shared/components/loading-overlay/loading-overlay';
import { Snackbar } from './shared/components/ui/snackbar/snackbar';
import { FormNewProject } from './shared/components/form-new-project/form-new-project';
import { FormNewTask } from './shared/components/form-new-task/form-new-task';
import { TaskService } from './core/services/task-service/task-service';
import { ProjectService } from './core/services/project-service/project-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopBar,
    BottomBar,
    LoadingOverlay,
    Snackbar,
    FormNewProject,
    FormNewTask,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
}
