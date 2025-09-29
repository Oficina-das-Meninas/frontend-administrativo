import { Component, inject, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, tap } from 'rxjs';
import { TransparencyService } from '../../services/transparency.service';
import { AccordionContent } from '../../models/accordion-content';
import { TransparencyAccordionComponent } from "../../components/transparency-accordion/transparency-accordion.component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-transparency',
  imports: [
    CdkDropList,
    CdkDrag,
    TransparencyAccordionComponent,
    AsyncPipe
],
  templateUrl: './transparency.component.html',
  styleUrl: './transparency.component.scss'
})
export class TransparencyComponent implements OnInit {

  accordionContent$: Observable<AccordionContent[]> | null = null;
  accordionContent: AccordionContent[] = [];

  private transparencyService = inject(TransparencyService);

  ngOnInit() {
    this.accordionContent$ = this.transparencyService.list().pipe(
      tap(data => this.accordionContent = data)
    );
  }

  drop(event: CdkDragDrop<AccordionContent[]>) {
    moveItemInArray(this.accordionContent, event.previousIndex, event.currentIndex);
  }

}
