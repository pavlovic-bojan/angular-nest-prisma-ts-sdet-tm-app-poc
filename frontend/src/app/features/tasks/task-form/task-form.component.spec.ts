import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';

const mockProjects = [{ id: 'p1', name: 'Project 1' }];
const mockUsers = [{ id: 'u1', name: 'User 1' }];
const mockTask = {
  id: '1',
  title: 'T1',
  description: '',
  status: 'todo' as const,
  priority: 'medium' as const,
  projectId: 'p1',
  createdAt: '',
  updatedAt: '',
};

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const projectSpy = jasmine.createSpyObj('ProjectService', ['getAll']);
    projectSpy.getAll.and.returnValue(Promise.resolve(mockProjects as never));
    const userSpy = jasmine.createSpyObj('UserService', ['getAll']);
    userSpy.getAll.and.returnValue(Promise.resolve(mockUsers as never));
    const taskSpy = jasmine.createSpyObj('TaskService', ['getById', 'create', 'update']);
    taskSpy.getById.and.returnValue(Promise.resolve(mockTask));
    taskSpy.create.and.returnValue(Promise.resolve(mockTask));
    taskSpy.update.and.returnValue(Promise.resolve(mockTask));

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: ProjectService, useValue: projectSpy },
        { provide: UserService, useValue: userSpy },
        { provide: TaskService, useValue: taskSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have projects and users after load', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.projects().length).toBeGreaterThan(0);
    expect(component.users().length).toBeGreaterThan(0);
  });

  it('should call create when submitting new task', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.patchValue({
      title: 'New Task',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: 'p1',
      assigneeId: '',
    });
    const emitSpy = jasmine.createSpy();
    component.closed.subscribe(emitSpy);
    await component.onSubmit();
    expect(taskService.create).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call update when editing', async () => {
    fixture.componentRef.setInput('taskId', mockTask.id);
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.patchValue({ title: 'Updated' });
    await component.onSubmit();
    expect(taskService.update).toHaveBeenCalledWith(mockTask.id, jasmine.any(Object));
  });
});
