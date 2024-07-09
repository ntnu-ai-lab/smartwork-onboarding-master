import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';

export function getFormValidationErrors(form: FormGroup) {

  const result: { controlName: string; control: AbstractControl | null; error: string; value: any; }[] = [];
  Object.keys(form.controls).forEach(key => {

    const controlErrors = form.get(key)?.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach(keyError => {
        result.push({
          controlName: key,
          control: form.get(key),
          error: keyError,
          value: controlErrors[keyError]
        });
      });
    }
  });

  return result;
}
