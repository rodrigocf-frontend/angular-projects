import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreateProjectDto, Project } from '../../../shared/dto/project.dto';
import { tap } from 'rxjs';
import { SidebarService } from '../sidebar-service/sidebar-service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private visibleState = signal(false);
  private readonly http = inject(HttpClient);
  private projects = signal<Project[]>([]);
  private sidebarService = inject(SidebarService);

  visible = this.visibleState.asReadonly();
  projectsList = this.projects.asReadonly();

  open() {
    this.visibleState.set(true);
  }

  close() {
    this.visibleState.set(false);
  }

  setProjects(allProjects: Project[]) {
    this.projects.set(allProjects);
  }

  create({ payload }: { payload: CreateProjectDto }) {
    return this.http.post(environment.apiUrl + '/v1/projects', {
      ...payload,
      total: 0,
    });
  }

  getAll({
    lastSelection,
  }: {
    lastSelection?: boolean;
  } = {}) {
    return this.http.get<Project[]>(environment.apiUrl + '/v1/projects').pipe(
      tap((response) => {
        this.setProjects(response);
        if (!lastSelection) {
          this.sidebarService.setProject(response[0]);
          return;
        }
        if (response.length > 0) {
          this.sidebarService.setProject(response[response.length - 1]);
        }
      }),
    );
  }
}
