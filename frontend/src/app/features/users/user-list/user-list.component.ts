import { Component, inject, computed, signal, effect } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DrawerComponent, ConfirmDialogComponent, TablePaginationComponent, UserFormComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly refreshTrigger = signal(0);

  readonly sortColumn = signal<keyof User | ''>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly users = signal<User[]>([]);

  drawerOpen = false;
  editingUserId: string | null = null;
  deleteDialogOpen = false;
  private itemToDelete: { id: string; name: string } | null = null;

  readonly deleteConfirmMessage = computed(() =>
    this.itemToDelete
      ? `Are you sure you want to delete the user "${this.itemToDelete.name}"? This action cannot be undone.`
      : ''
  );

  readonly sortedUsers = computed(() => {
    const data = [...this.users()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return data;
    return data.sort((a, b) => {
      const cmp = String(a[col] ?? '').localeCompare(String(b[col] ?? ''));
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedUsers().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.refreshTrigger();
      void this.load();
    });
  }

  async load(): Promise<void> {
    this.users.set(await this.userService.getAll());
  }

  sortBy(column: keyof User): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  openDrawer(userId: string | null): void {
    this.editingUserId = userId;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingUserId = null;
    this.refreshTrigger.update(v => v + 1);
  }

  openDeleteConfirm(id: string, name: string): void {
    this.itemToDelete = { id, name };
    this.deleteDialogOpen = true;
  }

  closeDeleteConfirm(): void {
    this.deleteDialogOpen = false;
    this.itemToDelete = null;
  }

  async confirmDelete(): Promise<void> {
    if (!this.itemToDelete) return;
    await this.userService.delete(this.itemToDelete.id);
    this.refreshTrigger.update(v => v + 1);
    this.currentPage.set(1);
    this.closeDeleteConfirm();
  }
}
