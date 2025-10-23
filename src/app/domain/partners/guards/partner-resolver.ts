import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ImageService } from '../../../shared/services/image-service';
import { Partner } from '../models/partner';
import { PartnerService } from '../services/partner-service';

export const partnerResolver: ResolveFn<Partner> = (route, state) => {
  const partnerService = inject(PartnerService);
  const imageService = inject(ImageService);

  if (route.params && route.params['id']) {
    return partnerService.getById(route.params['id']).pipe(
      switchMap(async partner => {
        let previewImageUrl = partner.previewImageUrl;

        // A URL já é completa do partner-service, só valida
        if (previewImageUrl?.trim()) {
          const isValid = await imageService.isImageValid(previewImageUrl);
          if (!isValid) {
            previewImageUrl = '';
            console.warn('Imagem inválida removida:', partner.previewImageUrl);
          }
        }

        return { ...partner, previewImageUrl };
      })
    );
  }
  return of({ id: '', name: '', previewImageUrl: '' });
};
