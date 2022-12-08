import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PropertyDetailsComponent } from '../property-details/property-details.component';
import { Title } from '@angular/platform-browser';
import { SettlementDetailsComponent } from '../settlement-details/settlement-details.component';
import { PropertyDocumentsComponent } from '../property-documents/property-documents.component';
import { SettlementDocumentsComponent } from '../settlement-documents/settlement-documents.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HashComponent } from '../hash/hash.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  stepperOrientation!: Observable<StepperOrientation>;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(PropertyDetailsComponent) propertyDetails!: PropertyDetailsComponent;
  @ViewChild(SettlementDetailsComponent) settlementDetails!: SettlementDetailsComponent;
  @ViewChild(PropertyDocumentsComponent) propertyDocuments!: PropertyDocumentsComponent;
  @ViewChild(SettlementDocumentsComponent) settlementDocuments!: SettlementDocumentsComponent;
  @ViewChild(HashComponent) hashComponent!: HashComponent;
  allFormData: any = {};
  invalidStep: any = { invalid: true };
  validStep: any = { invalid: false };
  propertyDetailsValid: boolean = false;
  settlementDetailsValid: boolean = false;
  propertyDocumentsValid:boolean = false;
  settlementDocumentsValid:boolean = false;
  constructor(breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router) {
    this.titleService.setTitle('Step-5')
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(async (params: any) => {
      if (!params?.b_hash || !params?.s_hash) {
        this.router.navigate(['/pageNotFound'])
      } else {
        this.spinner.show();
        await this.getStep5Data(params);
      }
    })
  }

  getStep5Data(params: any) {
    return new Promise(resolve => {
      this.apiService.get(`/step5/${params?.b_hash}/${params?.s_hash}`).subscribe((res: any) => {
        if (res && res?.items) {
          this.propertyDetails.propertyDetails.patchValue(res.items[0].propertyDetails);
          this.propertyDocuments.propertyDocuments.patchValue(res.items[0].propertyDocuments);
          this.settlementDetails.settlementDetails.patchValue(res.items[0].settlementDetails.vendorBankingDetails);
          this.settlementDocuments.settlementDocuments.patchValue(res.items[0].settlementDocuments);
          resolve(res?.items);
          this.spinner.hide();
        } else {
          this.router.navigate(['/PageNotFound'])
        }
      },error => {
        if (error) {
          console.log(error)
          this.router.navigate(['/PageNotFound'])
        }
      })
    });
  }
  next(stepName: any) {
    if (stepName == "propertyDetails") {
      if (this.propertyDetails.propertyDetails.invalid) { this.toastrService.warning('Please fill all required fields') } else {
        if (this.allFormData && this.allFormData.propertyDetails != this.propertyDetails.propertyDetails.value) {
          let body = Object.assign({}, this.propertyDetails.propertyDetails.value);
          if (body != undefined) {
            body.borrowerHash = this.hashComponent.hashForm.value.borrowerHash;
            body.scenarioHash = this.hashComponent.hashForm.value.scenarioHash;
          }
          this.spinner.show();
          if (body && body.propertyClassId) {
            this.apiService.patch(`/step5/property/${body.propertyClassId}`, body).subscribe((res: any) => {
              if (res) {
                this.toastrService.success("property details updated successfully!")
                this.spinner.hide();
                this.propertyDetailsValid = true;
                setTimeout(() => { this.stepper.next(); }, 100);
              }
            });
          } else {
            this.apiService.post('/step5/property', body).subscribe((res: any) => {
              if (res) {
                this.toastrService.success("property details posted successfully!")
                this.spinner.hide();
                this.propertyDetailsValid = true;
                setTimeout(() => { this.stepper.next(); }, 100);
              }
            });
          }
        }
        this.allFormData.propertyDetails = this.propertyDetails.propertyDetails.value;
      }
    } else if (stepName == "propertyDocuments") {
      if (this.allFormData && this.allFormData.propertyDocuments != this.propertyDocuments.propertyDocuments.value) {
        let body = this.propertyDocuments.propertyDocuments.value;
        body.borrowerHash = this.hashComponent.hashForm.value.borrowerHash;
        body.scenarioHash = this.hashComponent.hashForm.value.scenarioHash;
        body.additionalDocuments = this.propertyDocuments.additionalDocuments;
        if (body != undefined) {
          this.spinner.show();
          this.apiService.patch('/step5/property/documents', body).subscribe((res: any) => {
            if (res) {
              console.log(res);
              this.spinner.hide();
              this.toastrService.success('Documents updated successfully!')
              this.propertyDocumentsValid = true;
              setTimeout(() => { this.stepper.next(); }, 100);
            }
          })
        }
      }
      this.allFormData.propertyDocuments = this.propertyDocuments.propertyDocuments.value
      if (Object.keys(this.propertyDocuments.additionalDocuments).length > 0) {
        this.allFormData.propertyDocuments['additionalDocuments'] = this.propertyDocuments.additionalDocuments
      }
    } else if (stepName == "settlementDetails") {
      if (this.settlementDetails.settlementDetails.invalid) { this.toastrService.warning('Please fill all required fields') } else {
        let settlementDetails = this.settlementDetails.settlementDetails.value
        let settlementObj:any = {
          "vendorBankingDetails": {
            "bankName": settlementDetails.bankName,
            "accountName": settlementDetails.accountName,
            "accountNumber": settlementDetails.accountNumber,
            "bsb": settlementDetails.bsb,
            "branch": settlementDetails.branch,
            "swiftId": settlementDetails.swiftId
          }
        }
        if ((this.allFormData && !this.allFormData.settlementDetails) || 
        ( JSON.stringify(this.allFormData.settlementDetails.vendorBankingDetails) !== JSON.stringify(settlementObj.vendorBankingDetails))) {
          settlementObj.borrowerHash = this.hashComponent.hashForm.value.borrowerHash;
          settlementObj.scenarioHash = this.hashComponent.hashForm.value.scenarioHash;
          this.spinner.show();
          this.apiService.patch(`/step5/property/4cfab26e-bf31-40fe-b2ab-e776caca100a`, settlementObj).subscribe((res: any) => {
            if (res) {
              this.allFormData.settlementDetails = settlementObj;
              this.toastrService.success("settlement details updated successfully!")
              this.spinner.hide();
              this.settlementDetailsValid = true;
              setTimeout(() => { this.stepper.next(); }, 100);
            }
          });
        }
      }
    } else if (stepName == "settlementDocuments") {
      if(this.allFormData && this.allFormData.settlementDocuments != this.settlementDocuments.settlementDocuments.value){
        let body = this.settlementDocuments.settlementDocuments.value;
        body.borrowerHash = this.hashComponent.hashForm.value.borrowerHash;
        body.scenarioHash = this.hashComponent.hashForm.value.scenarioHash;
        body.additionalDocuments = this.settlementDocuments.additionalDocuments;
        if (body != undefined) {
          this.spinner.show();
          this.apiService.patch('/step5/settlement/documents', body).subscribe((res: any) => {
            if (res) {
              console.log(res);
              this.spinner.hide();
              this.toastrService.success('Documents updated successfully!');
              this.settlementDocumentsValid = true;
              setTimeout(() => { this.stepper.next(); }, 100);
            }
          })
        }
      }
      this.allFormData.settlementDocuments = this.settlementDocuments.settlementDocuments.value
      if (this.settlementDocuments.additionalDocuments && Object.keys(this.settlementDocuments.additionalDocuments).length > 0) {
        this.allFormData.settlementDocuments["additionalDocuments"] = this.settlementDocuments.additionalDocuments;
      }
    }
  }
  back(stepName: any) {

  }
  stepChange(event: any) {

  }
}
