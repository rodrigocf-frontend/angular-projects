import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckoutStepperComponent } from './checkout-stepper.component';

function createAddressForm(): FormGroup {
  return new FormGroup({
    cep: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl('', Validators.required),
    complement: new FormControl(''),
    neighborhood: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
  });
}

function createContactForm(): FormGroup {
  return new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/),
    ]),
  });
}

function createPaymentForm(): FormGroup {
  return new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/),
    ]),
    cardName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    expiry: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
    ]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
    installments: new FormControl('1'),
  });
}

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

@Component({
  standalone: true,
  imports: [CheckoutStepperComponent, CdkStepperModule],
  template: `
    <app-checkout-stepper
      [addressForm]="addressForm"
      [contactForm]="contactForm"
      [paymentForm]="paymentForm"
      (onAddressFormSubmit)="addressSubmitted = addressSubmitted + 1"
      (onContactFormSubmit)="contactSubmitted = contactSubmitted + 1"
      (onPaymentFormSubmit)="paymentSubmitted = paymentSubmitted + 1"
    >
      <cdk-step><div class="step-address-content">Address</div></cdk-step>
      <cdk-step><div class="step-contact-content">Contact</div></cdk-step>
      <cdk-step><div class="step-payment-content">Payment</div></cdk-step>
      <cdk-step label="Confirmação"><div class="step-confirm-content">Confirmation</div></cdk-step>
    </app-checkout-stepper>
  `,
})
class HostComponent {
  addressForm = createAddressForm();
  contactForm = createContactForm();
  paymentForm = createPaymentForm();
  addressSubmitted = 0;
  contactSubmitted = 0;
  paymentSubmitted = 0;
}

