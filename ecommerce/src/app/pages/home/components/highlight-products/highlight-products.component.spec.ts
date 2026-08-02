import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightProducts } from './highlight-products';

describe('HighlightProducts', () => {
  let component: HighlightProducts;
  let fixture: ComponentFixture<HighlightProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(HighlightProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
