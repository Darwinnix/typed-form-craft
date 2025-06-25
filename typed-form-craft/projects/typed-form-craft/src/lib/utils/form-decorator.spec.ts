import 'reflect-metadata';
import { FormControlOptions } from '../types/form-control-options.type';
import {controlGroupProp, controlProp} from './form-decorator';
import {FORM_CONTROL_METADATA, FORM_GROUP_METADATA} from './constantes';

describe("controlProp", () => {
  beforeEach(() => {
    Reflect.defineMetadata(FORM_CONTROL_METADATA, {}, {});
  });

  it("should store the options in the class metadata for the given property", () => {
    const options: Partial<FormControlOptions> = {
      validators: [jest.fn()],
      asyncValidators: [jest.fn()],
      defaultValue: "test"
    };

    const target = {};
    const propertyKey = "testProperty";

    controlProp(options)(target, propertyKey);

    const metadata = Reflect.getMetadata(FORM_CONTROL_METADATA, target);
    expect(metadata).toBeDefined();
    expect(metadata[propertyKey]).toBe(options);
  });
});

describe('controlGroupProp', () => {
  it('should return a function', () => {
    const decorator = controlGroupProp();
    expect(typeof decorator).toBe('function');
  });

  it('should accept target and propertyKey parameters', () => {
    const decorator = controlGroupProp();
    // Mock objects for testing
    const target = {};
    const propertyKey = 'testKey';

    // Ensure the decorator function can be called with the correct parameters
    expect(() => decorator(target, propertyKey)).not.toThrow();
  });
});
