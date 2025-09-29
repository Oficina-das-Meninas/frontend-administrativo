import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionContentType } from '../../models/accordion-content-type';
import { AccordionContent } from '../../models/accordion-content';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transparency-accordion',
  imports: [
    MatExpansionModule, 
    MatIconModule
  ],
  templateUrl: './transparency-accordion.component.html',
  styleUrl: './transparency-accordion.component.scss'
})
export class TransparencyAccordionComponent {

  content = input<AccordionContent>();

  panelOpenState = signal(false);
  accordionContentType = AccordionContentType;

}
