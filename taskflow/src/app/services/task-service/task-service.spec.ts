import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../loading-service/loading-service';
import { TaskService, TasksAPIResponse } from './task-service';

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
    expect(service).toBeTruthy();
  });

  it('should start with empty signals before fetchTasks is called', () => {
    expect(service.todoList().length).toBe(0);
    expect(service.progressList().length).toBe(0);
    expect(service.doneList().length).toBe(0);
  });

  it('should populate todoList with status todo after fetchTasks', () => {
    service.fetchTasks();
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.todoList().length).toBe(2);
    expect(service.todoList().every(t => t.status === 'todo')).toBe(true);
  });

  it('should populate progressList with status progress after fetchTasks', () => {
    service.fetchTasks();
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.progressList().length).toBe(1);
    expect(service.progressList()[0].status).toBe('progress');
  });

  it('should populate doneList with status done after fetchTasks', () => {
    service.fetchTasks();
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(service.doneList().length).toBe(1);
    expect(service.doneList()[0].status).toBe('done');
  });

  it('should stop loading after successful fetch', () => {
    const loadingService = TestBed.inject(LoadingService);
    service.fetchTasks();
    httpMock.expectOne('http://localhost:3000/tasks').flush(mockTasks);
    expect(loadingService.isLoading()).toBe(false);
  });

  it('should stop loading after fetch error', () => {
    const loadingService = TestBed.inject(LoadingService);
    service.fetchTasks();
    httpMock.expectOne('http://localhost:3000/tasks').flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
    expect(loadingService.isLoading()).toBe(false);
  });
});
