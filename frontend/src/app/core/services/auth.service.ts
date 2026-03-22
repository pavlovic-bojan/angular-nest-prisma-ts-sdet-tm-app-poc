import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'access_token';

interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = signal<User | null>(this.restoreUser());

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  private restoreUser(): User | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const stored = localStorage.getItem('current_user');
      if (token && stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // ignore malformed data
    }
    return null;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      );
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem('current_user', JSON.stringify(response.user));
      this.currentUser.set(response.user);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
  }

  setUser(user: User | null): void {
    this.currentUser.set(user);
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }
}
