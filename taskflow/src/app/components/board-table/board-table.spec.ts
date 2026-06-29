import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardTable } from './board-table';
import { TaskService } from '../../services/task-service/task-service';

describe('BoardTable', () => {
  let component: BoardTable;
  let fixture: ComponentFixture<BoardTable>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardTable);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('todo should reflect TaskService.todo signal', () => {
    expect(component.todo()).toEqual(taskService.todo());
  });

  it('progress should reflect TaskService.progress signal', () => {
    expect(component.progress()).toEqual(taskService.progress());
  });

  it('done should reflect TaskService.done signal', () => {
    expect(component.done()).toEqual(taskService.done());
  });

  it('todo should update when TaskService.todo changes', () => {
    const initial = component.todo().length;
    taskService.todo.update((items) => items.slice(1));
    expect(component.todo().length).toBe(initial - 1);
  });

  it('drop within same container should reorder items', () => {
    const [first, second] = component.todo();
    const arr = component.todo();
    const container = { data: arr };

    component.drop({
      previousContainer: container,
      container,
      previousIndex: 0,
      currentIndex: 1,
      item: { data: first },
    } as any);

    expect(component.todo()[0]).toEqual(second);
    expect(component.todo()[1]).toEqual(first);
  });

  it('drop between containers should transfer item', () => {
    const todoArr = component.todo();
    const progressArr = component.progress();
    const todoLength = todoArr.length;
    const progressLength = progressArr.length;
    const transferred = todoArr[0];

    component.drop({
      previousContainer: { data: todoArr },
      container: { data: progressArr },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: transferred },
    } as any);

    expect(todoArr.length).toBe(todoLength - 1);
    expect(progressArr.length).toBe(progressLength + 1);
    expect(progressArr[0]).toEqual(transferred);
  });

  it('should render 3 kanban columns', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cols = el.querySelectorAll('.col');
    expect(cols.length).toBe(3);
  });

  it('should render task cards for todo items', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('.task-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
