import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CardExpiryMaskDirective } from './card-expiry-mask.directive';

@Component({
  template: `<input [formControl]="control" appCardExpiryMask />`,
  imports: [ReactiveFormsModule, CardExpiryMaskDirective],
})
class HostComponent {
  control = new FormControl<string | null>(null);
}

describe('CardExpiryMaskDirective', () => {
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

  it('does not add a slash until the month portion is complete', async () => {
    await typeValue('12');

    expect(input.value).toBe('12');
    expect(host.control.value).toBe('12');
  });

  it('adds the slash once a third digit starts the year portion', async () => {
    await typeValue('123');

    expect(input.value).toBe('12/3');
  });

  it('formats a complete MM/YY value', async () => {
    await typeValue('1225');

    expect(input.value).toBe('12/25');
    expect(host.control.value).toBe('12/25');
  });

  it('truncates input beyond 4 digits instead of overflowing the mask', async () => {
    await typeValue('122599');

    expect(input.value).toBe('12/25');
    expect(host.control.value).toBe('12/25');
  });

  it('strips non-digit characters before masking', async () => {
    await typeValue('12/25');

    expect(input.value).toBe('12/25');
  });

  it('clears the input and sets the control to null when no digits remain', async () => {
    await typeValue('1225');
    await typeValue('ab');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });
});
