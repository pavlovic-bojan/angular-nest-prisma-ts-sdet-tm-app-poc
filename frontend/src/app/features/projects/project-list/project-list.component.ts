import { Component, inject, computed, signal, effect } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination.component';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DateFormatPipe, DrawerComponent, ConfirmDialogComponent, TablePaginationComponent, ProjectFormComponent],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);
  private readonly refreshTrigger = signal(0);

  readonly sortColumn = signal<keyof Project | ''>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly projects = signal<Project[]>([]);

  drawerOpen = false;
  editingProjectId: string | null = null;
  deleteDialogOpen = false;
  private readonly itemToDelete = signal<{ id: string; name: string } | null>(null);

  readonly deleteConfirmMessage = computed(() =>
    this.itemToDelete()
      ? `Are you sure you want to delete the project "${this.itemToDelete()!.name}"? This action cannot be undone.`
      : ''
  );

  readonly sortedProjects = computed(() => {
    const data = [...this.projects()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return data;
    return data.sort((a, b) => {
      const cmp = String(a[col] ?? '').localeCompare(String(b[col] ?? ''));
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly paginatedProjects = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedProjects().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.refreshTrigger();
      void this.load();
    });
  }

  async load(): Promise<void> {
    this.projects.set(await this.projectService.getAll());
  }

  sortBy(column: keyof Project): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'createdAt' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  openDrawer(projectId: string | null): void {
    this.editingProjectId = projectId;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingProjectId = null;
    this.refreshTrigger.update(v => v + 1);
  }

  openDeleteConfirm(id: string, name: string): void {
    this.itemToDelete.set({ id, name });
    this.deleteDialogOpen = true;
  }

  closeDeleteConfirm(): void {
    this.deleteDialogOpen = false;
    this.itemToDelete.set(null);
  }

  async confirmDelete(): Promise<void> {
    if (!this.itemToDelete()) return;
    await this.projectService.delete(this.itemToDelete()!.id);
    this.refreshTrigger.update(v => v + 1);
    this.currentPage.set(1);
    this.closeDeleteConfirm();
  }
}
