import { TestBed } from '@angular/core/testing';
import { TaskService } from './task-service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize todo with tasks', () => {
    expect(service.todo().length).toBeGreaterThan(0);
  });

  it('should initialize progress with tasks', () => {
    expect(service.progress().length).toBeGreaterThan(0);
  });

  it('should initialize done with tasks', () => {
    expect(service.done().length).toBeGreaterThan(0);
  });

  it('should add a task to todo via update', () => {
    const initial = service.todo().length;
    service.todo.update(items => [
      ...items,
      { id: 99, title: 'Nova', description: null, tag: 'Test', tagClass: 'tag-blue', dueDate: null, overdue: false, priority: 'low', status: 'todo' },
    ]);
    expect(service.todo().length).toBe(initial + 1);
  });

  it('should remove a task from progress via update', () => {
    const initial = service.progress().length;
    service.progress.update(items => items.slice(1));
    expect(service.progress().length).toBe(initial - 1);
  });

  it('should replace done list via set', () => {
    service.done.set([]);
    expect(service.done().length).toBe(0);
  });

  it('every todo task should have required fields', () => {
    service.todo().forEach(task => {
      expect(task.id).toBeDefined();
      expect(task.title).toBeTruthy();
      expect(task.priority).toMatch(/^(high|med|low)$/);
      expect(task.status).toBe('todo');
    });
  });

  it('every progress task should have status in-progress', () => {
    service.progress().forEach(task => {
      expect(task.status).toBe('in-progress');
    });
  });

  it('every done task should have status done', () => {
    service.done().forEach(task => {
      expect(task.status).toBe('done');
    });
  });
});
