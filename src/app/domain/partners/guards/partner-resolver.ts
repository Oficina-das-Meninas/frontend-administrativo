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
        const validatedPartner = await imageService.validateImages({
          previewImageUrl: partner.previewImageUrl,
        });
        return { ...partner, ...validatedPartner };
      })
    );
  }
  return of({ id: '', name: '', previewImageUrl: '' });
};
