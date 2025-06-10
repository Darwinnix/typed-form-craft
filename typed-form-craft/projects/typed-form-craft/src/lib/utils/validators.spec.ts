import {conditionalValidator, ConditionalValidatorConfig} from './validators.utils';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {fakeAsync, tick} from '@angular/core/testing';
import {JlValidators} from './validators.utils';

describe('conditionalValidator', () => {
  it('devrait appliquer le validateur selon la condition', fakeAsync(() => {
    const form = new FormGroup({
      test: new FormControl(''),
      field: new FormControl('', [conditionalValidator({
        condition: (control) => control?.parent?.get('test')?.value === 'test',
        validator: Validators.required
      })])
    });

    const testControl = form.get('test');
    const fieldControl = form.get('field');
    if (!fieldControl || !testControl) {
      fail('Le contrôle du champ ne devrait pas être null');
      return;
    }

    // État initial avec champ vide
    expect(fieldControl.valid).toBeTruthy();
    expect(fieldControl.errors).toBeNull();

    // Test avec une valeur non déclenchante
    testControl.setValue('autre');
    tick();
    expect(fieldControl.errors).toBeNull();
    expect(fieldControl.valid).toBeTruthy();

    // Test avec la valeur déclenchante
    testControl.setValue('test');
    tick();
    // Au lieu de vérifier hasValidator, vérifions que le validateur est effectivement appliqué
    // en testant son comportement
    fieldControl.setValue(''); // Valeur vide pour déclencher l'erreur required
    tick();
    expect(fieldControl.errors).toEqual({required: true});
    expect(fieldControl.valid).toBeFalsy();

    // Test de désactivation du validateur
    testControl.setValue('autre');
    tick();
    expect(fieldControl.errors).toBeNull();
    expect(fieldControl.valid).toBeTruthy();
  }));


  it('should re-evaluate when watched fields change', () => {
    const config: ConditionalValidatorConfig = {
      condition: (control) => control.parent?.get('dependency')?.value === 'trigger',
      validator: (control) => control.value === 'valid' ? null : {invalid: true},
    };

    const form = new FormGroup({
      field: new FormControl('initial', [conditionalValidator(config)]),
      dependency: new FormControl('notTrigger'),
    });

    form.get('dependency')?.setValue('trigger');
    form.get('field')?.setValue('invalid');

    const errors: ValidationErrors | null = form.get('field')?.errors;

    expect(errors).toEqual({invalid: true}, 'Expected validator to re-evaluate and apply when dependency field changes and validation fails');
  });
});

describe('JlValidators', () => {
  let form: FormGroup;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
    form = new FormGroup({
      testControl: control,
      conditionControl: new FormControl(false)
    });
  });

  describe('required validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.required(() => true);
      control.setValidators(validator);

      control.setValue('');
      expect(control.errors).toEqual({ required: true });

      control.setValue('test');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.required(() => false);
      control.setValidators(validator);

      control.setValue('');
      expect(control.errors).toBeNull();
    });
  });

  describe('minLength validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.minLength(3, () => true);
      control.setValidators(validator);

      control.setValue('ab');
      expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

      control.setValue('abc');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.minLength(3, () => false);
      control.setValidators(validator);

      control.setValue('ab');
      expect(control.errors).toBeNull();
    });
  });
  describe('minLength validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.minLength(3, () => true);
      control.setValidators(validator);

      control.setValue('ab');
      expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });

      control.setValue('abc');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.minLength(3, () => false);
      control.setValidators(validator);

      control.setValue('ab');
      expect(control.errors).toBeNull();
    });
  });

  describe('maxLength validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.maxLength(3, () => true);
      control.setValidators(validator);

      control.setValue('abcd');
      expect(control.errors).toEqual({ maxlength: { requiredLength: 3, actualLength: 4 } });

      control.setValue('abc');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.maxLength(3, () => false);
      control.setValidators(validator);

      control.setValue('abcd');
      expect(control.errors).toBeNull();
    });
  });

  describe('pattern validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.pattern(/^[0-9]+$/, () => true);
      control.setValidators(validator);

      control.setValue('abc');
      expect(control.hasError('pattern')).toBe(true);
      control.setValue('123');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.pattern(/^[0-9]+$/, () => false);
      control.setValidators(validator);

      control.setValue('abc');
      expect(control.errors).toBeNull();
    });
  });

  describe('email validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.email(() => true);
      control.setValidators(validator);

      control.setValue('invalid-email');
      expect(control.hasError('email')).toBe(true);

      control.setValue('valid@email.com');
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.email(() => false);
      control.setValidators(validator);

      control.setValue('invalid-email');
      expect(control.errors).toBeNull();
    });
  });

  describe('min validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.min(5, () => true);
      control.setValidators(validator);

      control.setValue(3);
      expect(control.errors).toEqual({ min: { min: 5, actual: 3 } });

      control.setValue(6);
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.min(5, () => false);
      control.setValidators(validator);

      control.setValue(3);
      expect(control.errors).toBeNull();
    });
  });

  describe('max validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.max(5, () => true);
      control.setValidators(validator);

      control.setValue(7);
      expect(control.errors).toEqual({ max: { max: 5, actual: 7 } });

      control.setValue(4);
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.max(5, () => false);
      control.setValidators(validator);

      control.setValue(7);
      expect(control.errors).toBeNull();
    });
  });

  describe('requiredTrue validator', () => {
    it('should validate when condition is true', () => {
      const validator = JlValidators.requiredTrue(() => true);
      control.setValidators(validator);

      control.setValue(false);
      expect(control.errors).toEqual({ required: true });

      control.setValue(true);
      expect(control.errors).toBeNull();
    });

    it('should not validate when condition is false', () => {
      const validator = JlValidators.requiredTrue(() => false);
      control.setValidators(validator);

      control.setValue(false);
      expect(control.errors).toBeNull();
    });
  });

  describe('conditional validation with dependencies', () => {
    it('should update validation when dependent field changes', () => {
      const validator = JlValidators.required(control => {
        return control.parent?.get('conditionControl')?.value === true;
      });

      control.setValidators(validator);

      // Initially false, so no validation
      expect(control.errors).toBeNull();

      // Change condition to true
      form.get('conditionControl')?.setValue(true);
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ required: true });

      // Set a valid value
      control.setValue('test');
      expect(control.errors).toBeNull();

      // Change condition back to false
      form.get('conditionControl')?.setValue(false);
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });
  });

});
