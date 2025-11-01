import { Injectable } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ErrorMessageBuilder } from './error-message-builder';

@Injectable({
  providedIn: 'root',
})
export class FormHelperService {
  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);

      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (
        control instanceof UntypedFormGroup ||
        control instanceof UntypedFormArray
      ) {
        control.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  getErrorMessageFromField(field: UntypedFormControl) {
    const builder = new ErrorMessageBuilder()
      .addHandler(f => f?.hasError('required') ? 'Esse campo é obrigatório' : null)
      .addHandler(f => f?.hasError('minlength')
        ? `Digite pelo menos ${f.errors?.['minlength']?.['requiredLength'] ?? 5} caracteres`
        : null)
      .addHandler(f => f?.hasError('maxlength')
        ? `Esse campo não pode passar de ${f.errors?.['maxlength']?.['requiredLength'] ?? 200} caracteres`
        : null);

    return builder.build(field);
  }

  getFormArrayFieldErrorMessage(
    formGroup: UntypedFormGroup,
    formArrayName: string,
    fieldName: string,
    index: number
  ) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    const field = formArray.controls[index].get(
      fieldName
    ) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  isFormArrayRequired(
    formGroup: UntypedFormGroup,
    formArrayName: string
  ): boolean {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    return (
      formArray.invalid && formArray.hasError('required') && formArray.touched
    );
  }
}
