import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Project, ProjectService } from './project-service';

const API = 'http://localhost:3000';

const mockProjects: Project[] = [
  { id: 1, name: 'Project A', description: 'Desc A', color: '#5b6af0', deadline: null, total: 5 },
  { id: 2, name: 'Project B', description: 'Desc B', color: '#22c55e', deadline: null, total: 3 },
];

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty projects list', () => {
    expect(service.projectsList().length).toBe(0);
  });

  it('visible should be false initially', () => {
    expect(service.visible()).toBe(false);
  });

  it('selectedProject should be undefined initially', () => {
    expect(service.selectedProject()).toBeUndefined();
  });

  it('open() should set visible to true', () => {
    service.open();
    expect(service.visible()).toBe(true);
  });

  it('close() should set visible to false', () => {
    service.open();
    service.close();
    expect(service.visible()).toBe(false);
  });

  describe('getAll', () => {
    it('should fetch and set projects', () => {
      service.getAll();
      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);
      expect(service.projectsList().length).toBe(2);
      expect(service.projectsList()[0].name).toBe('Project A');
    });

    it('should set the first project as selected after loading', () => {
      service.getAll();
      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);
      expect(service.selectedProject()?.id).toBe(1);
    });

    it('should call onComplete callback', () => {
      const onComplete = vi.fn();
      service.getAll({ onComplete });
      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);
      expect(onComplete).toHaveBeenCalledOnce();
    });
  });

  describe('setCurrentProject', () => {
    it('should select project by index', () => {
      service.getAll();
      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);
      service.setCurrentProject(1);
      expect(service.selectedProject()?.id).toBe(2);
    });
  });

  describe('create', () => {
    it('should POST and reload the project list', () => {
      const payload = { name: 'Novo Projeto', color: '#5b6af0', description: '', deadline: null };
      service.create({ payload });

      httpMock.expectOne(`${API}/projects`).flush({ id: 3, ...payload, total: 0 });
      httpMock.expectOne(`${API}/projects?sort=id`).flush([...mockProjects, { id: 3, ...payload, total: 0 }]);

      expect(service.projectsList().length).toBe(3);
    });

    it('should call onComplete after create and reload', () => {
      const onComplete = vi.fn();
      const payload = { name: 'Novo', color: '#5b6af0', description: '', deadline: null };
      service.create({ payload, onComplete });

      httpMock.expectOne(`${API}/projects`).flush({ id: 3, ...payload, total: 0 });
      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);

      expect(onComplete).toHaveBeenCalledOnce();
    });
  });
});
