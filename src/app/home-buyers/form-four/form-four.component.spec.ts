import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFourComponent } from './form-four.component';

describe('FormFourComponent', () => {
  let component: FormFourComponent;
  let fixture: ComponentFixture<FormFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
