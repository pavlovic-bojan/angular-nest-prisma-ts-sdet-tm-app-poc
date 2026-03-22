import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', async () => {
    const prom = service.login('demo@example.com', 'password123');
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({
      access_token: 'test-jwt-token',
      user: { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
    });
    const result = await prom;
    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.name).toBe('Demo User');
  });

  it('should reject invalid credentials', async () => {
    const prom = service.login('wrong@email.com', 'wrongpass');
    http.expectOne(`${environment.apiUrl}/auth/login`).flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' }
    );
    const result = await prom;
    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should logout and clear user', async () => {
    const prom = service.login('demo@example.com', 'password123');
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({
      access_token: 'test-jwt-token',
      user: { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
    });
    await prom;
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });
});
