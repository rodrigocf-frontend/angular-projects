import { Project } from './project.dto';

export type TaskStatus = 'todo' | 'progress' | 'done';
export type TaskPriority = 'low' | 'med' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  overdue: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
  tagClass: string;
  projectId: number;
  userId: number;
}

export interface TaskWithProjectDto extends Task {
  project: Project;
}
