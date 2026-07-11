import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardTable } from './board-table';

const makeTasks = (status: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: `Task ${i + 1}`,
    description: null,
    tag: 'Feature',
    dueDate: null,
    overdue: false,
    priority: 'low' as const,
    status,
  }));

describe('BoardTable', () => {
  let component: BoardTable;
  let fixture: ComponentFixture<BoardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardTable);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('todo', makeTasks('todo', 3));
    fixture.componentRef.setInput('progress', makeTasks('progress', 2));
    fixture.componentRef.setInput('done', makeTasks('done', 1));

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect todo input', () => {
    expect(component.todo().length).toBe(3);
  });

  it('should reflect progress input', () => {
    expect(component.progress().length).toBe(2);
  });

  it('should reflect done input', () => {
    expect(component.done().length).toBe(1);
  });

  it('drop within same container should reorder items', () => {
    const arr = [...component.todo()];
    const [first, second] = arr;
    const container = { data: arr };

    component.drop({
      previousContainer: container,
      container,
      previousIndex: 0,
      currentIndex: 1,
      item: { data: first },
    } as any);

    expect(arr[0]).toEqual(second);
    expect(arr[1]).toEqual(first);
  });

  it('drop between containers should transfer item', () => {
    const todoArr = [...component.todo()];
    const progressArr = [...component.progress()];
    const transferred = todoArr[0];

    component.drop({
      previousContainer: { data: todoArr },
      container: { data: progressArr },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: transferred },
    } as any);

    expect(todoArr.length).toBe(2);
    expect(progressArr.length).toBe(3);
    expect(progressArr[0]).toEqual(transferred);
  });

  it('should render 3 kanban columns', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.col').length).toBe(3);
  });

  it('should render task cards', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.task-card').length).toBeGreaterThan(0);
  });

  it('cross-container drop should emit onDropTask with container id as status', () => {
    const todoArr = [...component.todo()];
    const progressArr = [...component.progress()];
    const transferred = todoArr[0];
    let emitted: any;
    component.onDropTask.subscribe((v) => (emitted = v));

    component.drop({
      previousContainer: { id: 'todo', data: todoArr },
      container: { id: 'progress', data: progressArr },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: transferred },
    } as any);

    expect(emitted).toMatchObject({ ...transferred, status: 'progress' });
  });

  it('tapTask should emit onClickTask with the task', () => {
    const task = component.todo()[0];
    let emitted: any;
    component.onClickTask.subscribe((v) => (emitted = v));
    component.tapTask(task as any);
    expect(emitted).toEqual(task);
  });
});
