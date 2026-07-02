import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Board } from './board';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
});
