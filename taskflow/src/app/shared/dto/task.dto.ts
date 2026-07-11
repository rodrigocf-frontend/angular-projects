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
  projectId: number;
  userId: number;
}

export interface TaskWithProjectDto extends Task {
  project: Project;
}

const tagClassMap: Record<string, string> = {
  Feature: 'tag-blue',
  Core: 'tag-blue',
  Design: 'tag-blue',
  Angular: 'tag-blue',
  Shared: 'tag-blue',
  Setup: 'tag-green',
  DevOps: 'tag-blue',
};

export function getTagClass(tag: string): string {
  return tagClassMap[tag] ?? 'tag-blue';
}
