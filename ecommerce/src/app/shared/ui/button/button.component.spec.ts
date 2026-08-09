import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-host-primary',
  imports: [ButtonComponent],
  template: `<button primary>Primary</button>`,
})
class PrimaryHostComponent {}

@Component({
  selector: 'app-host-secondary',
  imports: [ButtonComponent],
  template: `<button secondary>Secondary</button>`,
})
class SecondaryHostComponent {}

@Component({
  selector: 'app-host-ghost',
  imports: [ButtonComponent],
  template: `<a ghost href="#">Ghost</a>`,
})
class GhostHostComponent {}

@Component({
  selector: 'app-host-underline',
  imports: [ButtonComponent],
  template: `<button underline>Underline</button>`,
})
class UnderlineHostComponent {}

@Component({
  selector: 'app-host-none',
  imports: [ButtonComponent],
  template: `<button>Plain</button>`,
})
class NoneHostComponent {}

describe('ButtonComponent', () => {
  it('should project content', async () => {
    const fixture: ComponentFixture<PrimaryHostComponent> =
      TestBed.createComponent(PrimaryHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('Primary');
  });

  it('should apply btn-primary class when primary attribute is present', async () => {
    const fixture = TestBed.createComponent(PrimaryHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('btn-primary')).toBe(true);
    expect(btn.classList.contains('btn-secondary')).toBe(false);
    expect(btn.classList.contains('btn-ghost')).toBe(false);
    expect(btn.classList.contains('btn-underline')).toBe(false);
  });

  it('should apply btn-secondary class when secondary attribute is present', async () => {
    const fixture = TestBed.createComponent(SecondaryHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('btn-secondary')).toBe(true);
    expect(btn.classList.contains('btn-primary')).toBe(false);
  });

  it('should apply btn-ghost class when ghost attribute is present (on an anchor)', async () => {
    const fixture = TestBed.createComponent(GhostHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor.classList.contains('btn-ghost')).toBe(true);
  });

  it('should apply btn-underline class when underline attribute is present', async () => {
    const fixture = TestBed.createComponent(UnderlineHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('btn-underline')).toBe(true);
  });

  it('should apply no variant class when no matching attribute is present', async () => {
    const fixture = TestBed.createComponent(NoneHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('btn-primary')).toBe(false);
    expect(btn.classList.contains('btn-secondary')).toBe(false);
    expect(btn.classList.contains('btn-ghost')).toBe(false);
    expect(btn.classList.contains('btn-underline')).toBe(false);
  });
});
