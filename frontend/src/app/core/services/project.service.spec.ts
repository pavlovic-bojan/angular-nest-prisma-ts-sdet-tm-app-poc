import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { environment } from '../../../environments/environment';

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all projects', async () => {
    const projects = [{ id: '1', name: 'P1', description: '', createdAt: '' }];
    const p = service.getAll();
    http.expectOne(`${environment.apiUrl}/projects`).flush(projects);
    const result = await p;
    expect(result).toEqual(projects);
  });

  it('should create a project', async () => {
    const created = { id: '1', name: 'New', description: '', createdAt: '' };
    const prom = service.create({ name: 'New', description: '' });
    http.expectOne(`${environment.apiUrl}/projects`).flush(created);
    const result = await prom;
    expect(result.name).toBe('New');
  });
});
