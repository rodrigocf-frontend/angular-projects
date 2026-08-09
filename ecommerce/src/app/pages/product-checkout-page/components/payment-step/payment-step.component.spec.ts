import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentStepComponent } from './payment-step.component';

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

describe('PaymentStepComponent', () => {
  let component: PaymentStepComponent;
  let fixture: ComponentFixture<PaymentStepComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStepComponent);
    component = fixture.componentInstance;
    form = createPaymentForm();
    fixture.componentRef.setInput('paymentForm', form);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not show any error message when the form is untouched', () => {
    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
  });

  it('shows a card number error for an invalid value', async () => {
    form.get('cardNumber')?.setValue('1234');
    form.get('cardNumber')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="cardNumber"]');
    expect(input.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Número do cartão inválido');
  });

  it('clears the card number error for a valid value', async () => {
    form.get('cardNumber')?.setValue('4111 1111 1111 1111');
    form.get('cardNumber')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="cardNumber"]');
    expect(input.classList.contains('error')).toBe(false);
  });

  it('shows the card name error when required and touched', async () => {
    form.get('cardName')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nome no cartão obrigatório');
  });

  it('shows an expiry error for an invalid value', async () => {
    form.get('expiry')?.setValue('13/29');
    form.get('expiry')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Validade inválida');
  });

  it('clears the expiry error for a valid value', async () => {
    form.get('expiry')?.setValue('12/29');
    form.get('expiry')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="expiry"]');
    expect(input.classList.contains('error')).toBe(false);
  });

  it('shows a CVV error for an invalid value', async () => {
    form.get('cvv')?.setValue('12');
    form.get('cvv')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('CVV inválido');
  });

  it('renders the installments options without requiring validation', () => {
    const options = fixture.nativeElement.querySelectorAll(
      'select[formcontrolname="installments"] option',
    );
    expect(options.length).toBe(5);
    expect(form.get('installments')?.valid).toBe(true);
  });

  it('shows every required-field error when the whole form is touched while empty', async () => {
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    // cardNumber, cardName, expiry, cvv (installments has a default value and no validators)
    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(4);
  });

  it('shows no errors once the whole form is filled with valid values', async () => {
    form.setValue({
      cardNumber: '4111 1111 1111 1111',
      cardName: 'MARIA SILVA',
      expiry: '12/29',
      cvv: '123',
      installments: '3',
    });
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
    expect(form.valid).toBe(true);
  });
});
