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
    it('should return an Observable of projects', () => {
      let result: Project[] = [];
      service.getAll().subscribe((projects) => (result = projects));

      httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Project A');
    });

    it('should make a GET request to the correct endpoint', () => {
      service.getAll().subscribe();
      const req = httpMock.expectOne(`${API}/projects?sort=id`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects);
    });
  });

  describe('setCurrentProject', () => {
    it('should set selectedProject to the project at the given index', () => {
      (service as any).projects.set(mockProjects);
      service.setCurrentProject(1);
      expect(service.selectedProject()?.id).toBe(2);
    });

    it('should set selectedProject to the first project when index is 0', () => {
      (service as any).projects.set(mockProjects);
      service.setCurrentProject(0);
      expect(service.selectedProject()?.id).toBe(1);
    });
  });

  describe('create', () => {
    it('should POST to projects endpoint with total: 0', () => {
      const payload = { name: 'Novo Projeto', color: '#5b6af0', description: '', deadline: null };
      service.create({ payload });

      const req = httpMock.expectOne(`${API}/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toMatchObject({ ...payload, total: 0 });
      req.flush({ id: 3, ...payload, total: 0 });
    });
  });
});
