import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressStepComponent } from './address-step.component';

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

describe('AddressStepComponent', () => {
  let component: AddressStepComponent;
  let fixture: ComponentFixture<AddressStepComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressStepComponent);
    component = fixture.componentInstance;
    form = createAddressForm();
    fixture.componentRef.setInput('addressForm', form);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not show any error message when the form is untouched', () => {
    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
  });

  it('shows the CEP error when invalid and touched, and applies the error class', async () => {
    form.get('cep')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="cep"]');
    expect(input.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('CEP inválido');
  });

  it('hides the CEP error once a valid value is set', async () => {
    form.get('cep')?.setValue('01310-100');
    form.get('cep')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="cep"]');
    expect(input.classList.contains('error')).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('CEP inválido');
  });

  it('shows the address error when invalid and touched', async () => {
    form.get('address')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Endereço inválido');
  });

  it('does not show the complement error since the field is optional', async () => {
    form.get('complement')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input[formcontrolname="complement"]');
    expect(input.classList.contains('error')).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('inválido');
  });

  it('marks the state select as invalid when touched and empty', async () => {
    form.get('state')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('select[formcontrolname="state"]');
    expect(select.classList.contains('error')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Selecione um estado');
  });

  it('clears the state error once a value is selected', async () => {
    form.get('state')?.setValue('SP');
    form.get('state')?.markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('select[formcontrolname="state"]');
    expect(select.classList.contains('error')).toBe(false);
  });

  it('shows every required-field error when the whole form is touched while empty', async () => {
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    // cep, address, number, neighborhood, city, state (complement has no validators)
    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(6);
  });

  it('shows no errors once the whole form is filled with valid values', async () => {
    form.setValue({
      cep: '01310-100',
      address: 'Av. Paulista',
      number: '1000',
      complement: 'Apto 12',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    });
    form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.error-msg').length).toBe(0);
    expect(form.valid).toBe(true);
  });
});
