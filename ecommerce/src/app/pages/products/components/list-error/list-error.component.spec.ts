import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListErrorComponent } from './list-error.component';

describe('ListErrorComponent', () => {
  let component: ListErrorComponent;
  let fixture: ComponentFixture<ListErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the error title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-title')?.textContent).toContain('errado');
    expect(compiled.querySelector('.error-desc')?.textContent).toContain(
      'Não foi possível carregar os produtos',
    );
  });

  it('should emit retry when the "Tentar novamente" button is clicked', () => {
    const retrySpy = vi.fn();
    component.retry.subscribe(retrySpy);

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.error-btn') as HTMLButtonElement;
    expect(button.textContent).toContain('Tentar novamente');
    button.click();

    expect(retrySpy).toHaveBeenCalledTimes(1);
  });
});
