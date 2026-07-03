import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopBar } from './components/top-bar/top-bar';
import { BottomBar } from './components/bottom-bar/bottom-bar';
import { LoadingOverlay } from './components/loading-overlay/loading-overlay';
import { Snackbar } from './components/ui/snackbar/snackbar';
import { FormNewProject } from './components/form-new-project/form-new-project';
import { FormNewTask } from './components/form-new-task/form-new-task';
import { TaskService } from './services/task-service/task-service';
import { ProjectService } from './services/project-service/project-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopBar, BottomBar, LoadingOverlay, Snackbar, FormNewProject, FormNewTask],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
}
