import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCardExpiryMask]',
  standalone: true,
})
export class CardExpiryMaskDirective {
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

    // 2. Remove tudo que não for dígito e limita a 4 (MMAA)
    const digits = input.value.replace(/\D/g, '').slice(0, 4);

    if (!digits) {
      input.value = '';
      this.updateFormControl(null);
      return;
    }

    // 3. Monta a máscara progressivamente: MM/AA
    let formattedValue = digits.slice(0, 2);
    if (digits.length > 2) {
      formattedValue += `/${digits.slice(2)}`;
    }

    // 4. Atualiza o valor visual no input nativo
    input.value = formattedValue;

    // 5. Restaura o cursor para o final para evitar que ele trave no meio
    const newLength = input.value.length;
    const diff = newLength - originalLength;
    const newCursorPosition = Math.max(0, cursorPosition + diff);
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // 6. Atualiza o FormControl com o valor formatado (é o que o validador espera)
    this.updateFormControl(formattedValue);
  }

  private updateFormControl(value: string | null) {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(value, { emitEvent: false, emitModelToViewChange: false });
    }
  }
}
