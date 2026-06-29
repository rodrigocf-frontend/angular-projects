import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Board } from './board';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
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
});
