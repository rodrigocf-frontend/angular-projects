import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task-service';
import { SidebarService } from '../sidebar-service/sidebar-service';
import { Task } from '../../../shared/dto/task.dto';
import { Project } from '../../../shared/dto/project.dto';

const API = 'http://localhost:3000';

const mockProject: Project = {
  id: 1,
  name: 'Project A',
  description: '',
  color: '#5b6af0',
  deadline: null,
  total: 5,
};

const mockTasks: Task[] = [
  { id: '1', title: 'Task A', description: null, dueDate: null, overdue: false, priority: 'high', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '2', title: 'Task B', description: null, dueDate: null, overdue: false, priority: 'med', status: 'progress', tag: 'Core', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '3', title: 'Task C', description: null, dueDate: null, overdue: false, priority: 'low', status: 'done', tag: 'Setup', tagClass: 'tag-green', projectId: 1, userId: 1 },
  { id: '4', title: 'Task D', description: null, dueDate: null, overdue: true, priority: 'low', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
];

describe('TaskService', () => {
  let service: TaskService;
  let sidebarService: SidebarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    sidebarService = TestBed.inject(SidebarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('allTasks should start empty', () => {
    expect(service.allTasks().length).toBe(0);
  });

  it('visible should be false initially', () => {
    expect(service.visible()).toBe(false);
  });

  it('open() should set visible to true', () => {
    service.open();
    expect(service.visible()).toBe(true);
  });

  it('close() should set visible to false after open', () => {
    service.open();
    service.close();
    expect(service.visible()).toBe(false);
  });

  it('editTaskData should be null initially', () => {
    expect(service.editTaskData()).toBeNull();
  });

  it('edit() should set editTaskData and open modal', () => {
    service.edit(mockTasks[0]);
    expect(service.editTaskData()).toEqual(mockTasks[0]);
    expect(service.visible()).toBe(true);
  });

  it('close() should clear editTaskData', () => {
    service.edit(mockTasks[0]);
    service.close();
    expect(service.editTaskData()).toBeNull();
    expect(service.visible()).toBe(false);
  });

  describe('readTasks', () => {
    beforeEach(() => {
      sidebarService.setProject(mockProject);
    });

    it('should update allTasks after fetch', () => {
      service.readTasks().subscribe();
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(service.allTasks().length).toBe(4);
    });

    it('should use projectId from SidebarService in the URL', () => {
      service.readTasks().subscribe();
      const req = httpMock.expectOne(`${API}/tasks?projectId=1`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('allTasks should reflect tasks by status after fetch', () => {
      service.readTasks().subscribe();
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      const todos = service.allTasks().filter((t) => t.status === 'todo');
      const dones = service.allTasks().filter((t) => t.status === 'done');
      expect(todos.length).toBe(2);
      expect(dones.length).toBe(1);
    });

    it('allTasks should include overdue tasks', () => {
      service.readTasks().subscribe();
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      const overdue = service.allTasks().filter((t) => t.overdue);
      expect(overdue.length).toBe(1);
    });
  });

  describe('createTask', () => {
    it('should POST to tasks endpoint', () => {
      const payload = { title: 'New Task', status: 'todo', priority: 'low', projectId: 1 };
      service.createTask(payload).subscribe();

      const req = httpMock.expectOne(`${API}/tasks`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toMatchObject(payload);
      req.flush({ id: '99', ...payload });
    });

    it('should return an Observable', () => {
      const payload = { title: 'New Task', status: 'todo', priority: 'low', projectId: 1 };
      let emitted = false;
      service.createTask(payload).subscribe(() => (emitted = true));

      httpMock.expectOne(`${API}/tasks`).flush({ id: '99', ...payload });
      expect(emitted).toBe(true);
    });
  });

  describe('updateTask', () => {
    it('should PATCH the task by id', () => {
      const payload: Partial<Task> = { id: '1', status: 'progress' };
      service.updateTask(payload).subscribe();

      const req = httpMock.expectOne(`${API}/tasks/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush({ ...mockTasks[0], ...payload });
    });

    it('should return an Observable', () => {
      const payload: Partial<Task> = { id: '1', status: 'done' };
      let emitted = false;
      service.updateTask(payload).subscribe(() => (emitted = true));

      httpMock.expectOne(`${API}/tasks/1`).flush({ ...mockTasks[0], ...payload });
      expect(emitted).toBe(true);
    });
  });

  describe('readMyTask', () => {
    it('should return an observable with user tasks expanded with project', () => {
      let result: Task[] = [];
      service.readMyTask().subscribe((data) => (result = data));

      httpMock.expectOne(`${API}/tasks?userId=1&_expand=project`).flush(mockTasks);

      expect(result.length).toBe(4);
    });

    it('should make a GET request to the correct endpoint', () => {
      service.readMyTask().subscribe();
      const req = httpMock.expectOne(`${API}/tasks?userId=1&_expand=project`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