describe('CheckoutStepperComponent', () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let stepperDebugEl: DebugElement;
  let stepper: CheckoutStepperComponent;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(HostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();

    stepperDebugEl = hostFixture.debugElement.query(By.directive(CheckoutStepperComponent));
    stepper = stepperDebugEl.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(stepper).toBeTruthy();
  });

  it('starts on step 0 with no step marked as completed', () => {
    expect(stepper.selectedIndex).toBe(0);
    expect(stepper.stepsCheckout().every((s) => !s.checked)).toBe(true);
  });

  describe('address step (index 0)', () => {
    it('marks the address form as touched and does not advance when invalid', () => {
      const touchSpy = vi.spyOn(host.addressForm, 'markAllAsTouched');
      stepper.selectStepByIndex(0);

      expect(touchSpy).toHaveBeenCalled();
      expect(stepper.selectedIndex).toBe(0);
      expect(host.addressSubmitted).toBe(0);
    });

    it('emits onAddressFormSubmit and advances to step 1 when valid', () => {
      host.addressForm.patchValue(validAddress);
      stepper.selectStepByIndex(0);

      expect(host.addressSubmitted).toBe(1);
      expect(stepper.selectedIndex).toBe(1);
      expect(stepper.stepsCheckout()[0].checked).toBe(true);
    });
  });

  describe('contact step (index 1)', () => {
    it('marks the contact form as touched and does not advance when invalid', () => {
      const touchSpy = vi.spyOn(host.contactForm, 'markAllAsTouched');
      stepper.selectStepByIndex(1);

      expect(touchSpy).toHaveBeenCalled();
      expect(stepper.selectedIndex).toBe(0);
      expect(host.contactSubmitted).toBe(0);
    });

    it('emits onContactFormSubmit and advances to step 2 when valid', () => {
      host.contactForm.patchValue(validContact);
      stepper.selectStepByIndex(1);

      expect(host.contactSubmitted).toBe(1);
      expect(stepper.selectedIndex).toBe(2);
      expect(stepper.stepsCheckout()[1].checked).toBe(true);
    });
  });

  describe('payment step (index 2)', () => {
    it('marks the payment form as touched and does not submit when invalid', () => {
      const touchSpy = vi.spyOn(host.paymentForm, 'markAllAsTouched');
      stepper.selectStepByIndex(2);

      expect(touchSpy).toHaveBeenCalled();
      expect(stepper.isSubmittingPayment()).toBe(false);
      expect(host.paymentSubmitted).toBe(0);
    });

    it('sets isSubmittingPayment immediately when valid, before the simulated delay resolves', () => {
      host.paymentForm.patchValue(validPayment);
      stepper.selectStepByIndex(2);

      expect(stepper.isSubmittingPayment()).toBe(true);
      expect(host.paymentSubmitted).toBe(0);
      expect(stepper.selectedIndex).toBe(0); // has not advanced yet
    });

    it('emits onPaymentFormSubmit and advances to the confirmation step after the delay', async () => {
      host.paymentForm.patchValue(validPayment);
      stepper.selectStepByIndex(2);

      await vi.advanceTimersByTimeAsync(2000);

      expect(stepper.isSubmittingPayment()).toBe(false);
      expect(host.paymentSubmitted).toBe(1);
      expect(stepper.selectedIndex).toBe(3);
      expect(stepper.stepsCheckout().every((s) => s.checked)).toBe(true);
    });

    it('ignores a second click while a submission is already in flight', async () => {
      host.paymentForm.patchValue(validPayment);
      stepper.selectStepByIndex(2);

      const touchSpy = vi.spyOn(host.paymentForm, 'markAllAsTouched');
      stepper.selectStepByIndex(2); // second click, should be a no-op guarded by isSubmittingPayment

      expect(touchSpy).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(2000);

      // only a single onPaymentFormSubmit was emitted, from the first click
      expect(host.paymentSubmitted).toBe(1);
    });

    it('clears the pending payment timeout when the component is destroyed, preventing a late submit', () => {
      host.paymentForm.patchValue(validPayment);
      stepper.selectStepByIndex(2);
      expect(stepper.isSubmittingPayment()).toBe(true);

      hostFixture.destroy();
      vi.advanceTimersByTime(2000);

      expect(host.paymentSubmitted).toBe(0);
    });
  });

  describe('template rendering', () => {
    it('renders one entry per configured step with numbers by default', () => {
      const stepEls = hostFixture.nativeElement.querySelectorAll('.steps .step');
      expect(stepEls.length).toBe(4);
      expect(stepEls[0].querySelector('.step-num').textContent.trim()).toBe('1');
      expect(stepEls[3].querySelector('.step-num').textContent.trim()).toBe('4');
    });

    it('marks the active step and shows a checkmark for completed steps', () => {
      host.addressForm.patchValue(validAddress);
      stepper.selectStepByIndex(0);
      hostFixture.detectChanges();

      const stepEls = hostFixture.nativeElement.querySelectorAll('.steps .step');
      expect(stepEls[0].classList.contains('done')).toBe(true);
      expect(stepEls[0].querySelector('.step-num').textContent.trim()).toBe('✓');
      expect(stepEls[1].classList.contains('active')).toBe(true);
    });

    it('shows the "Processando pagamento…" label and disables the submit button while submitting', () => {
      host.addressForm.patchValue(validAddress);
      stepper.selectStepByIndex(0);
      hostFixture.detectChanges();

      host.contactForm.patchValue(validContact);
      stepper.selectStepByIndex(1);
      hostFixture.detectChanges();

      host.paymentForm.patchValue(validPayment);
      stepper.selectStepByIndex(2);
      hostFixture.detectChanges();

      const submitBtn: HTMLButtonElement = hostFixture.nativeElement.querySelector(
        '.actions .submit-block button[primary]',
      );
      expect(submitBtn.textContent).toContain('Processando pagamento');
      expect(submitBtn.disabled).toBe(true);

      const backBtn: HTMLButtonElement = hostFixture.nativeElement.querySelector(
        '.actions .submit-block button[ghost]',
      );
      expect(backBtn.disabled).toBe(true);
    });

    it('walks through the full flow end-to-end via DOM clicks and lands on the confirmation step', async () => {
      host.addressForm.patchValue(validAddress);
      hostFixture.nativeElement
        .querySelectorAll('.actions .submit-block button[primary]')[0]
        .click();
      hostFixture.detectChanges();

      host.contactForm.patchValue(validContact);
      hostFixture.nativeElement
        .querySelectorAll('.actions .submit-block button[primary]')[0]
        .click();
      hostFixture.detectChanges();

      host.paymentForm.patchValue(validPayment);
      hostFixture.nativeElement.querySelector('.actions .submit-block button[primary]').click();
      hostFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(2000);
      hostFixture.detectChanges();

      expect(host.addressSubmitted).toBe(1);
      expect(host.contactSubmitted).toBe(1);
      expect(host.paymentSubmitted).toBe(1);
      expect(stepper.selectedIndex).toBe(3);
    });
  });
});
