# FormGroup Decorator Library Documentation

## Overview
This library provides a convenient way to transform TypeScript classes into Angular FormGroups using decorators. It simplifies form management by automatically creating FormControls from class properties and handling validation.

## Installation

npm install typed-form-craft

## Requirements
- Angular 19.0.0 or higher
- TypeScript 5.0.0 or higher

## Features

### Automatic FormGroup Generation
- Transform any class into a FormGroup using the `@controlProp` annotation
- Class properties are automatically converted into FormControls
- Supports nested forms and complex structures

Example:
```typescript
// Define your class with the decorator

export class MyClass {
  @controlProp({ defaultValue: '' })
  firstField: string;

  @controlProp({ defaultValue: false })
  secondField: boolean;

  @controlProp({ defaultValue: 0 })
  anotherField: number;

  fieldToIgnore: string;
}

// Usage in component
export class CustomerComponent {
  customerForm: FormGroup;

  constructor() {
    // Automatically creates a FormGroup with all FormControls (only decorated)
    this.customerForm = createFormFromClass<MyClass>(test);
  }
}
```

### Built-in Validation
- Includes `JlValidators` for common validation scenarios
- Validators can be activated based on conditions
- Easy to combine multiple validators

Example:
```typescript
// Define your class with the decorator

export class MyClass {
  @controlProp({
    validators: [Validators.required, Validators.maxLength(4)],
    defaultValue: ''
  })
  firstField: string;

  @controlProp({
    validators: [Validators.required],
    defaultValue: ''
  })
  secondField: boolean;

  @controlProp({
    validators: [JlValidators.required((control) => control.parent?.get('firstField')?.value === 'test')]
  })
  anotherField: number;

  fieldToIgnore: string;
}
```
Other Validators available, working in the same way:
* minLength
* maxLength
* pattern
* email
* min
* max
* requiredTrue


### Conditional Form Control Management
- Enable/disable form controls based on custom conditions
- Dynamic validation based on form state
- Reactive form control behavior

Example:
```typescript
// Define your class with the decorator

export class MyClass {
  @controlProp({
    validators: [Validators.required, Validators.maxLength(4)],
    defaultValue: ''
  })
  firstField: string;

  @controlProp({
    validators: [Validators.required],
    defaultValue: '',
    disable: (form: FormGroup) => form.get('firstField').invalid
  })
  secondField: boolean;

  @controlProp({
    validators: [JlValidators.required((control) => control.parent?.get('firstField')?.value === 'test')]
  })
  anotherField: number;

  fieldToIgnore: string;
}
```
