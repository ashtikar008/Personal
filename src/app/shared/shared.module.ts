import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GooglePlacesDirective } from '../directives/google-places.directive';



@NgModule({
  declarations: [GooglePlacesDirective],
  exports: [GooglePlacesDirective],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
