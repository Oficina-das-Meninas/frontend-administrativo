import { Component, input, output, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AccordionContent } from '../../models/transparency-accordion/accordion-content';
import { AccordionContentType } from '../../enums/transparency-accordion/accordion-content-type';
import { connect } from 'rxjs';
import { AccordionDocument } from '../../models/transparency-accordion/accordion-document';
import { AccordionCollaborator } from '../../models/transparency-accordion/accordion-collaborator';
import { DeleteItem } from '../../models/transparency-accordion/delete-item';

@Component({
  selector: 'app-transparency-accordion',
  imports: [
    MatExpansionModule,
    MatIconModule,
  ],
  templateUrl: './transparency-accordion.html',
  styleUrl: './transparency-accordion.scss'
})
export class TransparencyAccordionComponent {

  content = input<AccordionContent>();
  isDeleteItem = output<DeleteItem>();

  panelOpenState = signal(false);
  accordionContentType = AccordionContentType;

  onDeleteItem(item: AccordionDocument | AccordionCollaborator): void {
    const deleteItem: DeleteItem = {
      id: item.id,
      name: item.name,
    };

    this.isDeleteItem.emit(deleteItem);
  }

}
