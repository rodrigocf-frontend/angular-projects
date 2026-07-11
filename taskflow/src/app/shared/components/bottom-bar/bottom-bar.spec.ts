import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomBar } from './bottom-bar';

describe('BottomBar', () => {
  let component: BottomBar;
  let fixture: ComponentFixture<BottomBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomBar],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render statusbar element', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.statusbar')).toBeTruthy();
  });

  it('should show json-server status', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('json-server');
  });

  it('should show branch name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('feat/task-service');
  });
});
