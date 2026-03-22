import { Component, inject, computed, signal, effect } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [StatusLabelPipe, DateFormatPipe, DrawerComponent, ConfirmDialogComponent, TablePaginationComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly refreshTrigger = signal(0);

  readonly sortColumn = signal<keyof Task | ''>('updatedAt');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly tasks = signal<Task[]>([]);
  readonly projects = signal<{ id: string; name: string }[]>([]);

  drawerOpen = false;
  editingTaskId: string | null = null;
  deleteDialogOpen = false;
  private itemToDelete: { id: string; name: string } | null = null;

  readonly deleteConfirmMessage = computed(() =>
    this.itemToDelete
      ? `Are you sure you want to delete the task "${this.itemToDelete.name}"? This action cannot be undone.`
      : ''
  );

  readonly sortedTasks = computed(() => {
    const data = [...this.tasks()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return data;
    return data.sort((a, b) => {
      let aVal: string | number = (a[col as keyof Task] as string | number) ?? '';
      let bVal: string | number = (b[col as keyof Task] as string | number) ?? '';
      if (col === 'projectId') {
        aVal = this.getProjectName(aVal as string);
        bVal = this.getProjectName(bVal as string);
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly paginatedTasks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedTasks().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.refreshTrigger();
      void this.load();
    });
  }

  async load(): Promise<void> {
    const [t, p] = await Promise.all([
      this.taskService.getAll(),
      this.projectService.getAll(),
    ]);
    this.tasks.set(t);
    this.projects.set(p);
  }

  sortBy(column: keyof Task): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'updatedAt' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  openDrawer(taskId: string | null): void {
    this.editingTaskId = taskId;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingTaskId = null;
    this.refreshTrigger.update(v => v + 1);
  }

  getProjectName(id: string): string {
    return this.projects().find(p => p.id === id)?.name ?? '-';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      todo: 'bg-slate-200 text-slate-700',
      'in-progress': 'bg-amber-200 text-amber-800',
      done: 'bg-green-200 text-green-800',
    };
    return map[status] ?? 'bg-slate-200';
  }

  openDeleteConfirm(id: string, title: string): void {
    this.itemToDelete = { id, name: title };
    this.deleteDialogOpen = true;
  }

  closeDeleteConfirm(): void {
    this.deleteDialogOpen = false;
    this.itemToDelete = null;
  }

  async confirmDelete(): Promise<void> {
    if (!this.itemToDelete) return;
    await this.taskService.delete(this.itemToDelete.id);
    this.refreshTrigger.update(v => v + 1);
    this.currentPage.set(1);
    this.closeDeleteConfirm();
  }
}
