import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopBar } from './components/top-bar/top-bar';
import { BottomBar } from './components/bottom-bar/bottom-bar';
import { LoadingOverlay } from './components/loading-overlay/loading-overlay';
import { Snackbar } from './components/ui/snackbar/snackbar';
import { FormNewProject } from './components/form-new-project/form-new-project';
import { ProjectService } from './services/project-service/project-service';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
