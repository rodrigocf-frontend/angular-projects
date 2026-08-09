import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PhoneMaskDirective } from './phone-mask.directive';

@Component({
  template: `<input [formControl]="control" appPhoneMask />`,
  imports: [ReactiveFormsModule, PhoneMaskDirective],
})
class HostComponent {
  control = new FormControl<string | null>(null);
}

describe('PhoneMaskDirective', () => {
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

  it('opens the parenthesis after the first digit(s) without closing it early', async () => {
    await typeValue('8');

    expect(input.value).toBe('(8');
    expect(host.control.value).toBe('(8');
  });

  it('does not close the DDD parenthesis until a third digit is typed', async () => {
    await typeValue('83');

    expect(input.value).toBe('(83');
  });

  it('closes the DDD parenthesis once a third digit arrives', async () => {
    await typeValue('839');

    expect(input.value).toBe('(83)9');
  });

  it('formats a complete 11-digit phone number progressively', async () => {
    await typeValue('83998254263');

    expect(input.value).toBe('(83)99825-4263');
    expect(host.control.value).toBe('(83)99825-4263');
  });

  it('truncates input beyond 11 digits instead of overflowing the mask', async () => {
    await typeValue('839982542639999');

    expect(input.value).toBe('(83)99825-4263');
    expect(host.control.value).toBe('(83)99825-4263');
  });

  it('strips non-digit characters before masking', async () => {
    await typeValue('(83) 99825-4263');

    expect(input.value).toBe('(83)99825-4263');
  });

  it('clears the input and sets the control to null when no digits remain', async () => {
    await typeValue('83998254263');
    await typeValue('abc');

    expect(input.value).toBe('');
    expect(host.control.value).toBeNull();
  });
});
