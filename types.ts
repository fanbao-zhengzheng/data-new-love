export enum TaskStatus {
  BACKLOG = 'backlog',
  BASKET = 'basket',
  COMPLETED = 'completed'
}

export enum QuadrantType {
  Q1 = 1, // Urgent & Important (Do First)
  Q2 = 2, // Not Urgent & Important (Schedule)
  Q3 = 3, // Urgent & Not Important (Delegate)
  Q4 = 4  // Not Urgent & Not Important (Eliminate)
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: QuadrantType;
  status: TaskStatus;
  created_at: string;
}

export interface QuadrantInfo {
  id: QuadrantType;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
}