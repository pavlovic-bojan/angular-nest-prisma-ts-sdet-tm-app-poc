import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { ProjectService } from '../../../core/services/project.service';

const mockProject = { id: '1', name: 'P1', description: 'Desc', createdAt: '2024-01-01' };

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', ['getById', 'create', 'update']);
    spy.getById.and.returnValue(Promise.resolve(mockProject));
    spy.create.and.returnValue(Promise.resolve(mockProject));
    spy.update.and.returnValue(Promise.resolve(mockProject));

    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent],
      providers: [{ provide: ProjectService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show Create when projectId is null', () => {
    fixture.componentRef.setInput('projectId', null);
    fixture.detectChanges();
    expect(component.isEdit).toBe(false);
  });

  it('should patch form when projectId is set', async () => {
    fixture.componentRef.setInput('projectId', mockProject.id);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isEdit).toBe(true);
    expect(component.form.get('name')?.value).toBe(mockProject.name);
  });

  it('should call create when submitting new project', async () => {
    fixture.detectChanges();
    component.form.patchValue({ name: 'New', description: '' });
    const emitSpy = jasmine.createSpy();
    component.closed.subscribe(emitSpy);
    await component.onSubmit();
    expect(projectService.create).toHaveBeenCalledWith({
      name: 'New',
      description: '',
    });
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call update when editing', async () => {
    fixture.componentRef.setInput('projectId', mockProject.id);
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.patchValue({ name: 'Updated', description: 'Desc' });
    await component.onSubmit();
    expect(projectService.update).toHaveBeenCalledWith(
      mockProject.id,
      jasmine.objectContaining({ name: 'Updated' })
    );
  });
});
