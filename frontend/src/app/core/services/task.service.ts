import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task } from '../models/task.model';
import { ApiService } from './api.service';

interface TasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly api = inject(ApiService);

  async getAll(): Promise<Task[]> {
    const response = await firstValueFrom(this.api.get<TasksResponse>('/tasks'));
    return response.data;
  }

  getById(id: string): Promise<Task | undefined> {
    return firstValueFrom(this.api.get<Task>(`/tasks/${id}`)).catch(() => undefined);
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return firstValueFrom(this.api.post<Task>('/tasks', task));
  }

  update(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    return firstValueFrom(this.api.put<Task>(`/tasks/${id}`, updates)).catch(() => undefined);
  }

  delete(id: string): Promise<boolean> {
    return firstValueFrom(this.api.delete<{ message: string }>(`/tasks/${id}`))
      .then(() => true)
      .catch(() => false);
  }
}
