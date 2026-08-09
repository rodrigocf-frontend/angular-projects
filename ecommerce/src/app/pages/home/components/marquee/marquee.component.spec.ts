import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueeComponent } from './marquee.component';

describe('MarqueeComponent', () => {
  let fixture: ComponentFixture<MarqueeComponent>;
  let component: MarqueeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarqueeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarqueeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the marquee items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.marquee-item');
    expect(items.length).toBeGreaterThan(0);
    expect(compiled.querySelector('.marquee')?.textContent).toContain('Frete grátis');
  });
});
