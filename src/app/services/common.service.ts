import { EventEmitter, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public toastrService: ToastrService,
    public spinner: NgxSpinnerService) { }

  displayLoader: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  /**
   * Purpose: Common Toaster
   * @param flag 
   * @param message 
   */
   toaster(flag: any, message: string) {
    switch (flag) {
      case 'success': {
        this.toastrService.success(message,'Success');
        break;
      }
      case 'warning': {
        this.toastrService.warning(message,'Warning');
        break;
      }
      case 'error': {
        this.toastrService.error(message,'Error');
        break;
      }
    }
  }
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
