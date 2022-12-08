import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementDocumentsComponent } from './settlement-documents.component';

describe('SettlementDocumentsComponent', () => {
  let component: SettlementDocumentsComponent;
  let fixture: ComponentFixture<SettlementDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
