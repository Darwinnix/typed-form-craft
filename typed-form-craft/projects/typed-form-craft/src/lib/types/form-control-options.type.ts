import {FormGroup} from '@angular/forms';

export type FormControlOptions<T = any> = {
  validators: any[];
  asyncValidators: any[];
  defaultValue: T;
  disable: (form: FormGroup) => boolean;
}
