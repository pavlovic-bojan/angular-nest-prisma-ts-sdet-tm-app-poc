import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../../core/services/user.service';
import { environment } from '../../../../environments/environment';

const mockUsers = [
  { id: '1', name: 'U1', email: 'u1@test.com', role: 'developer' },
  { id: '2', name: 'U2', email: 'u2@test.com', role: 'admin' },
];

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [UserService],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/users`).flush(mockUsers);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users', () => {
    expect(component.users().length).toBeGreaterThan(0);
  });

  it('should open drawer for new user', () => {
    component.openDrawer(null);
    expect(component.drawerOpen).toBe(true);
  });

  it('should close drawer', () => {
    component.openDrawer('1');
    component.closeDrawer();
    expect(component.drawerOpen).toBe(false);
  });

  it('should sort by column', () => {
    component.sortBy('email');
    expect(component.sortColumn()).toBe('email');
  });
});
