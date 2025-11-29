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

  async isImageValid(imageUrl: string | null | undefined): Promise<boolean> {
    if (!imageUrl?.trim()) {
      return false;
    }

    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Erro ao validar imagem:', imageUrl, error);
      return false;
    }
  }

  async validateImages(images: Record<string, any>): Promise<Record<string, any>> {
    const validatedImages = { ...images };

    for (const [key, value] of Object.entries(images)) {
      if (typeof value === 'string' && value.trim()) {
        const isValid = await this.isImageValid(value);
        if (!isValid) {
          console.warn(`Imagem inválida removida (${key}):`, value);
          validatedImages[key] = '';
        }
      }
    }

    return validatedImages;
  }
}
