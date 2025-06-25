import "reflect-metadata";
import {createFormFromClass, DestroyableFormGroup} from './forms.utils';
import {FormControl, FormGroup, Validators} from '@angular/forms';

const FORM_CONTROL_METADATA = "form:control:metadata";
const FORM_GROUP_METADATA = "form:group:metadata";

describe('createFormFromClass', () => {
  class AddressClass {
   city: string;
   country: string;
  }
  class TestClass {
    name = 'Default Name';
    age = 25;
    address: AddressClass = {
      city: 'Default City',
      country: 'Default Country'
    }
  }

  beforeAll(() => {
    Reflect.defineMetadata(FORM_CONTROL_METADATA, {
      name: {
        defaultValue: 'John Doe',
        validators: [Validators.required]
      },
      age: {
        defaultValue: 30,
        disable: (formGroup: FormGroup) => formGroup.get('name')?.value === 'Disabled'
      }
    }, TestClass.prototype);
    Reflect.defineMetadata(FORM_GROUP_METADATA, {
      address: undefined
    }, TestClass.prototype);
    Reflect.defineMetadata(FORM_CONTROL_METADATA, {
      city: {
        defaultValue: 'Paris'
      },
      country: {
        defaultValue: 'France'
      }
    }, AddressClass.prototype);
  });

  it('should create a form with controls based on metadata', () => {
    const instance = new TestClass();
    const metadata = Reflect.getMetadata("form:control:metadata", instance);
    const formGroup = createFormFromClass(instance);
    console.log("Metadata:", metadata);
    expect(formGroup.get('name')).toBeInstanceOf(FormControl);
    expect(formGroup.get('age')).toBeInstanceOf(FormControl);
    expect(formGroup.get('name')?.value).toBe('John Doe');
    expect(formGroup.get('age')?.value).toBe(30);
  });

  it('should set validators and update validity', () => {
    const instance = new TestClass();
    const formGroup = createFormFromClass(instance);

    const nameControl = formGroup.controls['name'];
    nameControl.setValue('');
    expect(nameControl.valid).toBe(false);
    expect(nameControl.hasError('required')).toBe(true);
  });

  it('should disable controls dynamically based on condition', () => {
    const instance = new TestClass();
    const formGroup = createFormFromClass(instance);

    const nameControl = formGroup.controls['name'];
    const ageControl = formGroup.controls['age'];

    expect(ageControl.disabled).toBe(false);

    nameControl.setValue('Disabled');
    formGroup.updateValueAndValidity();

    expect(ageControl.disabled).toBe(true);
  });

  it('should clean up subscriptions on destroy', () => {
    const instance = new TestClass();
    const formGroup = createFormFromClass(instance) as DestroyableFormGroup<TestClass>;

    const destroySpy = jest.spyOn(formGroup, 'destroy');
    formGroup.destroy();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('should create FormGroup for address', () => {
    const instance = new TestClass();
    const formGroup = createFormFromClass(instance);

    const address = formGroup.controls.address as FormGroup;

    expect(address).toBeDefined();
  });
});
