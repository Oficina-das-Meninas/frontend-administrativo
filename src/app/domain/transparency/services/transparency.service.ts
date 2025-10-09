import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CategoriesResponse } from '../models/list/categories-response';
import { AccordionContent } from '../models/transparency-accordion/accordion-content';
import { AccordionContentType } from '../enums/transparency-accordion/accordion-content-type';
import { TransparencyCategory } from '../models/transparency/transparency-category';

@Injectable({
  providedIn: 'root'
})
export class TransparencyService {

  private readonly API_URL = `${environment.apiUrl}/transparencies`;
  private httpClient = inject(HttpClient);

  createCategory(data: TransparencyCategory): Observable<TransparencyCategory> {
    return this.httpClient.post<TransparencyCategory>(`${this.API_URL}/categories`, data);
  }

  createDocument(data: FormData): Observable<string> {
    return this.httpClient.post(`${this.API_URL}/documents`, data, {
      responseType: 'text'
    });
  }

  createCollaborator(data: FormData): Observable<string> {
    return this.httpClient.post(`${this.API_URL}/collaborators`, data, {
      responseType: 'text'
    });
  }

  list(): Observable<AccordionContent[]> {
    return this.httpClient.get<CategoriesResponse>(`${this.API_URL}`).pipe(
      map((response) =>
        response.categories.map((category) => ({
          id: category.id,
          categoryName: category.name,
          type: category.isImage
            ? AccordionContentType.COLLABORATOR
            : AccordionContentType.DOCUMENT,
          priority:category.priority,
          documents: category.documents?.map((doc) => ({
            name: doc.title,
            url: environment.bucketUrl + doc.previewLink,
          })),
          collaborators: category.collaborators?.map((collab) => ({
            imageUrl: environment.bucketUrl + collab.previewLink,
            name: collab.name,
            role: collab.role,
            description: collab.description,
          })),
        }))
      )
    );
  }

}
