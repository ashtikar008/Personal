import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
const routes: Routes = [
  {
    path: '',
    redirectTo:'step3',
    component: FormStepperComponent
  },
  {
    path: 'step3',
    component: FormStepperComponent
  },
  {
    path: 'submitted',
    component: ThankYouComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeBuyersRoutingModule { }
