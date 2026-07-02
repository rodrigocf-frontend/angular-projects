import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormNewTask } from './form-new-task';

describe('FormNewTask', () => {
  let component: FormNewTask;
  let fixture: ComponentFixture<FormNewTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewTask],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNewTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden initially', () => {
    expect(component.visible()).toBe(false);
  });

  it('form should be invalid when title is empty', () => {
    expect(component.formNewTask.invalid).toBe(true);
  });

  it('form should be valid when required fields are filled', () => {
    component.formNewTask.patchValue({ title: 'Minha tarefa' });
    expect(component.formNewTask.valid).toBe(true);
  });

  it('onSelectPriority should update priority control', () => {
    component.onSelectPriority('high');
    expect(component.formNewTask.get('priority')?.value).toBe('high');
  });

  it('closeNewTaskForm should reset form with default values', () => {
    component.formNewTask.patchValue({ title: 'Teste', priority: 'high' });
    component.closeNewTaskForm();
    expect(component.formNewTask.get('title')?.value).toBeFalsy();
    expect(component.formNewTask.get('priority')?.value).toBe('low');
  });

  it('should have 3 priority options', () => {
    expect(component.priorities.length).toBe(3);
  });

  it('should have 3 status options', () => {
    expect(component.status.length).toBe(3);
  });
});
