import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from './button';

@Component({
  template: '<button primary>Label</button>',
  imports: [Button],
  standalone: true,
})
class PrimaryHost {}

@Component({
  template: '<button ghost>Label</button>',
  imports: [Button],
  standalone: true,
})
class GhostHost {}

describe('Button — primary', () => {
  let fixture: ComponentFixture<PrimaryHost>;
  let instance: Button;
  let el: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PrimaryHost] }).compileComponents();
    fixture = TestBed.createComponent(PrimaryHost);
    fixture.detectChanges();
    const debug = fixture.debugElement.query(By.directive(Button));
    instance = debug.componentInstance;
    el = debug.nativeElement;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should set primary to true', () => {
    expect(instance.primary()).toBe(true);
  });

  it('should set ghost to false', () => {
    expect(instance.ghost()).toBe(false);
  });

  it('should apply btn-primary class', () => {
    expect(el.classList).toContain('btn-primary');
  });

  it('should not apply btn-ghost class', () => {
    expect(el.classList).not.toContain('btn-ghost');
  });
});

describe('Button — ghost', () => {
  let fixture: ComponentFixture<GhostHost>;
  let instance: Button;
  let el: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GhostHost] }).compileComponents();
    fixture = TestBed.createComponent(GhostHost);
    fixture.detectChanges();
    const debug = fixture.debugElement.query(By.directive(Button));
    instance = debug.componentInstance;
    el = debug.nativeElement;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should set ghost to true', () => {
    expect(instance.ghost()).toBe(true);
  });

  it('should set primary to false', () => {
    expect(instance.primary()).toBe(false);
  });

  it('should apply btn-ghost class', () => {
    expect(el.classList).toContain('btn-ghost');
  });

  it('should not apply btn-primary class', () => {
    expect(el.classList).not.toContain('btn-primary');
  });
});
