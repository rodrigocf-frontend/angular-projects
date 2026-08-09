import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoriesComponent } from './categories.component';
import { FiltersApiResponse } from '../../../../core/services/product/products.service';

const FILTERS_DATA: FiltersApiResponse = {
  categories: [
    { name: 'Vestidos', slug: 'vestidos', count: 48, img: 'https://img.test/vestidos.jpg' },
    { name: 'Blazers', slug: 'blazers', count: 24, img: 'https://img.test/blazers.jpg' },
  ],
  sizes: [{ name: 'M' }],
  colors: [{ name: 'Preto', hex: '#111111', checked: false }],
};

describe('CategoriesComponent', () => {
  let fixture: ComponentFixture<CategoriesComponent>;
  let component: CategoriesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.componentRef.setInput('data', FILTERS_DATA);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should render the section header', async () => {
    fixture.componentRef.setInput('data', FILTERS_DATA);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-section-header')).toBeTruthy();
  });

  it('should render a card for each category with name and count', async () => {
    fixture.componentRef.setInput('data', FILTERS_DATA);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.cat-card');
    expect(cards.length).toBe(2);
    expect(compiled.querySelector('.cat-name')?.textContent).toContain('Vestidos');
    expect(compiled.querySelector('.cat-count')?.textContent).toContain('48');
  });

  it('should link each category to the product listing with the category query param', async () => {
    fixture.componentRef.setInput('data', FILTERS_DATA);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // .querySelector('a') would match app-section-header's own link first; scope to a category card.
    const link = compiled.querySelector('.categories a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/product/all?category=vestidos');
  });

  it('should render no cards when the categories list is empty', async () => {
    fixture.componentRef.setInput('data', { ...FILTERS_DATA, categories: [] });
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.cat-card').length).toBe(0);
  });
});
