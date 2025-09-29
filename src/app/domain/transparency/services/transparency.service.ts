import { inject, Injectable } from '@angular/core';
import { AccordionContentType } from '../models/accordion-content-type';
import { AccordionContent } from '../models/accordion-content';
import { CategoriesResponse } from '../models/categories-response';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransparencyService {

  private readonly API_URL = `${environment.apiUrl}/transparencies`;
  private httpClient = inject(HttpClient);

  list(): Observable<AccordionContent[]> {
    return this.httpClient.get<CategoriesResponse>(`${this.API_URL}`).pipe(
      map((response) =>
        response.categories.map((category) => ({
          categoryName: category.name,
          type: category.isImage
            ? AccordionContentType.COLLABORATOR
            : AccordionContentType.DOCUMENT,
          documents: category.documents?.map((doc) => ({
            name: doc.title,
            url: doc.previewLink,
          })),
          collaborators: category.collaborators?.map((collab) => ({
            imageUrl: collab.previewLink,
            name: collab.name,
            role: collab.role,
            description: collab.description,
          })),
        }))
      )
    );
  }

}
