import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EventValidators {
  static timeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || value === '--:--' || value.trim() === '') {
      return null;
    }

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(value)) {
      return { invalidTime: true };
    }

    return null;
  }

  static imageValidator(control: AbstractControl): ValidationErrors | null {
    const files = control.value as File[];
    if (!files || files.length === 0) {
      return { required: true };
    }
    return null;
  }
}
