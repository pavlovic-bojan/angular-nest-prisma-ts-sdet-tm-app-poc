import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty error message initially', () => {
    expect(component.errorMessage()).toBe('');
  });

  it('should show error on invalid credentials', async () => {
    component.form.patchValue({ email: 'wrong@test.com', password: 'wrong' });
    component.onSubmit();
    http.expectOne(`${environment.apiUrl}/auth/login`).error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(component.errorMessage()).toBe('Invalid email or password');
  });

  it('should navigate to /tasks on valid login', async () => {
    spyOn(router, 'navigate');
    component.form.patchValue({ email: 'demo@example.com', password: 'password123' });
    component.onSubmit();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({
      access_token: 'test-jwt-token',
      user: { id: '1', email: 'demo@example.com', name: 'Demo' },
    });
    await fixture.whenStable();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('form should be invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });
});
