import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService, TasksAPIResponse } from './task-service';
import { LoadingService } from '../loading-service/loading-service';

const mockTasks: TasksAPIResponse[] = [
  { id: '1', title: 'Task A', description: null, dueDate: null, overdue: false, priority: 'high', status: 'todo', tag: 'Feature', tagClass: 'tag-blue' },
  { id: '2', title: 'Task B', description: null, dueDate: null, overdue: false, priority: 'med', status: 'progress', tag: 'Core', tagClass: 'tag-blue' },
  { id: '3', title: 'Task C', description: null, dueDate: null, overdue: false, priority: 'low', status: 'done', tag: 'Setup', tagClass: 'tag-green' },
  { id: '4', title: 'Task D', description: null, dueDate: null, overdue: false, priority: 'low', status: 'todo', tag: 'Feature', tagClass: 'tag-blue' },
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
    httpMock.expectOne('http://localhost:3000/tasks').flush([]);
    expect(service).toBeTruthy();
  });

  it('should populate todo signal with status todo', () => {
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.todo().length).toBe(2);
    expect(service.todo().every(t => t.status === 'todo')).toBe(true);
  });

  it('should populate progress signal with status progress', () => {
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.progress().length).toBe(1);
    expect(service.progress()[0].status).toBe('progress');
  });

  it('should populate done signal with status done', () => {
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.done().length).toBe(1);
    expect(service.done()[0].status).toBe('done');
  });

  it('should start empty before API responds', () => {
    expect(service.todo().length).toBe(0);
    expect(service.progress().length).toBe(0);
    expect(service.done().length).toBe(0);
    httpMock.expectOne('http://localhost:3000/tasks').flush([]);
  });

  it('should stop loading after success', () => {
    const loadingService = TestBed.inject(LoadingService);
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(loadingService.isLoading()).toBe(false);
  });

  it('should stop loading after error', () => {
    const loadingService = TestBed.inject(LoadingService);
    httpMock.expectOne('http://localhost:3000/tasks').flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
    expect(loadingService.isLoading()).toBe(false);
  });

  it('should allow manual update of todo signal', () => {
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    const initial = service.todo().length;
    service.todo.update(items => items.slice(1));
    expect(service.todo().length).toBe(initial - 1);
  });
});
