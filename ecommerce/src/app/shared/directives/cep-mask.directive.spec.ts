import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CepMaskDirective } from './cep-mask.directive';

@Component({
  template: `<input [formControl]="control" appCepMask />`,
  imports: [ReactiveFormsModule, CepMaskDirective],
})
class HostComponent {
  control = new FormControl<string | null>(null);
}

describe('CepMaskDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  async function typeValue(value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('does not add a dash before the sixth digit', async () => {
    await typeValue('12345');

    expect(input.value).toBe('12345');
    expect(host.control.value).toBe('12345');
  });

  it('adds a dash once a sixth digit is typed', async () => {
    await typeValue('123456');

    expect(input.value).toBe('12345-6');
  });

  it('formats a complete 8-digit CEP', async () => {
    await typeValue('12345678');

    expect(input.value).toBe('12345-678');
    expect(host.control.value).toBe('12345-678');
  });

  it('truncates input beyond 8 digits instead of overflowing the mask', async () => {
    await typeValue('123456789999');

    expect(input.value).toBe('12345-678');
    expect(host.control.value).toBe('12345-678');
  });

  it('strips non-digit characters before masking', async () => {
    await typeValue('12345-678');

    expect(input.value).toBe('12345-678');
  });

  it('clears the input and sets the control to null when no digits remain', async () => {
    await typeValue('12345678');
    await typeValue('abc');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });
});
