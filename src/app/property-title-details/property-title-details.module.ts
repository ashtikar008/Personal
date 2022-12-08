import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from '../../material.module';
import { PropertyTitleDetailsRoutingModule } from './property-title-details-routing.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { StepperComponent } from './stepper/stepper.component';
import { PropertyDocumentsComponent } from './property-documents/property-documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SettlementDetailsComponent } from './settlement-details/settlement-details.component';
import { SettlementDocumentsComponent } from './settlement-documents/settlement-documents.component';
import { HashComponent } from './hash/hash.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    PropertyDetailsComponent,
    StepperComponent,
    PropertyDocumentsComponent,
    SettlementDetailsComponent,
    SettlementDocumentsComponent,
    HashComponent,
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    PropertyTitleDetailsRoutingModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class PropertyTitleDetailsModule { }
