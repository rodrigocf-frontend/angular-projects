import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from './icon';

describe('Icon', () => {
  let component: Icon;
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'kanban');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve kanban icon', () => {
    expect(component.iconClass()).toBe('fa-solid fa-table-columns');
  });

  it('should resolve tasks icon', () => {
    fixture.componentRef.setInput('name', 'tasks');
    expect(component.iconClass()).toBe('fa-solid fa-list');
  });

  it('should resolve calendar icon', () => {
    fixture.componentRef.setInput('name', 'calendar');
    expect(component.iconClass()).toBe('fa-regular fa-calendar');
  });

  it('should resolve add icon', () => {
    fixture.componentRef.setInput('name', 'add');
    expect(component.iconClass()).toBe('fa-solid fa-plus');
  });

  it('should resolve trash icon', () => {
    fixture.componentRef.setInput('name', 'trash');
    expect(component.iconClass()).toBe('fa-solid fa-trash');
  });

  it('should return empty string for unknown icon', () => {
    fixture.componentRef.setInput('name', 'nao-existe');
    expect(component.iconClass()).toBe('');
  });

  it('should update class reactively when name changes', () => {
    fixture.componentRef.setInput('name', 'check');
    expect(component.iconClass()).toBe('fa-solid fa-check');

    fixture.componentRef.setInput('name', 'alert');
    expect(component.iconClass()).toBe('fa-solid fa-circle-exclamation');
  });
});
