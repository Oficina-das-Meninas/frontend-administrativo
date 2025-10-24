import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivateFn, Router } from '@angular/router';
import { ConfirmUnsavedChangesDialog } from '../components/confirm-unsaved-changes-dialog/confirm-unsaved-changes-dialog';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
  getForm: () => FormGroup | null;
  getFormName: () => string;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  canDeactivate(component: CanComponentDeactivate): boolean | Promise<boolean> {
    const form = component.getForm();
    if (!form || !form.dirty) {
      return true;
    }

    return new Promise((resolve) => {
      const formName = component.getFormName();
      const title = 'Mudanças não salvas';
      const message = `Você tem mudanças não salvas no formulário de ${formName}. Tem certeza que deseja sair sem salvar?`;

      const dialogRef = this.dialog.open(ConfirmUnsavedChangesDialog, {
        width: '600px',
        data: { title, message },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        resolve(result || false);
      });
    });
  }
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => {
  const guardService = inject(UnsavedChangesGuard);
  return guardService.canDeactivate(component);
};
