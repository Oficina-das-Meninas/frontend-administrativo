import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly BUCKET_URL = `${environment.bucketUrl}/`;

  getPubImage(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return '';
    }
    return this.BUCKET_URL + 'pub/' + imagePath;
  }
}
