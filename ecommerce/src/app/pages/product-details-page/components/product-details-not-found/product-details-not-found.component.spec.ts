import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ProductDetailsNotFoundComponent } from './product-details-not-found.component';

describe('ProductDetailsNotFoundComponent', () => {
  let component: ProductDetailsNotFoundComponent;
  let fixture: ComponentFixture<ProductDetailsNotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsNotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsNotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the 404 title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.not-found-eyebrow')?.textContent).toContain('404');
    expect(compiled.querySelector('.not-found-title')?.textContent).toContain('encontrado');
  });

  it('goToProducts should navigate to /product/all', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.goToProducts();
    expect(navigateSpy).toHaveBeenCalledWith(['/product/all']);
  });

  it('goHome should navigate to /', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.goHome();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should call goToProducts when "Ver coleções" is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>('button[primary]');
    button?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/product/all']);
  });

  it('should call goHome when "Voltar ao início" is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLButtonElement>('button[secondary]');
    button?.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
