import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSevenComponent } from './form-seven.component';

describe('FormSevenComponent', () => {
  let component: FormSevenComponent;
  let fixture: ComponentFixture<FormSevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
