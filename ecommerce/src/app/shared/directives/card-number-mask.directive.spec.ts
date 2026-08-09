import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CardNumberMaskDirective } from './card-number-mask.directive';

@Component({
  template: `<input [formControl]="control" appCardNumberMask />`,
  imports: [ReactiveFormsModule, CardNumberMaskDirective],
})
class HostComponent {
  control = new FormControl<string | null>(null);
}

describe('CardNumberMaskDirective', () => {
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

  it('does not append a trailing space right after a full group of 4', async () => {
    await typeValue('1234');

    expect(input.value).toBe('1234');
    expect(host.control.value).toBe('1234');
  });

  it('inserts a space once a fifth digit starts the next group', async () => {
    await typeValue('12345');

    expect(input.value).toBe('1234 5');
  });

  it('formats a complete 16-digit card number grouped by 4', async () => {
    await typeValue('1234567890123456');

    expect(input.value).toBe('1234 5678 9012 3456');
    expect(host.control.value).toBe('1234 5678 9012 3456');
  });

  it('truncates input beyond 16 digits instead of overflowing the mask', async () => {
    await typeValue('12345678901234569999');

    expect(input.value).toBe('1234 5678 9012 3456');
    expect(host.control.value).toBe('1234 5678 9012 3456');
  });

  it('strips non-digit characters before masking', async () => {
    await typeValue('1234-5678-9012-3456');

    expect(input.value).toBe('1234 5678 9012 3456');
  });

  it('clears the input and sets the control to null when no digits remain', async () => {
    await typeValue('1234567890123456');
    await typeValue('abc');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });
});
