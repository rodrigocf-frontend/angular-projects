import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import ProductCheckoutPageComponent from './product-checkout-page.component';
import { CheckoutStepperComponent } from './components/checkout-stepper/checkout-stepper.component';
import {
  selectCartIsEmpty,
  selectCartItems,
  selectCartTotal,
  selectTotalItems,
} from '../product-cart-page/store/product-cart.selectors';
import { clearCart } from '../product-cart-page/store/product-cart.actions';

const validAddress = {
  cep: '01310-100',
  address: 'Av. Paulista',
  number: '1000',
  complement: '',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

const validContact = {
  firstName: 'Maria',
  lastName: 'Silva',
  email: 'maria@mail.com',
  phone: '(11)99999-9999',
};

const validPayment = {
  cardNumber: '4111 1111 1111 1111',
  cardName: 'MARIA SILVA',
  expiry: '12/29',
  cvv: '123',
  installments: '1',
};

async function setup(cartIsEmpty = false, cartTotal = 500) {
  await TestBed.configureTestingModule({
    imports: [ProductCheckoutPageComponent],
    providers: [
      provideRouter([]),
      provideMockStore({
        selectors: [
          { selector: selectCartIsEmpty, value: cartIsEmpty },
          { selector: selectCartTotal, value: cartTotal },
          { selector: selectCartItems, value: [] },
          { selector: selectTotalItems, value: 0 },
        ],
      }),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductCheckoutPageComponent);
  const component = fixture.componentInstance;
  const store = TestBed.inject(MockStore);
  return { fixture, component, store };
}

describe('ProductCheckoutPageComponent', () => {
  let fixture: ComponentFixture<ProductCheckoutPageComponent>;
  let component: ProductCheckoutPageComponent;
  let store: MockStore;

  beforeEach(async () => {
    localStorage.clear();
    ({ fixture, component, store } = await setup());
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with isSubmitted false and orderTotal 0', () => {
    expect(component.isSubmitted()).toBe(false);
    expect(component.orderTotal()).toBe(0);
  });

  describe('progress persistence', () => {
    it('does not throw and keeps default forms when there is no saved progress', () => {
      expect(component.addressForm.get('cep')?.value).toBe('');
      expect(component.contactForm.get('firstName')?.value).toBe('');
    });

    it('saves address and contact form values to localStorage when the address step is submitted', () => {
      component.addressForm.patchValue(validAddress);
      component.onAddressFormSubmit();

      const saved = JSON.parse(localStorage.getItem('maison_checkout')!);
      expect(saved.addressForm.cep).toBe(validAddress.cep);
      expect(saved.addressForm.address).toBe(validAddress.address);
    });

    it('saves progress again when the contact step is submitted', () => {
      component.contactForm.patchValue(validContact);
      component.onContactFormSubmit();

      const saved = JSON.parse(localStorage.getItem('maison_checkout')!);
      expect(saved.contactForm.firstName).toBe('Maria');
      expect(saved.contactForm.email).toBe('maria@mail.com');
    });

    it('loads saved address and contact progress on init', async () => {
      localStorage.setItem(
        'maison_checkout',
        JSON.stringify({
          addressForm: validAddress,
          contactForm: validContact,
        }),
      );

      TestBed.resetTestingModule();
      const fresh = await setup();
      fresh.fixture.detectChanges();
      await fresh.fixture.whenStable();

      expect(fresh.component.addressForm.get('cep')?.value).toBe(validAddress.cep);
      expect(fresh.component.addressForm.get('city')?.value).toBe(validAddress.city);
      expect(fresh.component.contactForm.get('firstName')?.value).toBe(validContact.firstName);
      expect(fresh.component.contactForm.get('email')?.value).toBe(validContact.email);
    });

    it('deletes saved progress and marks submission complete on payment submit', () => {
      localStorage.setItem(
        'maison_checkout',
        JSON.stringify({ addressForm: validAddress, contactForm: validContact }),
      );

      component.onPaymentFormSubmit();

      expect(localStorage.getItem('maison_checkout')).toBeNull();
      expect(component.isSubmitted()).toBe(true);
    });
  });

  describe('payment submit ordering', () => {
    it('captures the cart total into orderTotal before dispatching clearCart', () => {
      let capturedTotalAtDispatch: number | null = null;
      // `dispatch` is overloaded (action object vs. dispatch-fn returning EffectRef); cast to
      // `any` so the mock implementation isn't forced into the (unused) EffectRef-returning shape.
      const dispatchSpy = vi.spyOn(store, 'dispatch') as any;
      dispatchSpy.mockImplementation(() => {
        capturedTotalAtDispatch = component.orderTotal();
      });

      component.onPaymentFormSubmit();

      expect(capturedTotalAtDispatch).toBe(500);
      expect(dispatchSpy).toHaveBeenCalledWith(clearCart());
    });

    it('sets orderTotal from the cart total signal', () => {
      component.onPaymentFormSubmit();
      expect(component.orderTotal()).toBe(500);
    });
  });

  describe('addressFormat computed', () => {
    it('builds a formatted address string reactively from the address form value', async () => {
      component.addressForm.patchValue({
        cep: '01310-100',
        address: 'Av. Paulista',
        number: '1000',
        complement: 'Apto 12',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      });

      expect(component.addressFormat()).toBe(
        'Av. Paulista, 1000 - Apto 12, Bela Vista, São Paulo - SP, 01310-100',
      );
    });

    it('omits the complement segment when it is empty', () => {
      component.addressForm.patchValue({
        cep: '01310-100',
        address: 'Av. Paulista',
        number: '1000',
        complement: '',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      });

      expect(component.addressFormat()).toBe(
        'Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100',
      );
    });

    it('returns an empty string for a fully empty form', () => {
      expect(component.addressFormat()).toBe('');
    });
  });

  describe('template', () => {
    it('renders the order summary when the cart is not empty', () => {
      expect(fixture.nativeElement.querySelector('app-order-summary')).toBeTruthy();
    });

    it('renders the address step by default', () => {
      expect(fixture.nativeElement.querySelector('app-address-step')).toBeTruthy();
    });
  });

  describe('full checkout flow (end-to-end through the real stepper)', () => {
    it('flows from address through payment, dispatches clearCart with the pre-clear total, and shows it on the confirmation step', async () => {
      vi.useFakeTimers();
      try {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        const stepperDebugEl = fixture.debugElement.query(By.directive(CheckoutStepperComponent));
        const stepper: CheckoutStepperComponent = stepperDebugEl.componentInstance;

        component.addressForm.patchValue(validAddress);
        stepper.selectStepByIndex(0);
        fixture.detectChanges();

        component.contactForm.patchValue(validContact);
        stepper.selectStepByIndex(1);
        fixture.detectChanges();

        component.paymentForm.patchValue(validPayment);
        stepper.selectStepByIndex(2);
        fixture.detectChanges();

        await vi.advanceTimersByTimeAsync(2000);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(dispatchSpy).toHaveBeenCalledWith(clearCart());
        expect(component.isSubmitted()).toBe(true);
        expect(localStorage.getItem('maison_checkout')).toBeNull();

        const totalEl = fixture.nativeElement.querySelector('.summary-total .summary-value');
        expect(totalEl).toBeTruthy();
        expect(totalEl.textContent).toContain('500');

        const addressEl = Array.from(fixture.nativeElement.querySelectorAll('.summary-row')).find(
          (row) => (row as HTMLElement).textContent?.includes('Endereço'),
        ) as HTMLElement;
        expect(addressEl.textContent).toContain('Av. Paulista');
      } finally {
        vi.useRealTimers();
      }
    });
  });
});

describe('ProductCheckoutPageComponent - empty cart', () => {
  let fixture: ComponentFixture<ProductCheckoutPageComponent>;

  beforeEach(async () => {
    localStorage.clear();
    ({ fixture } = await setup(true, 0));
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('does not render the order summary when the cart is empty', () => {
    expect(fixture.nativeElement.querySelector('app-order-summary')).toBeFalsy();
  });
});
