import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getAll(): Promise<User[]> {
    return firstValueFrom(this.api.get<User[]>('/users'));
  }

  getById(id: string): Promise<User | undefined> {
    return firstValueFrom(this.api.get<User>(`/users/${id}`)).catch(() => undefined);
  }

  create(user: Omit<User, 'id'>): Promise<User> {
    return firstValueFrom(this.api.post<User>('/users', user));
  }

  update(id: string, updates: Partial<User>): Promise<User | undefined> {
    return firstValueFrom(this.api.put<User>(`/users/${id}`, updates)).catch(() => undefined);
  }

  delete(id: string): Promise<boolean> {
    return firstValueFrom(this.api.delete<{ message: string }>(`/users/${id}`))
      .then(() => true)
      .catch(() => false);
  }
}
