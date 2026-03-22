import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let originalLocalStorage: Storage;

  beforeAll(() => {
    originalLocalStorage = window.localStorage;
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true });
  });

  beforeEach(() => {
    const store: Record<string, string> = {};
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
    localStorageSpy.getItem.and.callFake((key: string) => store[key] ?? null);
    localStorageSpy.setItem.and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    localStorageSpy.removeItem.and.callFake((key: string) => { delete store[key]; });
    localStorageSpy.clear.and.callFake(() => { Object.keys(store).forEach(k => delete store[k]); });
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy, writable: true });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have currentTheme signal', () => {
    expect(service.currentTheme()).toBeDefined();
    expect(['light', 'dark']).toContain(service.currentTheme());
  });

  it('should set theme and persist to localStorage', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('app-theme', 'dark');

    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('should add dark class to document when dark theme', () => {
    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when light theme', () => {
    document.documentElement.classList.add('dark');
    service.setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
