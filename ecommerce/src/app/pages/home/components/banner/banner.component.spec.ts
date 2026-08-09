import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let fixture: ComponentFixture<BannerComponent>;
  let component: BannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the banner title and call to action', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.banner-title')?.textContent).toContain('Club');
    expect(compiled.querySelector('.btn-light')?.textContent).toContain('Quero participar');
  });

  it('should render the three stat blocks', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const stats = compiled.querySelectorAll('.banner-stats > div');
    expect(stats.length).toBe(3);
  });
});
