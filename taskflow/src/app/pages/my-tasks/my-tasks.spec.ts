import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MyTasks } from './my-tasks';
import { Task } from '../../shared/dto/task.dto';

const API = 'http://localhost:3000';

const mockTasks: Task[] = [
  { id: '1', title: 'Task A', description: null, dueDate: null, overdue: false, priority: 'high', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '2', title: 'Task B', description: null, dueDate: null, overdue: false, priority: 'med', status: 'progress', tag: 'Core', tagClass: 'tag-blue', projectId: 1, userId: 1 },
  { id: '3', title: 'Task C', description: null, dueDate: null, overdue: false, priority: 'low', status: 'done', tag: 'Setup', tagClass: 'tag-green', projectId: 1, userId: 1 },
  { id: '4', title: 'Task D', description: null, dueDate: null, overdue: true, priority: 'low', status: 'todo', tag: 'Feature', tagClass: 'tag-blue', projectId: 1, userId: 1 },
];

describe('MyTasks', () => {
  let component: MyTasks;
  let fixture: ComponentFixture<MyTasks>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTasks],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MyTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne(`${API}/tasks?userId=1&_expand=project`).flush(mockTasks);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('todoTasks should contain only todo tasks', () => {
    expect(component.todoTasks().length).toBe(2);
    expect(component.todoTasks().every(t => t.status === 'todo')).toBe(true);
  });

  it('progressTasks should contain only progress tasks', () => {
    expect(component.progressTasks().length).toBe(1);
    expect(component.progressTasks()[0].status).toBe('progress');
  });

  it('doneTasks should contain only done tasks', () => {
    expect(component.doneTasks().length).toBe(1);
    expect(component.doneTasks()[0].status).toBe('done');
  });

  it('overdueTasks should contain only overdue tasks', () => {
    expect(component.overdueTasks().length).toBe(1);
    expect(component.overdueTasks()[0].overdue).toBe(true);
  });

  it('todoPercent should be 50 for 2 of 4 tasks', () => {
    expect(component.todoPercent()).toBe(50);
  });

  it('progressPercent should be 25 for 1 of 4 tasks', () => {
    expect(component.progressPercent()).toBe(25);
  });

  it('donePercent should be 25 for 1 of 4 tasks', () => {
    expect(component.donePercent()).toBe(25);
  });

  it('overduePercent should be 25 for 1 of 4 tasks', () => {
    expect(component.overduePercent()).toBe(25);
  });

  it('should render task rows', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.task-row').length).toBeGreaterThan(0);
  });

  it('should render 4 groups', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.group').length).toBe(4);
  });
});
