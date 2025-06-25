import {FormControl, FormGroup} from '@angular/forms';
import 'reflect-metadata';
import {Subscription, zip} from 'rxjs';
import {FORM_CONTROL_METADATA, FORM_GROUP_METADATA} from './constantes';
import {FormControlOptions} from '../types/form-control-options.type';

// Type for validation options




// Utility type for form controls
export type FormGroupControls<T> = {
  [K in keyof T]?: T[K] extends object ? FormGroup<FormGroupControls<T[K]>> : FormControl<T[K]>;
};

export interface DestroyableFormGroup<T> extends FormGroup<FormGroupControls<T>> {
  destroy: () => void;
}


// Updated Form Factory


/**
 * Creates a `DestroyableFormGroup` instance from a given class instance, using metadata to configure form controls and
 * validators. It maps the class instance's properties to form controls, applying default values, synchronous validators,
 * asynchronous validators, and enable/disable conditions where applicable.
 *
 * @template T The type of the class instance used for creating the form.
 * @param {T} instance An object instance of the class for which form controls should be created.
 * @returns {DestroyableFormGroup<T>} A reactive form group enhanced with a `destroy` method for cleanup.
 *
 * The method extracts metadata from the class instance to dynamically configure the form:
 * - Metadata specifies form control values, validators, and conditions for enabling or disabling controls.
 * - Validators and async validators are applied after the form group is created.
 * - The enable/disable logic listens to form changes and adjusts controls dynamically.
 *
 * The returned `DestroyableFormGroup` includes a `destroy` method, which unsubscribes from any internal subscriptions,
 * ensuring proper resource cleanup.
 */
/*export const createFormFromClass = <T extends Record<string, any>>(instance: T): DestroyableFormGroup<T> => {
  const sub = new Subscription();
  const metadata: Record<string, FormControlOptions> | undefined = Reflect.getMetadata(
    FORM_CONTROL_METADATA,
    instance.constructor.prototype
  );

  const controls: { [key: string]: FormControl } = {};

  // First: create all the controls
  if (metadata) {
    for (const propertyKey in metadata) {
      if (Object.prototype.hasOwnProperty.call(metadata, propertyKey) &&
        Object.prototype.hasOwnProperty.call(instance, propertyKey)) {
        const options: FormControlOptions = metadata[propertyKey];
        const control = new FormControl(
          options.defaultValue !== undefined ? options.defaultValue : instance[propertyKey]
        );
        controls[propertyKey] = control;
      }
    }
  }

  // Create the FormGroup with controls
  const formGroup = new FormGroup(controls);

  // Second: configure validators after the FormGroup is created
  if (metadata) {
    for (const propertyKey in metadata) {
      const options = metadata[propertyKey];
      const control = controls[propertyKey];
      if (control) {
        if (options.validators) {
          control.setValidators(options.validators);
        }
        if (options.asyncValidators) {
          control.setAsyncValidators(options.asyncValidators);
        }
        control.updateValueAndValidity();
      }
    }
  }


  // Configure enable/disable conditions
  if (metadata) {
    for (const propertyKey in metadata) {
      const options = metadata[propertyKey];
      const control = controls[propertyKey];
      if (options.disable) {
        const shouldDisable = options.disable(formGroup);
        if (shouldDisable) {
          control.disable({ emitEvent: false });
        }

        sub.add(
          zip(formGroup.valueChanges, formGroup.statusChanges).subscribe({
            next: () => {
              const shouldDisable = options.disable(formGroup);
              if (shouldDisable && control.enabled) {
                control.disable();
              } else if (!shouldDisable && control.disabled) {
                control.enable();
              }

            }
          })
        )
      }
    }
  }

  return Object.assign(formGroup, {
    destroy: () => sub.unsubscribe()
  }) as DestroyableFormGroup<T>;
}*/


export const createFormFromClass = <T extends Record<string, any>>(instance: T): DestroyableFormGroup<T> => {
  const sub = new Subscription();
  const controlMetadata: Record<string, FormControlOptions> | undefined = Reflect.getMetadata(
    FORM_CONTROL_METADATA,
    instance.constructor.prototype
  );

  const controls: { [key: string]: FormControl | FormGroup } = {};

  if (controlMetadata) {
    for (const propertyKey in instance) {
      if (instance.hasOwnProperty(propertyKey)) {
        const options = controlMetadata[propertyKey];

        if (options) {
          // Create a FormControl for properties with @controlProp
          const control = new FormControl(
            options.defaultValue !== undefined ? options.defaultValue : instance[propertyKey]
          );
          controls[propertyKey] = control;
        } else {
          // Assume it's a nested object and create a FormGroup for properties with @controlGroupProp
          if (typeof instance[propertyKey] === 'object' && instance[propertyKey] !== null) {
            const nestedFormGroup = createFormFromClass(instance[propertyKey]);
            controls[propertyKey] = nestedFormGroup;
          }
        }
      }
    }
  }

  const formGroup = new FormGroup(controls);

  // Configure validators and async validators
  if (controlMetadata) {
    for (const propertyKey in controlMetadata) {
      const options = controlMetadata[propertyKey];
      const control = controls[propertyKey] as FormControl;
      if (control) {
        if (options.validators) {
          control.setValidators(options.validators);
        }
        if (options.asyncValidators) {
          control.setAsyncValidators(options.asyncValidators);
        }
        control.updateValueAndValidity();
      }
    }
  }

  // Configure enable/disable conditions
  if (controlMetadata) {
    for (const propertyKey in controlMetadata) {
      const options = controlMetadata[propertyKey];
      const control = controls[propertyKey] as FormControl;
      if (options.disable) {
        const shouldDisable = options.disable(formGroup);
        if (shouldDisable) {
          control.disable({ emitEvent: false });
        }

        sub.add(
          zip(formGroup.valueChanges, formGroup.statusChanges).subscribe({
            next: () => {
              const shouldDisable = options.disable(formGroup);
              if (shouldDisable && control.enabled) {
                control.disable();
              } else if (!shouldDisable && control.disabled) {
                control.enable();
              }
            }
          })
        );
      }
    }
  }

  return Object.assign(formGroup, {
    destroy: () => sub.unsubscribe()
  }) as DestroyableFormGroup<T>;
};
