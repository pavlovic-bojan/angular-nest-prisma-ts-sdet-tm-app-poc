import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all users', async () => {
    const users = [{ id: '1', name: 'U1', email: 'u@x.com', role: 'dev' }];
    const p = service.getAll();
    http.expectOne(`${environment.apiUrl}/users`).flush(users);
    const result = await p;
    expect(result).toEqual(users);
  });

  it('should create a user', async () => {
    const created = { id: '1', name: 'New', email: 'n@x.com', role: 'dev' };
    const prom = service.create({ name: 'New', email: 'n@x.com', role: 'dev' });
    http.expectOne(`${environment.apiUrl}/users`).flush(created);
    const result = await prom;
    expect(result.name).toBe('New');
  });
});
