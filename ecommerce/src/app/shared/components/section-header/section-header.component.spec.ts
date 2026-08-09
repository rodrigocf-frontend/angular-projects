import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  let fixture: ComponentFixture<SectionHeaderComponent>;
  let component: SectionHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Comprar por');
    fixture.componentRef.setInput('emphasys', 'categoria');
    fixture.componentRef.setInput('link', ['/product/all']);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title and emphasys text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h2');
    expect(heading?.textContent).toContain('Comprar por');
    expect(heading?.querySelector('em')?.textContent).toContain('categoria');
  });

  it('should render the "Ver todos" link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.textContent).toContain('Ver todos');
    expect(link?.getAttribute('href')).toBe('/product/all');
  });

  it('should update the link href when the link input changes', async () => {
    fixture.componentRef.setInput('link', '/other');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/other');
  });
});
