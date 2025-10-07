import { UntypedFormControl } from "@angular/forms";

type ErrorHandler = (field: UntypedFormControl) => string | null;

export class ErrorMessageBuilder {
  private handlers: ErrorHandler[] = [];

  addHandler(handler: ErrorHandler): this {
    this.handlers.push(handler);
    return this;
  }

  build(field: UntypedFormControl): string {
    for (const handler of this.handlers) {
      const message = handler(field);
      if (message) return message;
    }
    return 'Campo inválido';
  }
}
