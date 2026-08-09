import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingListComponent } from './loading-list.component';

describe('LoadingListComponent', () => {
  let component: LoadingListComponent;
  let fixture: ComponentFixture<LoadingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should default count to 9 and render 9 skeleton cards', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.count()).toBe(9);
    expect(component.items().length).toBe(9);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton-card').length).toBe(9);
  });

  it('should render a custom number of skeleton cards when count input is set', async () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.items().length).toBe(3);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton-card').length).toBe(3);
  });

  it('should render zero skeleton cards when count is 0', async () => {
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.skeleton-card').length).toBe(0);
  });
});
