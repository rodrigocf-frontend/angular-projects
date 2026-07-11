import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';

export interface Project {
  name: string;
  description: string;
  color: string;
  deadline: string | null;
  total: number;
  id: number;
}

export type ProjectAPIPayload = Partial<Project>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private visibleState = signal(false);
  private readonly http = inject(HttpClient);
  private projects = signal<Project[]>([]);

  visible = this.visibleState.asReadonly();
  projectsList = this.projects.asReadonly();
  private currentProject = signal<Project | undefined>(undefined);
  selectedProject = this.currentProject.asReadonly();

  setCurrentProject(index: number) {
    this.currentProject.set(this.projectsList()[index]);
  }

  open() {
    this.visibleState.set(true);
  }

  close() {
    this.visibleState.set(false);
  }

  create({ payload }: { payload: ProjectAPIPayload }) {
    return this.http.post(environment.apiUrl + '/projects', {
      ...payload,
      total: 0,
    });
  }

  getAll() {
    return this.http
      .get<Project[]>(environment.apiUrl + '/projects?sort=id')
      .pipe(tap((res) => this.projects.set(res)));
  }
}
