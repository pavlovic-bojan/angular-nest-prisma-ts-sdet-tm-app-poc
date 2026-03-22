import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent', () => {
  let component: TablePaginationComponent;
  let fixture: ComponentFixture<TablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute totalPages', () => {
    expect(component.totalPages()).toBe(10);
  });

  it('should compute startItem and endItem', () => {
    expect(component.startItem()).toBe(1);
    expect(component.endItem()).toBe(10);
  });

  it('should emit pageChange when goToPage', () => {
    const spy = jasmine.createSpy();
    component.pageChange.subscribe(spy);
    component.goToPage(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should not emit when goToPage out of range', () => {
    const spy = jasmine.createSpy();
    component.pageChange.subscribe(spy);
    component.goToPage(0);
    component.goToPage(99);
    expect(spy).not.toHaveBeenCalled();
  });

  it('onPageSizeChange should emit pageSizeChange', () => {
    const spy = jasmine.createSpy();
    component.pageSizeChange.subscribe(spy);
    const fakeEvent = { target: { value: '25' } } as unknown as Event;
    component.onPageSizeChange(fakeEvent);
    expect(spy).toHaveBeenCalledWith(25);
  });
});
