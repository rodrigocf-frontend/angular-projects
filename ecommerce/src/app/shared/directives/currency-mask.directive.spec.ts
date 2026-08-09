import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CurrencyMaskDirective } from './currency-mask.directive';

@Component({
  template: `<input [formControl]="control" appCurrencyMask />`,
  imports: [ReactiveFormsModule, CurrencyMaskDirective],
})
class HostComponent {
  control = new FormControl<number | null>(null);
}

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

describe('CurrencyMaskDirective', () => {
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

  it('formats a typed value into BRL currency and stores the numeric value on the control', async () => {
    await typeValue('300');

    expect(input.value).toBe(formatBRL(3));
    expect(host.control.value).toBe(3);
  });

  it('treats the last two typed digits as cents', async () => {
    await typeValue('5');

    expect(input.value).toBe(formatBRL(0.05));
    expect(host.control.value).toBe(0.05);
  });

  it('formats large values with thousands separators', async () => {
    await typeValue('123456');

    expect(input.value).toBe(formatBRL(1234.56));
    expect(host.control.value).toBe(1234.56);
  });

  it('strips non-digit characters before formatting', async () => {
    await typeValue('abc123def');

    expect(input.value).toBe(formatBRL(1.23));
    expect(host.control.value).toBe(1.23);
  });

  it('clears the input and sets the control to null when no digits remain', async () => {
    await typeValue('300');
    await typeValue('abc');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });

  it('clears the input and sets the control to null for an empty value', async () => {
    await typeValue('');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });
});
