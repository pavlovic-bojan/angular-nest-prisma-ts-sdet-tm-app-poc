import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent {
  readonly projectId = input<string | null>(null);
  readonly closed = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);

  isEdit = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.isEdit = true;
        void this.projectService.getById(id).then(project => {
          if (project) {
            this.form.patchValue({ name: project.name, description: project.description ?? '' });
          }
        });
      } else {
        this.isEdit = false;
        this.form.reset({ name: '', description: '' });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const { name, description } = this.form.getRawValue();
    const id = this.projectId();
    if (this.isEdit && id) {
      await this.projectService.update(id, { name, description: description ?? '' });
    } else {
      await this.projectService.create({ name, description: description ?? '' });
    }
    this.closed.emit();
  }
}
