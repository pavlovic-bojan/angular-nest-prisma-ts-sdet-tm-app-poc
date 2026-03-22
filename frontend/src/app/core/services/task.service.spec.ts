import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all tasks', async () => {
    const tasks = [
      {
        id: '1',
        title: 'T1',
        description: '',
        status: 'todo' as const,
        priority: 'medium' as const,
        projectId: 'p1',
        createdAt: '',
        updatedAt: '',
      },
    ];
    const p = service.getAll();
    http.expectOne(`${environment.apiUrl}/tasks`).flush({ data: tasks, total: 1, page: 1, limit: 50 });
    const result = await p;
    expect(result).toEqual(tasks);
  });

  it('should get task by id', async () => {
    const task = {
      id: '1',
      title: 'T1',
      description: '',
      status: 'todo' as const,
      priority: 'medium' as const,
      projectId: 'p1',
      createdAt: '',
      updatedAt: '',
    };
    const p = service.getById('1');
    http.expectOne(`${environment.apiUrl}/tasks/1`).flush(task);
    const result = await p;
    expect(result).toEqual(task);
  });

  it('should create a task', async () => {
    const created = {
      id: '1',
      title: 'New',
      description: '',
      status: 'todo' as const,
      priority: 'medium' as const,
      projectId: 'p1',
      createdAt: '',
      updatedAt: '',
    };
    const p = service.create({
      title: 'New',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: 'p1',
    });
    http.expectOne(`${environment.apiUrl}/tasks`).flush(created);
    const result = await p;
    expect(result.title).toBe('New');
  });
});
