import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Subscription, zip} from 'rxjs';


export interface ConditionalValidatorConfig<T = any> {
  condition: (control: AbstractControl) => boolean;
  validator: ValidatorFn;
}

/**
 * A custom validator function that applies conditional validation logic
 * based on a user-defined configuration.
 *
 * The function evaluates a `condition` provided in the configuration to determine
 * whether the associated `validator` function should be applied to the control.
 * It also tracks changes to relevant fields in the form and revalidates the control
 * whenever any of the dependent fields are updated.
 *
 * This supports dynamic validation scenarios where the validity of a control
 * is determined by its relationship with other controls in the form.
 *
 * @param {ConditionalValidatorConfig} config - The configuration object containing
 *                                              the condition function and the validator.
 * @returns {ValidatorFn} A validator function that implements the conditional validation logic.
 */
export const conditionalValidator = (config: ConditionalValidatorConfig): ValidatorFn => {
  let lastForm: FormGroup | null = null;
  let subscriptions = new Subscription();

  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent as FormGroup;

    if (form && form !== lastForm) {
      subscriptions.unsubscribe();
      subscriptions = new Subscription();

      // execute the condition a first time by intercepting the calls to get()
      const watchedFields = new Set<string>();
      const originalGet = form.get.bind(form);

      form.get = (path: string) => {
        watchedFields.add(path);
        return originalGet(path);
      };

      // Test execution to detect used fields
      config.condition(control);

      // Restore the original get method
      form.get = originalGet;

      // Setting up monitoring for detected fields
      watchedFields.forEach(fieldName => {
        const field = form.get(fieldName);
        if (field) {
          subscriptions.add(
            zip(field.valueChanges, field.statusChanges).subscribe({
              next: () => (control.updateValueAndValidity({ emitEvent: false }))
            })
          );
        }
      });

      lastForm = form;
    }

    return config.condition(control) ? config.validator(control) : null;
  };
}



/**
 * JlValidators provides a collection of custom validators that execute conditionally
 * based on a specified condition function and Angular's built-in validators.
 */
export const JlValidators = {
  required: (condition: (formGroup: FormGroup) => boolean): ValidatorFn => {
    return conditionalValidator({
      condition: (control: AbstractControl) => condition(control.parent as FormGroup),
      validator: Validators.required,
    });
  },

  minLength: (length: number, condition: (control: AbstractControl) => boolean, watchFields?: string[]): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.minLength(length)
    });
  },

  maxLength: (length: number, condition: (control: AbstractControl) => boolean, watchFields?: string[]): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.maxLength(length)
    });
  },

  pattern: (pattern: string | RegExp, condition: (control: AbstractControl) => boolean, watchFields?: string[]): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.pattern(pattern)
    });
  },

  email: (condition: (control: AbstractControl) => boolean): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.email
    });
  },

  min: (min: number, condition: (control: AbstractControl) => boolean): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.min(min)
    });
  },

  max: (max: number, condition: (control: AbstractControl) => boolean): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.max(max)
    });
  },

  requiredTrue: (condition: (control: AbstractControl) => boolean): ValidatorFn => {
    return conditionalValidator({
      condition,
      validator: Validators.requiredTrue
    });
  }
};
