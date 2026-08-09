import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
})
export class CurrencyMaskDirective {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
  ) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;

    // 1. Guarda a posição atual do cursor em relação ao fim do texto
    const originalLength = input.value.length;
    const cursorPosition = input.selectionStart || 0;

    // 2. Remove tudo que não for dígito
    const cleanValue = input.value.replace(/\D/g, '');

    if (!cleanValue) {
      input.value = '';
      this.updateFormControl(null);
      return;
    }

    // 3. Converte para centavos (ex: "300" vira 3.00)
    const numericValue = Number(cleanValue) / 100;

    // 4. Formata para o padrão BRL
    const formattedValue = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // 5. Atualiza o valor visual no input nativo
    input.value = formattedValue;

    // 6. Restaura o cursor para o final para evitar que ele trave no meio
    const newLength = input.value.length;
    const diff = newLength - originalLength;
    const newCursorPosition = Math.max(0, cursorPosition + diff);
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // 7. Atualiza o FormControl com o valor numérico puro
    this.updateFormControl(numericValue);
  }

  private updateFormControl(value: number | null) {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(value, { emitEvent: false, emitModelToViewChange: false });
    }
  }
}
