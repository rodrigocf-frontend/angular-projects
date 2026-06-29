import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 nav items', () => {
    expect(component.navItems.length).toBe(4);
  });

  it('should have 3 projects', () => {
    expect(component.navProjects.length).toBe(3);
  });

  it('should compute progress as percentage', () => {
    component.completedTasks.set(6);
    component.totalTasks.set(12);
    expect(component.progress()).toBe(50);
  });

  it('should compute 100% when all tasks done', () => {
    component.completedTasks.set(10);
    component.totalTasks.set(10);
    expect(component.progress()).toBe(100);
  });

  it('should compute 0% when no tasks done', () => {
    component.completedTasks.set(0);
    component.totalTasks.set(10);
    expect(component.progress()).toBe(0);
  });

  it('should update projectActive on onSelect', () => {
    component.onSelect(2);
    expect(component.projectActive()).toBe(2);
  });

  it('should render nav items in the template', () => {
    const el: HTMLElement = fixture.nativeElement;
    const navItems = el.querySelectorAll('.nav-item');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('first nav item should be Quadro', () => {
    expect(component.navItems[0].label).toBe('Quadro');
    expect(component.navItems[0].route).toBe('');
  });
});
