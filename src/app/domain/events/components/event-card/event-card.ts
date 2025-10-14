import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component, Input, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';

registerLocaleData(localePt);

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, MatTooltipModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-br' }
  ]
})
export class EventCard {
  @Input() eventId!: string;
  @Input() eventTitle!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
  @Input() date!: Date;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  getTooltipText(): string {
    const html = marked(this.description) as string;
    return html.replace(/<[^>]*>/g, '').trim();
  }

  onEdit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.edit.emit(this.eventId);
  }

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit();
  }
}
