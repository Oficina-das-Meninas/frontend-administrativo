import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { Partner } from '../models/partner';
import { PartnerService } from '../services/partner-service';

export const partnerResolver: ResolveFn<Partner> = (route, state) => {
  const partnerService = inject(PartnerService);

  if (route.params && route.params['id']) {
    return partnerService.loadById(route.params['id']);
  }
  return of({ id: '', name: '', previewImageUrl: '' });
};
