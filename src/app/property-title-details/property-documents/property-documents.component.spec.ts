import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDocumentsComponent } from './property-documents.component';

describe('PropertyDocumentsComponent', () => {
  let component: PropertyDocumentsComponent;
  let fixture: ComponentFixture<PropertyDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
