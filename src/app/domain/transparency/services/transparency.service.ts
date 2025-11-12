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
    return this.httpClient.post<TransparencyCategory>(`${this.API_URL}/categories`, data, { withCredentials: true });
  }
  
  updateCategory(id: string, data: TransparencyCategory): Observable<void> {
    return this.httpClient.patch<void>(`${this.API_URL}/categories/${id}`, data, { withCredentials: true });
  }

  updateCollaborator(id: string, data: TransparencyCategory): Observable<void> {
    return this.httpClient.patch<void>(`${this.API_URL}/collaborators/${id}`, data, { withCredentials: true });
  }

  createDocument(data: FormData): Observable<string> {
    return this.httpClient.post(`${this.API_URL}/documents`, data, {
      responseType: 'text',
      withCredentials: true
    });
  }

  createCollaborator(data: FormData): Observable<string> {
    return this.httpClient.post(`${this.API_URL}/collaborators`, data, {
      responseType: 'text',
      withCredentials: true
    });
  }

  list(): Observable<AccordionContent[]> {
    return this.httpClient.get<{ data: CategoriesResponse }>(`${this.API_URL}`, { withCredentials: true }).pipe(
      map((response) =>
        response.data.categories.map((category) => ({
          id: category.id,
          categoryName: category.name,
          type: category.isImage
            ? AccordionContentType.COLLABORATOR
            : AccordionContentType.DOCUMENT,
          priority: category.priority,
          documents: category.documents?.map((doc) => ({
            id: doc.id,
            name: doc.title,
            effectiveDate: doc.effectiveDate,
            url: environment.bucketUrl + doc.previewLink,
          })),
          collaborators: category.collaborators?.map((collab) => ({
            id: collab.id,
            imageUrl: environment.bucketUrl + collab.previewLink,
            name: collab.name,
            role: collab.role,
            description: collab.description,
          })),
        }))
      )
    );
  }

  deleteCategory(id: string): Observable<void>  {
    return this.httpClient.delete<void>(`${this.API_URL}/categories/${id}`, { withCredentials: true });
  }

  deleteDocument(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/documents/${id}`, { withCredentials: true });
  }

  deleteCollaborator(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/collaborators/${id}`, { withCredentials: true });
  }

}
