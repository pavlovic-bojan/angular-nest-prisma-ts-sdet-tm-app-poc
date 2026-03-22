import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';

const mockTasks = [
  { id: '1', title: 'T1', description: '', status: 'todo' as const, priority: 'medium' as const, projectId: 'p1', createdAt: '', updatedAt: '' },
];
const mockProjects = [{ id: 'p1', name: 'Project 1', description: '', createdAt: '' }];
const mockUsers = [{ id: 'u1', name: 'User 1' }];

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getAll', 'delete']);
    taskSpy.getAll.and.returnValue(Promise.resolve(mockTasks as never));
    taskSpy.delete.and.returnValue(Promise.resolve(true));
    const projectSpy = jasmine.createSpyObj('ProjectService', ['getAll']);
    projectSpy.getAll.and.returnValue(Promise.resolve(mockProjects as never));
    const userSpy = jasmine.createSpyObj('UserService', ['getAll']);
    userSpy.getAll.and.returnValue(Promise.resolve(mockUsers as never));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: ProjectService, useValue: projectSpy },
        { provide: UserService, useValue: userSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks', () => {
    expect(component.tasks().length).toBeGreaterThan(0);
  });

  it('getProjectName should return project name or dash', () => {
    const project = component.projects()[0];
    expect(component.getProjectName(project.id)).toBe(project.name);
    expect(component.getProjectName('unknown')).toBe('-');
  });

  it('getStatusClass should return correct class', () => {
    expect(component.getStatusClass('todo')).toContain('bg-slate');
    expect(component.getStatusClass('in-progress')).toContain('bg-amber');
    expect(component.getStatusClass('done')).toContain('bg-green');
  });

  it('should open and close drawer', () => {
    component.openDrawer('1');
    expect(component.drawerOpen).toBe(true);
    component.closeDrawer();
    expect(component.drawerOpen).toBe(false);
  });

  it('should sort by column', () => {
    component.sortBy('title');
    expect(component.sortColumn()).toBe('title');
  });
});
