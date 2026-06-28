import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Button } from '../ui/button/button';
import { Icon } from '../ui/icon/icon';

@Component({
  selector: 'app-board-table',
  templateUrl: 'board-table.html',
  styleUrl: 'board-table.scss',
  imports: [CdkDropList, CdkDrag, Button, Icon],
})
export class BoardTable {
  todo = [
    {
      id: 9,
      title: 'Configurar rotas lazy loading',
      description: 'Definir loadChildren nos módulos de features',
      tag: 'Angular',
      tagClass: 'tag-blue',
      dueDate: 'Amanhã',
      overdue: false,
      priority: 'med',
      status: 'todo',
    },
    {
      id: 10,
      title: 'Criar pipe de formatação de data',
      description: null,
      tag: 'Shared',
      tagClass: 'tag-blue',
      dueDate: 'Sexta',
      overdue: false,
      priority: 'low',
      status: 'todo',
    },
    {
      id: 11,
      title: 'Task board com drag and drop (CDK)',
      description: null,
      tag: 'Feature',
      tagClass: 'tag-blue',
      dueDate: 'Sexta',
      overdue: false,
      priority: 'high',
      status: 'todo',
    },
    {
      id: 12,
      title: 'Modal de detalhes da tarefa',
      description: null,
      tag: 'Feature',
      tagClass: 'tag-blue',
      dueDate: 'Sexta',
      overdue: false,
      priority: 'med',
      status: 'todo',
    },
    {
      id: 13,
      title: 'Tela Minhas tarefas',
      description: null,
      tag: 'Feature',
      tagClass: 'tag-blue',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'todo',
    },
    {
      id: 14,
      title: 'Deploy (Vercel + Railway)',
      description: null,
      tag: 'DevOps',
      tagClass: 'tag-blue',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'todo',
    },
  ];

  progress = [
    {
      id: 6,
      title: 'Implementar TaskService com HttpClient',
      description: 'CRUD completo + tratamento de erros via interceptor',
      tag: 'Core',
      tagClass: 'tag-blue',
      dueDate: 'Hoje',
      overdue: true,
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: 7,
      title: 'Montar Reactive Form de criação',
      description: 'Validações customizadas + feedback visual',
      tag: 'Feature',
      tagClass: 'tag-blue',
      dueDate: 'Hoje',
      overdue: false,
      priority: 'med',
      status: 'in-progress',
    },
    {
      id: 8,
      title: 'Estilizar componentes shared',
      description: null,
      tag: 'Design',
      tagClass: 'tag-blue',
      dueDate: 'Quinta',
      overdue: false,
      priority: 'low',
      status: 'in-progress',
    },
  ];

  done = [
    {
      id: 1,
      title: 'Estrutura de pastas do projeto',
      description: null,
      tag: 'Setup',
      tagClass: 'tag-green',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'done',
    },
    {
      id: 2,
      title: 'Configurar json-server como fake API',
      description: null,
      tag: 'Setup',
      tagClass: 'tag-green',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'done',
    },
    {
      id: 3,
      title: 'AuthGuard e interceptor de erros',
      description: null,
      tag: 'Core',
      tagClass: 'tag-green',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'done',
    },
    {
      id: 4,
      title: 'Design system e tokens SCSS',
      description: null,
      tag: 'Design',
      tagClass: 'tag-green',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'done',
    },
    {
      id: 5,
      title: 'Componente Sidebar',
      description: null,
      tag: 'Feature',
      tagClass: 'tag-green',
      dueDate: null,
      overdue: false,
      priority: 'low',
      status: 'done',
    },
  ];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
