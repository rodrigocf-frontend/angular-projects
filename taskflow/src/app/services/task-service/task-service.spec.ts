import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../loading-service/loading-service';
import { Task, TaskService } from './task-service';

const API = 'http://localhost:3000';

const mockTasks: Task[] = [
  { id: '1', title: 'Task A', description: null, dueDate: null, overdue: false, priority: 'high', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '2', title: 'Task B', description: null, dueDate: null, overdue: false, priority: 'med', status: 'progress', tag: 'Core', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '3', title: 'Task C', description: null, dueDate: null, overdue: false, priority: 'low', status: 'done', tag: 'Setup', tagClass: 'tag-green', projectId: 1, userId: 1 },
  { id: '4', title: 'Task D', description: null, dueDate: null, overdue: true, priority: 'low', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
];

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty signals', () => {
    expect(service.todoList().length).toBe(0);
    expect(service.progressList().length).toBe(0);
    expect(service.doneList().length).toBe(0);
    expect(service.overdueList().length).toBe(0);
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
    it('should populate todoList after readTasks', () => {
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(service.todoList().length).toBe(2);
      expect(service.todoList().every(t => t.status === 'todo')).toBe(true);
    });

    it('should populate progressList after readTasks', () => {
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(service.progressList().length).toBe(1);
      expect(service.progressList()[0].status).toBe('progress');
    });

    it('should populate doneList after readTasks', () => {
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(service.doneList().length).toBe(1);
      expect(service.doneList()[0].status).toBe('done');
    });

    it('should populate overdueList with overdue tasks', () => {
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(service.overdueList().length).toBe(1);
      expect(service.overdueList()[0].overdue).toBe(true);
    });

    it('should stop loading after successful fetch', () => {
      const loadingService = TestBed.inject(LoadingService);
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);
      expect(loadingService.isLoading()).toBe(false);
    });

    it('should stop loading after fetch error', () => {
      const loadingService = TestBed.inject(LoadingService);
      service.readTasks(1);
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush('error', { status: 500, statusText: 'Server Error' });
      expect(loadingService.isLoading()).toBe(false);
    });
  });

  describe('createTask', () => {
    it('should POST task and reload tasks for the same project', () => {
      const payload = { title: 'New Task', status: 'todo', priority: 'low', projectId: 1 };
      service.createTask(payload);

      httpMock.expectOne(`${API}/tasks`).flush({ id: '99', ...payload });
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);

      expect(service.todoList().length).toBe(2);
    });

    it('should start loading when creating a task', () => {
      const loadingService = TestBed.inject(LoadingService);
      const payload = { title: 'New Task', status: 'todo', priority: 'low', projectId: 1 };
      service.createTask(payload);

      expect(loadingService.isLoading()).toBe(true);

      httpMock.expectOne(`${API}/tasks`).flush({ id: '99', ...payload });
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush([]);
    });
  });

  describe('updateTask', () => {
    it('should PATCH task and refetch tasks', () => {
      const payload: Partial<Task> = { id: '1', title: 'Updated', status: 'progress', projectId: 1 };
      service.updateTask(payload);

      httpMock.expectOne(`${API}/tasks/1`).flush({ ...mockTasks[0], ...payload });
      httpMock.expectOne(`${API}/tasks?projectId=1`).flush(mockTasks);

      expect(service.progressList().length).toBe(1);
    });
  });

  describe('readMyTask', () => {
    it('should return an observable with user tasks expanded with project', () => {
      let result: Task[] = [];
      service.readMyTask().subscribe(data => (result = data));

      httpMock.expectOne(`${API}/tasks?userId=1&_expand=project`).flush(mockTasks);

      expect(result.length).toBe(4);
    });
  });
});
