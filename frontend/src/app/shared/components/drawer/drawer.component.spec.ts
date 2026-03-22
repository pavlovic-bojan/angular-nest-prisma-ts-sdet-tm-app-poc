import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when open is false', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[aria-modal="true"]')).toBeFalsy();
  });

  it('should render when open is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[aria-modal="true"]')).toBeTruthy();
    expect(el.textContent).toContain('Test Title');
  });

  it('should emit close when close button clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const spy = jasmine.createSpy();
    component.close.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('button[aria-label="Close"]');
    btn?.click();
    expect(spy).toHaveBeenCalled();
  });
});
