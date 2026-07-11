export interface Project {
  name: string;
  description: string;
  color: string;
  deadline: string | null;
  total: number;
  id: number;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  color: string;
  deadline: string | null;
}
