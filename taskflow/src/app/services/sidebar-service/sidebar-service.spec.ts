import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar-service';
import { Project } from '../project-service/project-service';

const mockProject: Project = {
  id: 1,
  name: 'Project A',
  description: '',
  color: '#5b6af0',
  deadline: null,
  total: 5,
};

const mockProject2: Project = {
  id: 2,
  name: 'Project B',
  description: '',
  color: '#22c55e',
  deadline: null,
  total: 3,
};

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selectedProject should be undefined initially', () => {
    expect(service.selectedProject()).toBeUndefined();
  });

  it('setProject() should update selectedProject', () => {
    service.setProject(mockProject);
    expect(service.selectedProject()).toEqual(mockProject);
  });

  it('setProject() should replace the previously selected project', () => {
    service.setProject(mockProject);
    service.setProject(mockProject2);
    expect(service.selectedProject()?.id).toBe(2);
  });

  it('selectedProject should reflect the correct project id', () => {
    service.setProject(mockProject);
    expect(service.selectedProject()?.id).toBe(1);
    expect(service.selectedProject()?.name).toBe('Project A');
  });
});
