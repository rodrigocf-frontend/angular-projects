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

  private menuOpen = signal(false);

  selectedProject = this.project.asReadonly();
  mobileMenuOpen = this.menuOpen.asReadonly();

  setProject(projectData: Project) {
    this.project.set(projectData);
  }

  toggleMobileMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.menuOpen.set(false);
  }
}
