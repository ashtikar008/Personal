import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { FormDataService } from 'src/app/services/form-data.service';


@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.scss']
})
export class PreviewFormComponent implements OnInit {
  constructor(
    private toastrService: ToastrService,
    public formService: FormDataService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {}
  submit() {
    let scenarioId = this.formService.scenarioId;
    if (this.formService.formData && this.formService.formData.investors.length == 0) {
      this.formService.formData.investors = false;
    }
    this.spinner.show();
    this.apiService.post(`/scenario/${scenarioId}/sync/personal-data`, this.formService.formData).subscribe((res: any) => {
      if (res && res.message) {
        this.spinner.hide();
        this.toastrService.success('Updated Successfully');
        console.log('res====>', res);
        this.router.navigate(['submitted']);
      }
    });
  }
  testObjArr: any = []
  getTypeOf(data: any) {  
    let x = data.reduce((acc: any, i: any) => {
      return { ...acc, ['documentId']: i.documentId, ['fileName']: i.fileName }
    }, {})
    this.testObjArr.push(x);
  }
  getFileName(event: any) {
    if (event.files && event.files[0]?.name) {
      return event.files[0].name
    }
  }
  getFieldNames(value: any) {

    let newValue = value.split(/(?=[A-Z])/);
    let returnValue = []
    if (newValue != undefined) {
      for (let i = 0; i < newValue.length; i++) {
        if (String(newValue[i]).length == 1) {
          if (String(newValue[(i + 1)]).length == 1) {
            returnValue.push(newValue[i])
          } else {
            returnValue.push(newValue[i] + ' ')
          }
        } else {
          returnValue.push(newValue[i] + ' ')
        }
      }
    }
    return returnValue.join("");
  }
  getDocName(val: any) {

    let newValue = val.split('_');
    let returnValue = []
    if (newValue != undefined) {
      for (let i = 0; i < newValue.length; i++) {
        returnValue.push(newValue[i] + ' ')
      }
    }
    return returnValue.join("").toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }

}
