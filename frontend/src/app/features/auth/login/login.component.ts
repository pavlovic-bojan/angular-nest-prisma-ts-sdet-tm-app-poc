import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.errorMessage.set('');
    this.isLoading.set(true);
    try {
      const ok = await this.auth.login(
        this.form.getRawValue().email,
        this.form.getRawValue().password,
      );
      if (ok) {
        await this.router.navigate(['/tasks']);
      } else {
        this.errorMessage.set('Invalid email or password');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
