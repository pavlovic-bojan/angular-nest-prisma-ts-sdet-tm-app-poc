import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../../core/services/project.service';
import { environment } from '../../../../environments/environment';

const mockProjects = [
  { id: '1', name: 'P1', description: '', createdAt: '2024-01-01' },
  { id: '2', name: 'P2', description: '', createdAt: '2024-01-02' },
];

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent, HttpClientTestingModule],
      providers: [ProjectService],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/projects`).flush(mockProjects);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects', () => {
    expect(component.projects().length).toBeGreaterThan(0);
  });

  it('should open drawer for new project', () => {
    component.openDrawer(null);
    expect(component.drawerOpen).toBe(true);
    expect(component.editingProjectId).toBeNull();
  });

  it('should open drawer for edit', () => {
    const projects = component.projects();
    component.openDrawer(projects[0].id);
    expect(component.drawerOpen).toBe(true);
    expect(component.editingProjectId).toBe(projects[0].id);
  });

  it('should close drawer', () => {
    component.openDrawer('1');
    component.closeDrawer();
    expect(component.drawerOpen).toBe(false);
    expect(component.editingProjectId).toBeNull();
  });

  it('should sort by column', () => {
    component.sortBy('name');
    expect(component.sortColumn()).toBe('name');
    // First sortBy('name') toggles asc->desc since name is already selected
    expect(component.sortDirection()).toBe('desc');
    component.sortBy('description');
    expect(component.sortColumn()).toBe('description');
    expect(component.sortDirection()).toBe('asc');
  });

  it('should open delete confirm', () => {
    component.openDeleteConfirm('1', 'Test');
    expect(component.deleteDialogOpen).toBe(true);
    expect(component.deleteConfirmMessage()).toContain('Test');
  });

  it('should confirm delete', async () => {
    component.openDeleteConfirm('1', 'Test');
    const p = component.confirmDelete();
    http.expectOne(`${environment.apiUrl}/projects/1`).flush({ message: 'deleted' });
    await p;
    await fixture.whenStable();
    http.expectOne(`${environment.apiUrl}/projects`).flush(mockProjects);
    await fixture.whenStable();
    expect(component.deleteDialogOpen).toBe(false);
  });
});
