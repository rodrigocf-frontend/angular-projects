import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewProject } from './form-new-project';

describe('FormNewProject', () => {
  let component: FormNewProject;
  let fixture: ComponentFixture<FormNewProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewProject],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNewProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
