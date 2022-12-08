import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  providers: [TitleCasePipe]
})
export class PreviewComponent implements OnInit {
  @Input() formData!: any;
  b_hash: any;
  s_hash: any;
  constructor(
    private titlecasePipe: TitleCasePipe , 
    private router:Router,
    private apiService:ApiService,
    private spinner:NgxSpinnerService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async (params: any) => {
      if (params?.b_hash && params?.s_hash) {
        this.b_hash = params?.b_hash;
        this.s_hash = params?.s_hash;
      }
    })
  }
  typeOf(value: any) {
    return typeof value;
  }
  getFieldNames(value: any) {
    if (!String(value).includes('_')) {
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
      return this.titlecasePipe.transform(returnValue.join(""));
    } else {
      return value;
    }
  }
  submit() {
    this.spinner.show();
    this.apiService.patch(`/step5/${this.b_hash}/${this.s_hash}/submit`, {}).subscribe((res: any) => {
      if (res && res.message) {
        this.spinner.hide();
        this.toastrService.success(res.message);
        console.log('res====>', res);
        this.router.navigate(['submitted']);
      }
    });
  }
}
