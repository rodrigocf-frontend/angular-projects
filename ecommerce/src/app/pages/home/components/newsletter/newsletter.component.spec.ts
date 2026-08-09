import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterComponent } from './newsletter.component';

describe('NewsletterComponent', () => {
  let fixture: ComponentFixture<NewsletterComponent>;
  let component: NewsletterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the newsletter title, email input and subscribe button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.newsletter-title')?.textContent).toContain('dentro');
    const input = compiled.querySelector('.newsletter-input') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(compiled.querySelector('.newsletter-btn')?.textContent).toContain('Assinar');
  });
});
