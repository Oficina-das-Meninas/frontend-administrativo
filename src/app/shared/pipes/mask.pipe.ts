import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: true,
})
export class MaskPipe implements PipeTransform {
  transform(value: string | null | undefined, mask: string): string {
    if (!value) return '';

    const cleanValue = value.replace(/\D/g, '');
    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
      if (mask[i] === '0') {
        result += cleanValue[valueIndex];
        valueIndex++;
      } else {
        result += mask[i];
        if (mask[i] !== '0' && cleanValue[valueIndex] === mask[i]) {
          valueIndex++;
        }
      }
    }

    return result;
  }
}
