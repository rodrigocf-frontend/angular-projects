import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar';
import { Project } from '../../../core/services/project-service/project-service';

const API = 'http://localhost:3000';

const mockProjects: Project[] = [
  { id: 1, name: 'Project A', description: '', color: '#5b6af0', deadline: null, total: 5 },
  { id: 2, name: 'Project B', description: '', color: '#22c55e', deadline: null, total: 3 },
];

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpMock.expectOne(`${API}/projects?sort=id`).flush(mockProjects);
    TestBed.flushEffects();
    httpMock.expectOne(`${API}/tasks?projectId=1`).flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 nav items', () => {
    expect(component.navItems.length).toBe(4);
  });

  it('first nav item should be Quadro', () => {
    expect(component.navItems[0].label).toBe('Quadro');
    expect(component.navItems[0].route).toBe('');
  });

  it('should load projects from service', () => {
    expect(component.navProjects().length).toBe(2);
  });

  it('should select first project after loading', () => {
    expect(component.currentProject()?.id).toBe(1);
  });

  it('onSelect should update selected project', () => {
    component.onSelect(1);
    TestBed.flushEffects();
    httpMock.expectOne(`${API}/tasks?projectId=2`).flush([]);
    expect(component.currentProject()?.id).toBe(2);
  });

  it('should render nav items in the template', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.nav-item').length).toBeGreaterThan(0);
  });

  it('progressFill should be 0 when no tasks are done', () => {
    expect(component.progressFill()).toBe(0);
  });
});
