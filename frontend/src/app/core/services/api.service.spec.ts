import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET from correct URL', () => {
    const data = { id: '1' };
    service.get<{ id: string }>('/users').subscribe((res) => expect(res).toEqual(data));
    const req = http.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should POST to correct URL with body', () => {
    const body = { name: 'Test' };
    const data = { id: '1', name: 'Test' };
    service.post<typeof data>('/users', body).subscribe((res) => expect(res).toEqual(data));
    const req = http.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(data);
  });

  it('should PUT to correct URL with body', () => {
    const body = { name: 'Updated' };
    service.put<{ id: string }>('/users/1', body).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('should DELETE correct URL', () => {
    service.delete('/users/1').subscribe();
    const req = http.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
