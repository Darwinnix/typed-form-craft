// Definition of decorator
import {FORM_CONTROL_METADATA} from './constantes';
import {FormControlOptions} from '../types/form-control-options.type';
import 'reflect-metadata';

export const controlProp = (options: Partial<FormControlOptions>) => {
  return (target: any, propertyKey: string) => {
    // Stores options in class (not instance) metadata
    const existingMetadata: Record<string, Partial<FormControlOptions>> =
      Reflect.getMetadata(FORM_CONTROL_METADATA, target) || {};

    existingMetadata[propertyKey] = options;
    Reflect.defineMetadata(FORM_CONTROL_METADATA, existingMetadata, target);
  };
};
/*TODO fonctionne (penser à instancier l'objet par défaut). Il faut maintenant chercher un moyen pour faire communiquer
*  le Formgroup parent avec le Formgroup enfant, en particulier pour les conditionnal validators */
export const controlGroupProp = () => {
  return (target: any, propertyKey: string) => {
  };
};
