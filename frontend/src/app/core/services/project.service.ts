import { Injectable, inject } from '@angular/core';
import { Project } from '../models/project.model';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private api = inject(ApiService);

  getAll(): Promise<Project[]> {
    return firstValueFrom(this.api.get<Project[]>('/projects'));
  }

  getById(id: string): Promise<Project | undefined> {
    return firstValueFrom(this.api.get<Project>(`/projects/${id}`)).catch(() => undefined);
  }

  create(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    return firstValueFrom(this.api.post<Project>('/projects', project));
  }

  update(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    return firstValueFrom(this.api.put<Project>(`/projects/${id}`, updates)).catch(() => undefined);
  }

  delete(id: string): Promise<boolean> {
    return firstValueFrom(this.api.delete<{ message: string }>(`/projects/${id}`))
      .then(() => true)
      .catch(() => false);
  }
}
