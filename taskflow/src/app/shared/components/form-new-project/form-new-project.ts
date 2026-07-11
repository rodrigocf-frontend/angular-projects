import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icon } from '../ui/icon/icon';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../../core/services/project-service/project-service';
import { SnackbarService } from '../../../core/services/snack-service/snack-service';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-form-new-project',
  imports: [ReactiveFormsModule, Icon, NgClass, Button],
  templateUrl: './form-new-project.html',
  styleUrl: './form-new-project.scss',
})
export class FormNewProject {
  private projectService = inject(ProjectService);
  private readonly snackService = inject(SnackbarService);

  visible = this.projectService.visible;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.maxLength(40), Validators.required]),
    description: new FormControl(''),
    color: new FormControl<string>(
      {
        value: '#5b6af0',
        disabled: false,
      },
      Validators.required,
    ),
    deadline: new FormControl(),
  });

  projectColors = [
    { name: 'Índigo', hex: '#5b6af0' },
    { name: 'Verde', hex: '#22c55e' },
    { name: 'Laranja', hex: '#f59e0b' },
    { name: 'Vermelho', hex: '#ef4444' },
    { name: 'Roxo', hex: '#a855f7' },
    { name: 'Ciano', hex: '#06b6d4' },
  ];

  private formValues = toSignal(this.formGroup.valueChanges, {
    initialValue: this.formGroup.value,
  });

  selectedColor = computed(() => this.formValues().color);
  nameLength = computed(() => this.formValues().name?.length ?? 0);

  clickColor(color: string) {
    this.formGroup.patchValue({
      color,
    });
  }

  closeNewProjectForm() {
    this.projectService.close();
    this.formGroup.reset({ color: '#5b6af0' });
  }

  submitNewProject() {
    if (this.formGroup.valid) {
      const values = this.formValues();
      this.projectService
        .create({
          payload: {
            color: values.color!,
            deadline: values.deadline!,
            description: values.description!,
            name: values.name!,
          },
        })
        .subscribe({
          complete: () => {
            this.snackService.success('Projeto criado com sucesso.');
            this.projectService.getAll().subscribe();
            this.closeNewProjectForm();
          },
        });
    }
  }
}
