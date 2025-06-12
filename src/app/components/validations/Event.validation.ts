import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class EventValidation {
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

  /**
   * Valida que la fecha de fin sea posterior o igual a la de inicio.
   * Marca 'endDateAndTime' si es inválido.
   */
  static endDateAfterStartDate(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const startDateControl = group.get('startDateAndTime');
      const endDateControl = group.get('endDateAndTime');
      if (!startDateControl || !endDateControl) return null;

      const startDate = new Date(startDateControl.value);
      const endDate = new Date(endDateControl.value);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

      if (endDate < startDate) {
        endDateControl.setErrors({ ...(endDateControl.errors || {}), ['endDateBeforeStart']: true });
        return { endDateBeforeStart: true };
      } else {
        // Limpia el error si ya no aplica
        if (endDateControl.errors?.['endDateBeforeStart']) {
          const { ['endDateBeforeStart']: _, ...rest } = endDateControl.errors;
          endDateControl.setErrors(Object.keys(rest).length ? rest : null);
        }
      }

      return null;
    };
  }
}
