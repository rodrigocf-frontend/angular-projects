import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactStepComponent } from './contact-step.component';

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

describe('ContactStepComponent', () => {
  let component: ContactStepComponent;
  let fixture: ComponentFixture<ContactStepComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactStepComponent);
    component = fixture.componentInstance;
    form = createContactForm();
    fixture.componentRef.setInput('contactForm', form);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not show any error message when the form is untouched', () => {
    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
  });

  it('shows the first name error when invalid and touched', async () => {
    form.get('firstName')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="firstName"]');
    expect(input.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Nome obrigatório');
  });

  it('shows the last name error when invalid and touched', async () => {
    form.get('lastName')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Sobrenome obrigatório');
  });

  it('shows an email error for an invalid address', async () => {
    form.get('email')?.setValue('not-an-email');
    form.get('email')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="email"]');
    expect(input.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('E-mail inválido');
  });

  it('clears the email error for a valid address', async () => {
    form.get('email')?.setValue('maria@mail.com');
    form.get('email')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="email"]');
    expect(input.classList.contains('error')).toBe(false);
  });

  it('shows a phone error for an invalid number', async () => {
    form.get('phone')?.setValue('12345');
    form.get('phone')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Telefone inválido');
  });

  it('clears the phone error for a valid number', async () => {
    form.get('phone')?.setValue('(11)99999-9999');
    form.get('phone')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="phone"]');
    expect(input.classList.contains('error')).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Telefone inválido');
  });

  it('shows every required-field error when the whole form is touched while empty', async () => {
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(4);
  });

  it('shows no errors once the whole form is filled with valid values', async () => {
    form.setValue({
      firstName: 'Maria',
      lastName: 'Silva',
      email: 'maria@mail.com',
      phone: '(11)99999-9999',
    });
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
    expect(form.valid).toBe(true);
  });
});
