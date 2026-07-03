import { Component, effect, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';
import {
  Task,
  TaskPriority,
  TaskService,
  TaskStatus,
} from '../../services/task-service/task-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../services/project-service/project-service';

@Component({
  selector: 'app-form-new-task',
  imports: [Button, Icon, ReactiveFormsModule],
  templateUrl: './form-new-task.html',
  styleUrl: './form-new-task.scss',
})
export class FormNewTask {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  visible = this.taskService.visible;
  edittingTask = this.taskService.editTaskData;

  constructor() {
    effect(() => {
      const task = this.edittingTask();
      if (task) {
        this.formNewTask.patchValue({ ...task });
      }
    });
  }

  priorities: {
    value: TaskPriority;
    label: string;
    color: string;
  }[] = [
    { value: 'low', label: 'Baixa', color: '#22c55e' },
    { value: 'med', label: 'Média', color: '#f59e0b' },
    { value: 'high', label: 'Alta', color: '#ef4444' },
  ];

  tags = [
    { value: '', label: 'Nenhuma' },
    { value: 'Feature', label: 'Feature' },
    { value: 'Core', label: 'Core' },
    { value: 'Design', label: 'Design' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Shared', label: 'Shared' },
    { value: 'Setup', label: 'Setup' },
    { value: 'DevOps', label: 'DevOps' },
  ];

  status: {
    label: string;
    value: TaskStatus;
  }[] = [
    {
      value: 'todo',
      label: 'A fazer',
    },
    {
      value: 'progress',
      label: 'Em andamento',
    },
    {
      value: 'done',
      label: 'Concluído',
    },
  ];

  formNewTask = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    priority: new FormControl<TaskPriority>(
      {
        disabled: false,
        value: 'low',
      },
      [Validators.required],
    ),
    status: new FormControl('todo', [Validators.required]),
    tag: new FormControl(''),
    dueDate: new FormControl(''),
  });

  formValues = toSignal(this.formNewTask.valueChanges, {
    initialValue: {
      ...this.formNewTask.value,
    },
  });

  onSelectPriority(value: TaskPriority) {
    this.formNewTask.patchValue({
      priority: value,
    });
  }

  submitNewTask() {
    if (this.formNewTask.valid) {
      if (this.edittingTask()) {
        this.taskService.updateTask({
          ...(this.formValues() as Task),
          id: this.edittingTask()?.id,
          projectId: this.projectService.selectedProject()?.id,
        });
      } else {
        this.taskService.createTask({
          ...this.formValues(),
          projectId: this.projectService.selectedProject()?.id,
        });
      }
      this.closeNewTaskForm();
    }
  }

  closeNewTaskForm() {
    this.taskService.close();
    this.formNewTask.reset({
      tag: '',
      priority: 'low',
    });
  }
}
