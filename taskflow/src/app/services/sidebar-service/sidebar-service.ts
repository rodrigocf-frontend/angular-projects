import { Injectable, signal } from '@angular/core';
import { Project } from '../project-service/project-service';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private project = signal<Project | undefined>(undefined);

  selectedProject = this.project.asReadonly();

  setProject(projectData: Project) {
    this.project.set(projectData);
  }
}
