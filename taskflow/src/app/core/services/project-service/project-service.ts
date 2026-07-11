import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { CreateProjectDto, Project } from '../../../shared/dto/project.dto';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private visibleState = signal(false);
  private readonly http = inject(HttpClient);
  private projects = signal<Project[]>([]);

  visible = this.visibleState.asReadonly();
  projectsList = this.projects.asReadonly();

  open() {
    this.visibleState.set(true);
  }

  close() {
    this.visibleState.set(false);
  }

  create({ payload }: { payload: CreateProjectDto }) {
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
