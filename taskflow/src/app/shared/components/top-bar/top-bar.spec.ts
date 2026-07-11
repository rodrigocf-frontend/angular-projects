import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TopBar } from './top-bar';

describe('TopBar', () => {
  let component: TopBar;
  let fixture: ComponentFixture<TopBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBar],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render topbar element', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.topbar')).toBeTruthy();
  });

  it('should render search input', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('input')).toBeTruthy();
  });

  it('should render Nova tarefa button', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button');
    const labels = Array.from(buttons).map(b => b.textContent?.trim());
    expect(labels.some(t => t?.includes('Nova tarefa'))).toBe(true);
  });
});
