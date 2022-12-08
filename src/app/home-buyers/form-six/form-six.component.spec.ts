import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSixComponent } from './form-six.component';

describe('FormSixComponent', () => {
  let component: FormSixComponent;
  let fixture: ComponentFixture<FormSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
