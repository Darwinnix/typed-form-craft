# FormGroup Decorator Library Documentation
[![npm version](https://badge.fury.io/js/jlf-typed-form-craft.svg?icon=si%3Anpm)](https://badge.fury.io/js/jlf-typed-form-craft)
[![NPM Downloads](https://img.shields.io/npm/dm/jlf-typed-form-craft)](https://www.npmjs.com/package/jlf-typed-form-craft)
## Overview
This library provides a convenient way to transform TypeScript classes into Angular FormGroups using decorators. It simplifies form management by automatically creating FormControls from class properties and handling validation.

## Installation

npm install jlf-typed-form-craft

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
    const model = new MyClass();
    // Automatically creates a FormGroup with all FormControls (only decorated) 
    // with default value set
    this.customerForm = createFormFromClass<MyClass>(model);
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
  // add two validators
  @controlProp({
    validators: [Validators.required, Validators.maxLength(4)],
    defaultValue: ''
  })
  firstField: string;

  @controlProp({ defaultValue: '' })
  secondField: boolean;

  // added JlValidators with conditional expression.
  @controlProp({
    validators: [JlValidators.required((form: FormGroup) => form.get('firstField')?.value === 'test')]
  })
  anotherField: number;

  fieldToIgnore: string;
}
```
Other JlValidators available, working in the same way:
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

  // added disable control if firstField invalid
  @controlProp({
    defaultValue: '',
    disable: (form: FormGroup) => form.get('firstField').invalid
  })
  secondField: boolean;

  @controlProp({
    validators: [JlValidators.required((form: FormGroup) => form.get('firstField')?.value === 'test')]
  })
  anotherField: number;

  fieldToIgnore: string;
}
```
## Licence
MIT
