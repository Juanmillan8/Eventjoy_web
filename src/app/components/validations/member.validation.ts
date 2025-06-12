import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MemberValidation {
  /**
   * Valida que la fecha de inicio no sea anterior al día actual.
   * Marca el control 'startDateAndTime' con error si aplica.
   */
static startDateNotInPast(isEditMode: boolean = false): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (isEditMode) return null; // Saltar validación en modo edición

    const startDateControl = group.get('startDateAndTime');
    if (!startDateControl) return null;

    const startDate = new Date(startDateControl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    if (isNaN(startDate.getTime())) return null;

    if (startDate < today) {
      startDateControl.setErrors({ ...(startDateControl.errors || {}), ['startDateInPast']: true });
      return { startDateInPast: true };
    } else {
      if (startDateControl.errors?.['startDateInPast']) {
        const { ['startDateInPast']: _, ...rest } = startDateControl.errors;
        startDateControl.setErrors(Object.keys(rest).length ? rest : null);
      }
    }

    return null;
  };
}
 static minimumAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        return null; // Si la fecha no es válida, otro validador puede manejarlo
      }

      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const isOldEnough =
        age > minAge ||
        (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      return isOldEnough ? null : { tooYoung: { requiredAge: minAge } };
    };
  }
}
