import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Board } from './board';
import { TaskService } from '../../core/services/task-service/task-service';
import { Task } from '../../shared/dto/task.dto';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render board-table', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-board-table')).toBeTruthy();
  });

  it('todoList should start empty', () => {
    expect(component.todoList().length).toBe(0);
  });

  it('progressList should start empty', () => {
    expect(component.progressList().length).toBe(0);
  });

  it('doneList should start empty', () => {
    expect(component.doneList().length).toBe(0);
  });

  it('editTask should call taskService.edit with the payload', () => {
    const taskService = TestBed.inject(TaskService);
    const spy = vi.spyOn(taskService, 'edit').mockImplementation(() => {});
    const task = { id: '1', title: 'Task A', status: 'todo' } as Task;
    component.editTask(task);
    expect(spy).toHaveBeenCalledWith(task);
  });

  it('onDropTask should call taskService.updateTask with the payload', () => {
    const taskService = TestBed.inject(TaskService);
    const spy = vi.spyOn(taskService, 'updateTask').mockReturnValue(of({}) as any);
    const payload = { id: '1', status: 'progress' } as Partial<Task>;
    component.onDropTask(payload);
    expect(spy).toHaveBeenCalledWith(payload);
  });
});
