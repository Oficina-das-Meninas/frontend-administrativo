import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaskDate]'
})
export class MaskDate {

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event'])
  onInput(): void {
    let value = this.el.nativeElement.value;

    value = value.replace(/\D/g, '');

    if (value.length > 2 && value.length <= 4) {
      value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    this.el.nativeElement.value = value;
  }

}