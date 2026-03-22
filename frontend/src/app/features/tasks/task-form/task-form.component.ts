import { Component, inject, input, output, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  readonly taskId = input<string | null>(null);
  readonly closed = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);

  readonly projects = signal<{ id: string; name: string }[]>([]);
  readonly users = signal<{ id: string; name: string }[]>([]);
  isEdit = false;

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: ['todo' as Task['status'], Validators.required],
    priority: ['medium' as Task['priority'], Validators.required],
    projectId: ['', Validators.required],
    assigneeId: [''],
  });

  constructor() {
    void Promise.all([
      this.projectService.getAll(),
      this.userService.getAll(),
    ]).then(([p, u]) => {
      this.projects.set(p);
      this.users.set(u);
    });

    effect(() => {
      const id = this.taskId();
      if (id) {
        this.isEdit = true;
        void this.taskService.getById(id).then(task => {
          if (task) {
            this.form.patchValue({
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              priority: task.priority,
              projectId: task.projectId,
              assigneeId: task.assigneeId ?? '',
            });
          }
        });
      } else {
        this.isEdit = false;
        this.form.reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          projectId: this.projects()[0]?.id ?? '',
          assigneeId: '',
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: raw.title,
      description: raw.description ?? '',
      status: raw.status as Task['status'],
      priority: raw.priority as Task['priority'],
      projectId: raw.projectId,
      assigneeId: raw.assigneeId || undefined,
    };
    const id = this.taskId();
    if (this.isEdit && id) {
      await this.taskService.update(id, data);
    } else {
      await this.taskService.create(data);
    }
    this.closed.emit();
  }
}
