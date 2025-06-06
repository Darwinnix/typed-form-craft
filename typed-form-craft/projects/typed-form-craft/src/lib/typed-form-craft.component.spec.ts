import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedFormCraftComponent } from './typed-form-craft.component';

describe('TypedFormCraftComponent', () => {
  let component: TypedFormCraftComponent;
  let fixture: ComponentFixture<TypedFormCraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypedFormCraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypedFormCraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
