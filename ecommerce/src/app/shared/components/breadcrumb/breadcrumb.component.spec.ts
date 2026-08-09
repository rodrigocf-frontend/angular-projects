import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should always render the Home link', async () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a')?.textContent).toContain('Home');
  });

  it('should render no path segments when data is empty', async () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.breadcrumb-current').length).toBe(0);
    expect(compiled.querySelectorAll('.breadcrumb-sep').length).toBe(0);
  });

  it('should render a segment with separator for each path entry', async () => {
    fixture.componentRef.setInput('data', ['Produtos', 'Vestidos']);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const segments = compiled.querySelectorAll('.breadcrumb-current');
    const seps = compiled.querySelectorAll('.breadcrumb-sep');
    expect(segments.length).toBe(2);
    expect(seps.length).toBe(2);
    expect(segments[0].textContent).toContain('Produtos');
    expect(segments[1].textContent).toContain('Vestidos');
  });
});
