import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  readonly title = 'Angular Task Manager';
  readonly dropdownOpen = signal(false);
  readonly layout = inject(LayoutService);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen.set(false);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  toggleTheme(): void {
    this.theme.setTheme(this.theme.currentTheme() === 'dark' ? 'light' : 'dark');
  }

  openProfile(id: string): void {
    this.dropdownOpen.set(false);
    this.layout.openProfileDrawer(id);
  }

  logout(): void {
    this.dropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
