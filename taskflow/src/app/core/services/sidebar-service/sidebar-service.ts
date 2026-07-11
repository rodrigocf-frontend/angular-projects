import { Injectable, signal } from '@angular/core';
import { Project } from '../../../shared/dto/project.dto';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private project = signal<Project>({
    color: '',
    deadline: '',
    description: '',
    id: 0,
    name: '',
    total: 0,
  });

  selectedProject = this.project.asReadonly();

  setProject(projectData: Project) {
    this.project.set(projectData);
  }
}
