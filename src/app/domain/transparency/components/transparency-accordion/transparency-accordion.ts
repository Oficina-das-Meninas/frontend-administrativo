import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AccordionContent } from '../../models/transparency-accordion/accordion-content';
import { AccordionContentType } from '../../enums/transparency-accordion/accordion-content-type';

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

  panelOpenState = signal(false);
  accordionContentType = AccordionContentType;

}
