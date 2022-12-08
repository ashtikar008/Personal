import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiveComponent } from './form-five.component';

describe('FormFiveComponent', () => {
  let component: FormFiveComponent;
  let fixture: ComponentFixture<FormFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
