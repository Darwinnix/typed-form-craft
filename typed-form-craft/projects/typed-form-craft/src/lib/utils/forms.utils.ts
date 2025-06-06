// form-decorators.ts
import { FormControl, FormGroup } from '@angular/forms';
import 'reflect-metadata';

// Clé pour les métadonnées des contrôles de formulaire
const FORM_CONTROL_METADATA = 'form:control:metadata';

// Type pour les options de validation
export interface FormControlOptions<T = any> {
  validators?: any[];
  asyncValidators?: any[];
  defaultValue?: T;
}

// Définition du décorateur
export const FormControlConfig = (options: FormControlOptions) => {
  return function (target: any, propertyKey: string) {
    // Stocke les options dans les métadonnées de la classe (pas de l'instance)
    const existingMetadata: Record<string, FormControlOptions> =
      Reflect.getMetadata(FORM_CONTROL_METADATA, target) || {};

    existingMetadata[propertyKey] = options;
    Reflect.defineMetadata(FORM_CONTROL_METADATA, existingMetadata, target);
  };
}

// Type utilitaire pour les contrôles de formulaire
export type FormGroupControls<T> = {
  [K in keyof T]?: FormControl<T[K]>;
};

// Fabrique de formulaires mise à jour
export const createFormFromClass = <T extends Record<string, any>>(instance: T): FormGroup<FormGroupControls<T>> => {
  // Récupère les métadonnées du prototype de l'instance
  const metadata: Record<string, FormControlOptions> | undefined = Reflect.getMetadata(
    FORM_CONTROL_METADATA,
    instance.constructor.prototype
  );

  const controls: any = {};

  // Ne traite que les propriétés qui ont des métadonnées
  if (metadata) {
    for (const propertyKey in metadata) {
      if (metadata.hasOwnProperty(propertyKey) && instance.hasOwnProperty(propertyKey)) {
        const options = metadata[propertyKey];

        controls[propertyKey] = new FormControl(
          options.defaultValue !== undefined ? options.defaultValue : instance[propertyKey],
          options.validators,
          options.asyncValidators
        );
      }
    }
  }

  return new FormGroup(controls);
}
