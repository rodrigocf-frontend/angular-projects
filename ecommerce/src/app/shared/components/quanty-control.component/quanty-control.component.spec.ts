import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantyControlComponent } from './quanty-control.component';

describe('QuantyControlComponent', () => {
  let fixture: ComponentFixture<QuantyControlComponent>;
  let component: QuantyControlComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantyControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantyControlComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 5);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the value input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.qty-value')?.textContent?.trim()).toBe('5');
  });

  it('should update the rendered value when the input changes', async () => {
    fixture.componentRef.setInput('value', 12);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.qty-value')?.textContent?.trim()).toBe('12');
  });

  it('should emit onAdd when the "+" button is clicked', () => {
    const emitSpy = vi.fn();
    component.onAdd.subscribe(emitSpy);
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.qty-btn');
    (buttons[1] as HTMLButtonElement).click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit onRemove when the "-" button is clicked', () => {
    const emitSpy = vi.fn();
    component.onRemove.subscribe(emitSpy);
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.qty-btn');
    (buttons[0] as HTMLButtonElement).click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
