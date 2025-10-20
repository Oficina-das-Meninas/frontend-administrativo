import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, EventEmitter, Input, LOCALE_ID, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';

registerLocaleData(localePt);

@Component({
  selector: 'app-item-card',
  imports: [
    DatePipe,
    MatTooltipModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './item-card.html',
  styleUrl: './item-card.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-br' }
  ]
})
export class ItemCard {
  @Input() itemId!: string;
  @Input() itemTitle!: string;
  @Input() imageUrl!: string;
  @Input() description?: string;
  @Input() date?: Date;
  @Input() basePath: string = '/';

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  getTooltipText(): string {
    if (!this.description) return '';
    const html = marked(this.description) as string;
    return html.replace(/<[^>]*>/g, '').trim();
  }

  onEdit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.edit.emit(this.itemId);
  }

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit();
  }
}
