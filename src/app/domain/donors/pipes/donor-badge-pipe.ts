import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'donorBadge',
})
export class DonorBadgePipe implements PipeTransform {
  transform(badge: string): string {
    switch (badge?.toLowerCase()) {
      case 'broto':
        return '🌿 Broto';
      case 'margarida':
        return '🌼 Margarida';
      case 'semente':
      default:
        return '🌱 Semente';
    }
  }
}
