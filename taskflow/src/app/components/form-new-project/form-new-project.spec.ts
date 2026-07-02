import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormNewProject } from './form-new-project';

describe('FormNewProject', () => {
  let component: FormNewProject;
  let fixture: ComponentFixture<FormNewProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewProject],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNewProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden initially', () => {
    expect(component.visible()).toBe(false);
  });

  it('form should be invalid when name is empty', () => {
    expect(component.formGroup.invalid).toBe(true);
  });

  it('form should be valid when name is filled', () => {
    component.formGroup.patchValue({ name: 'Meu Projeto' });
    expect(component.formGroup.valid).toBe(true);
  });

  it('should have indigo as default color', () => {
    expect(component.formGroup.get('color')?.value).toBe('#5b6af0');
  });

  it('clickColor should update color control', () => {
    component.clickColor('#22c55e');
    expect(component.formGroup.get('color')?.value).toBe('#22c55e');
  });

  it('closeNewProjectForm should reset color to default', () => {
    component.clickColor('#ef4444');
    component.closeNewProjectForm();
    expect(component.formGroup.get('color')?.value).toBe('#5b6af0');
  });

  it('should have 6 color options', () => {
    expect(component.projectColors.length).toBe(6);
  });

  it('nameLength should reflect current name length', () => {
    component.formGroup.patchValue({ name: 'Abc' });
    expect(component.nameLength()).toBe(3);
  });
});
