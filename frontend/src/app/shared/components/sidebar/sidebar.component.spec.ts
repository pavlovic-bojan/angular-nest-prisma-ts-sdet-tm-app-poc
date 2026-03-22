import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Task Manager title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Task Manager');
  });

  it('should have links to tasks, users, projects', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Tasks');
    expect(el.textContent).toContain('Users');
    expect(el.textContent).toContain('Projects');
    const links = el.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });
});
