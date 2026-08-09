import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OrderConfirmationComponent } from './order-confirmation.component';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  const address = 'Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('addressFormat', address);
    fixture.componentRef.setInput('total', 800);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the provided formatted address', () => {
    const rows = fixture.nativeElement.querySelectorAll('.summary-row');
    const addressRow = Array.from(rows).find((row) =>
      (row as HTMLElement).textContent?.includes('Endereço'),
    ) as HTMLElement;
    expect(addressRow.textContent).toContain(address);
  });

  it('renders the provided total via the currency pipe', () => {
    const totalRow = fixture.nativeElement.querySelector('.summary-total .summary-value');
    expect(totalRow.textContent).toContain('800');
  });

  it('reflects a new total input without depending on the store (post cart-clear fix)', async () => {
    // Regression coverage: this component takes `total` as a plain input rather than
    // reading `selectCartTotal` from the Store, so it keeps showing the order total even
    // after the parent dispatches clearCart() (which would zero out a store-derived value).
    fixture.componentRef.setInput('total', 950);
    fixture.detectChanges();
    await fixture.whenStable();

    const totalRow = fixture.nativeElement.querySelector('.summary-total .summary-value');
    expect(totalRow.textContent).toContain('950');
    expect(totalRow.textContent).not.toContain('800');
  });

  it('links to the products page and the home page', () => {
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.confirmation-actions a'),
    );
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/product/all');
    expect(links[1].getAttribute('href')).toBe('/');
  });
});
