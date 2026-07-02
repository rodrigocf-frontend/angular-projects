import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewTask } from './form-new-task';

describe('FormNewTask', () => {
  let component: FormNewTask;
  let fixture: ComponentFixture<FormNewTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewTask],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNewTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
