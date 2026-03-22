import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and message when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Delete?');
    fixture.componentRef.setInput('message', 'Are you sure?');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Delete?');
    expect(el.textContent).toContain('Are you sure?');
  });

  it('should emit confirm when Confirm clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const spy = jasmine.createSpy();
    component.confirm.subscribe(spy);
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('button');
    const confirmBtn = Array.from(buttons).find((b) => b.textContent?.trim() === 'Confirm');
    if (confirmBtn) (confirmBtn as HTMLElement).click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel when Cancel clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const spy = jasmine.createSpy();
    component.cancel.subscribe(spy);
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((b) => b.textContent?.trim() === 'Cancel');
    if (cancelBtn) (cancelBtn as HTMLElement).click();
    expect(spy).toHaveBeenCalled();
  });
});
