import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeBuyersRoutingModule } from './home-buyers-routing.module';
import { FormOneComponent } from './form-one/form-one.component';
import { MaterialExampleModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormTwoComponent } from './form-two/form-two.component';
import { FormThreeComponent } from './form-three/form-three.component';
import { FormFourComponent } from './form-four/form-four.component';
import { FormFiveComponent } from './form-five/form-five.component';
import { FormSixComponent } from './form-six/form-six.component';
import { FormSevenComponent } from './form-seven/form-seven.component';
import { SharedModule } from '../shared/shared.module';
import { PreviewFormComponent } from './preview-form/preview-form.component';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './header/header.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { ThankYouComponent } from './thank-you/thank-you.component';


@NgModule({
  declarations: [
    FormOneComponent,
    FormTwoComponent,
    FormThreeComponent,
    FormFourComponent,
    FormFiveComponent,
    FormSixComponent,
    FormSevenComponent,
    PreviewFormComponent,
    HeaderComponent,
    FormStepperComponent,
    ThankYouComponent,
  ],
  imports: [
    CommonModule,
    HomeBuyersRoutingModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 1000, // 1 seconds
      progressBar: true,
    }),
  ],
  providers: [DatePipe]
})
export class HomeBuyersModule { }
