import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeService } from '../../../core/services/theme.service';
import { environment } from '../../../../environments/environment';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let authService: AuthService;
  let layoutService: LayoutService;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent, HttpClientTestingModule],
      providers: [AuthService, LayoutService, ThemeService, provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);

    authService = TestBed.inject(AuthService);
    layoutService = TestBed.inject(LayoutService);
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('getInitials should return first+last initial for full name', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
  });

  it('getInitials should return first 2 chars for single name', () => {
    expect(component.getInitials('John')).toBe('JO');
  });

  it('toggleTheme should switch theme', () => {
    const theme = TestBed.inject(ThemeService);
    const initial = theme.currentTheme();
    component.toggleTheme();
    expect(theme.currentTheme()).not.toBe(initial);
  });

  it('openProfile should open layout drawer', () => {
    spyOn(layoutService, 'openProfileDrawer');
    component.openProfile('user-1');
    expect(layoutService.openProfileDrawer).toHaveBeenCalledWith('user-1');
  });

  it('logout should call auth and navigate', async () => {
    const loginProm = authService.login('demo@example.com', 'password123');
    http.expectOne(`${environment.apiUrl}/auth/login`).flush({
      access_token: 'test-jwt-token',
      user: { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
    });
    await loginProm;
    spyOn(authService, 'logout');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
