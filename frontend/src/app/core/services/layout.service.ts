import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private sidebarOpen = signal(true);
  readonly isSidebarOpen = this.sidebarOpen.asReadonly();

  private profileDrawerOpen = signal(false);
  private profileUserId = signal<string | null>(null);
  readonly isProfileDrawerOpen = this.profileDrawerOpen.asReadonly();
  readonly currentProfileUserId = this.profileUserId.asReadonly();

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  openProfileDrawer(userId: string): void {
    this.profileUserId.set(userId);
    this.profileDrawerOpen.set(true);
  }

  closeProfileDrawer(): void {
    this.profileDrawerOpen.set(false);
    this.profileUserId.set(null);
  }
}
