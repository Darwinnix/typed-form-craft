import { TestBed } from '@angular/core/testing';

import { TypedFormCraftService } from './typed-form-craft.service';

describe('TypedFormCraftService', () => {
  let service: TypedFormCraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypedFormCraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
