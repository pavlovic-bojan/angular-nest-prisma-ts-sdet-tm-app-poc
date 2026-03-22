import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  readonly userId = input<string | null>(null);
  readonly closed = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

  isEdit = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.isEdit = true;
        void this.userService.getById(id).then(user => {
          if (user) {
            this.form.patchValue({ name: user.name, email: user.email, role: user.role });
          }
        });
      } else {
        this.isEdit = false;
        this.form.reset({ name: '', email: '', role: '' });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const { name, email, role } = this.form.getRawValue();
    const id = this.userId();
    if (this.isEdit && id) {
      const updated = await this.userService.update(id, { name, email, role });
      const current = this.auth.user();
      if (updated && current && current.id === id) {
        this.auth.setUser(updated);
      }
    } else {
      await this.userService.create({ name, email, role });
    }
    this.closed.emit();
  }
}
