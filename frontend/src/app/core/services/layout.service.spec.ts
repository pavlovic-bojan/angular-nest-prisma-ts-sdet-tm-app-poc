import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have sidebar open by default', () => {
    expect(service.isSidebarOpen()).toBe(true);
  });

  it('should toggle sidebar', () => {
    const initial = service.isSidebarOpen();
    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(!initial);
    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(initial);
  });

  it('should have profile drawer closed by default', () => {
    expect(service.isProfileDrawerOpen()).toBe(false);
    expect(service.currentProfileUserId()).toBeNull();
  });

  it('should open profile drawer with user id', () => {
    service.openProfileDrawer('user-123');
    expect(service.isProfileDrawerOpen()).toBe(true);
    expect(service.currentProfileUserId()).toBe('user-123');
  });

  it('should close profile drawer', () => {
    service.openProfileDrawer('user-123');
    service.closeProfileDrawer();
    expect(service.isProfileDrawerOpen()).toBe(false);
    expect(service.currentProfileUserId()).toBeNull();
  });
});
