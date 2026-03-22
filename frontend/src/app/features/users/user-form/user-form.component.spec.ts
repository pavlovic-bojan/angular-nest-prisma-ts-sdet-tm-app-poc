import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

const mockUser = { id: '1', name: 'U1', email: 'u1@test.com', role: 'developer' };

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getAll', 'getById', 'create', 'update']);
    spy.getAll.and.returnValue(Promise.resolve([mockUser] as never));
    spy.getById.and.returnValue(Promise.resolve(mockUser));
    spy.create.and.returnValue(Promise.resolve(mockUser));
    spy.update.and.returnValue(Promise.resolve(mockUser));

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: spy },
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call create for new user', async () => {
    fixture.detectChanges();
    component.form.patchValue({
      name: 'New User',
      email: 'new@test.com',
      role: 'developer',
    });
    await component.onSubmit();
    expect(userService.create).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@test.com',
      role: 'developer',
    });
  });

  it('should call update when editing', async () => {
    fixture.componentRef.setInput('userId', mockUser.id);
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.patchValue({ name: 'Updated' });
    await component.onSubmit();
    expect(userService.update).toHaveBeenCalledWith(mockUser.id, jasmine.any(Object));
  });
});
