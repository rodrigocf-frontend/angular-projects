import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand link and copyright', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-brand')?.textContent).toContain('Maison');
    expect(compiled.querySelector('.footer-copy')?.textContent).toContain('2026');
  });

  it('should render the footer link columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const columns = compiled.querySelectorAll('.footer-links');
    expect(columns.length).toBe(3);
  });

  it('should render social links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-socials')?.textContent).toContain('Instagram');
  });
});
