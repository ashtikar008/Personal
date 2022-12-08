import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataService } from 'src/app/services/form-data.service';
import { FormFiveComponent } from '../form-five/form-five.component';
import { FormOneComponent } from '../form-one/form-one.component';
import { FormSevenComponent } from '../form-seven/form-seven.component';
import { FormThreeComponent } from '../form-three/form-three.component';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss']
})
export class FormStepperComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(FormOneComponent) formOne!: FormOneComponent;
  @ViewChild(FormThreeComponent) formThree!: FormThreeComponent;
  @ViewChild(FormFiveComponent) formFive!: FormFiveComponent;
  @ViewChild(FormSevenComponent) formSeven!: FormSevenComponent;
  investorBackCount: number = 0;
  invalidStep: any = { invalid: true };
  validStep: any = { invalid: false };
  formOneControl: boolean = false;
  formThreeControl: boolean = false;
  formFiveControl: boolean = false;
  additionalClick: boolean = false;
  isAdditionalInvestor: boolean = false;
  formOneValid: boolean = false;
  guarantorAvailable: boolean = false;
  stepperOrientation!: Observable<StepperOrientation>;
  investorAvailable: boolean = false;
  borrowerBackCount: number = 0;
  constructor(public formService: FormDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router, breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    private spinner: NgxSpinnerService) {
    this.spinner.show();
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params: any) => {
      if (!params?.b_hash || !params?.s_hash) {
        this.router.navigate(['/pageNotFound'])
      } else {
        await this.getStep3Data(params)
      }
    })
  }
  getStep3Data(params: any) {
    return new Promise(resolve => {
      this.apiService.get(`/step3/${params?.b_hash}/${params?.s_hash}`).subscribe((res: any) => {
        if (res && res?.items) {
          this.formService.scenarioId = res?.items[0]?.scenario?.scenarioId;
          this.formService.preData = res?.items[0];
          this.formOne.ngOnInit();
          resolve(res?.items);
          this.spinner.hide();
        } else {
          this.router.navigate(['/PageNotFound'])
        }
      })
    });
  }
  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params?.b_hash && params?.s_hash) {
        this.formOne.hashForm.get('borrowerId')?.patchValue(params?.b_hash)
        this.formOne.hashForm.get('scenarioId')?.patchValue(params?.s_hash)
      }
    })
  }
  next(value: any) {
    if (value == 'borrowerParties') {
      if ((this.formService.borrowerIndex + 1) <= this.formService.preData.borrower.borrowerPartyDetails.length && this.formOne.formOne.valid) {
        let documents: any = Object.assign({},
          {
            identity: {
              PASSPORT: this.formSeven.formSeven.value.PASSPORT,
              DRIVING_LICENCE: this.formSeven.formSeven.value.DRIVING_LICENCE
            },
            financial: {
              SALARY_SLIP: this.formSeven.formSeven.value.SALARY_SLIP,
              IDENTITY_PAYG: this.formSeven.formSeven.value.IDENTITY_PAYG,
            },
            additionalDocuments: this.formSeven.additionalDocuments
          }
        )

        this.formOne.pushValue(documents);
        if (this.formService.borrowerIndex == this.formService.preData.borrower.borrowerPartyDetails.length) {
          this.stepper.selectedIndex = 1;
        } else {
          this.stepper.selectedIndex = 0;
        }
        this.formSeven.formSeven.reset();
        this.formSeven.resetDocuments();
        this.formSeven.additionalDocuments = {};
      }
      if (this.formService.borrowerIndex == this.formService.preData.borrower.borrowerPartyDetails.length) {
        this.formOneControl = true;

        this.stepper.selectedIndex = 1;
        this.borrowerBackCount = 0;
      }
      if ((this.formService.borrowerIndex) < this.formService.formData.borrowerParties.length) {
        this.stepper.selectedIndex = 0;
        this.formOne.formOne.reset();
        this.formSeven.resetDocuments();
        this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params?.b_hash && params?.s_hash) {
            this.formOne.formOne.get('borrowerId')?.patchValue(params?.b_hash)
            this.formOne.formOne.get('scenarioId')?.patchValue(params?.s_hash)
          }
        })
        this.formOne.formOne.patchValue(this.formService.formData.borrowerParties[this.formService.borrowerIndex]);
        this.formSeven.patchDocuments(this.formService.formData.borrowerParties[this.formService.borrowerIndex].documents);
      }
    } else if (value == 'guarantorCheck') {
      if (this.formService.guarantorCheck == "yes") {
        this.stepper.selectedIndex = 2;
        this.formThree.unTouchAll();
      }
    } else if (value == 'investors') {
      if (this.formFive.formFive.invalid) {
        Object.keys(this.formFive.formFive.controls).forEach(field => {
          let control = this.formFive.formFive.get(field);
          if (control?.hasValidator(Validators.required) && control.value == null) {
            this.formFive.formFive.setErrors({ 'invalid': true });
            control.setErrors({ 'incorrect': true });
            window.scroll({ top: 190, left: 0, behavior: 'smooth' });
          }
        });
        window.scroll({ top: 180, left: 0, behavior: 'smooth' });
      } else {
        this.formFive.pushValue();
        this.isAdditionalInvestor = true;
      }
      if (this.formService.formData.investors[(this.formService.investorIndex + 1)] != undefined) {
        this.stepper.selectedIndex = (this.stepper.selectedIndex - 1);
        this.formService.investorIndex++
        let index = this.formService.investorIndex;
        this.formFive.formSeven.patchDocuments(this.formService.formData.investors[index].documents);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index])
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorAccountDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorIdentityDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorPersonalDetails);
      }
    } else if (value == 'additionalInvestor') {
      if (this.formService.additionalInvestor == "yes") {
        this.formFive.formFive.reset();
        this.formFive.formSeven.resetDocuments();
        this.formFive.formSeven.additionalDocuments = {};
        this.formFive.unTouchAll()
        this.formFive.addressField.nativeElement.value = null;
        this.additionalClick = true;
        this.stepper.selectedIndex = (this.stepper.selectedIndex - 2);
        this.formService.investorIndex++
      }
    }
  }
  back(value: any) {
    if (value == 'borrowerParties') {
      if (this.borrowerBackCount == 0 && this.formService.borrowerIndex > 0) {
        let index = (this.formService.borrowerIndex - 1);
        this.formOne.formOne.patchValue(this.formService.formData.borrowerParties[index])
        this.formSeven.patchDocuments(this.formService.formData.borrowerParties[index].documents);
        this.formService.borrowerIndex = index;
        if (index == 1) { this.borrowerBackCount = 0 }
      } else {
        this.formOne.formOne.patchValue(this.formService.formData.borrowerParties[this.formService.borrowerIndex])
        this.formSeven.patchDocuments(this.formService.formData.borrowerParties[this.formService.borrowerIndex].documents);
        if (this.formService.borrowerIndex != 0) {
          this.formService.borrowerIndex--;
        }
      }
      this.borrowerBackCount++
    } else if (value == 'investors') {
      if (this.formService.investorIndex > 0 && this.investorBackCount == 0) {
        let index = (this.formService.investorIndex - 1);
        this.formFive.formSeven.patchDocuments(this.formService.formData.investors[index].documents);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index]);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorAccountDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorIdentityDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorPersonalDetails);
        this.formService.investorIndex = index;
        this.stepper.selectedIndex = (this.stepper.selectedIndex + 1);
        this.investorBackCount++
      } else if (this.formService.investorIndex > 0 && this.investorBackCount != 0) {
        let index = this.formService.investorIndex;
        this.formFive.formSeven.patchDocuments(this.formService.formData.investors[index].documents);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index]);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorAccountDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorIdentityDetails);
        this.formFive.formFive.patchValue(this.formService.formData.investors[index].investorPersonalDetails);
        this.formService.investorIndex--;
        this.stepper.selectedIndex = (this.stepper.selectedIndex + 1);
      }
      if (this.formService.investorIndex == 0 && this.investorBackCount > 0) {
        this.investorBackCount = 0;
      }
    } else if (value == "additionalInvestor") {
      // if (this.formService.investorCheck == "no") {
      //   this.stepper.selectedIndex = ((this.stepper.selectedIndex) - 1);
      // }
    }
  }
  ngAfterContentChecked() {
    if (this.stepper && this.stepper.selectedIndex != undefined) {
      this.formService.stepperIndex = this.stepper.selectedIndex
    }
    if (this.formOne && this.formOne.formOne.valid && this.formService.formData.borrowerParties.length > 0) {
      this.formOneControl = true;
    } else {
      this.formOneControl = false;
    }
    if (this.formThree && this.formThree.formThree.valid) {
      this.formThreeControl = true;
    } else {
      this.formThreeControl = false;
    }
    if (this.formFive && this.formFive.formFive.valid) {
      this.formFiveControl = true;
    } else {
      this.formFiveControl = false;
    }
    if (this.formService.formData.investors && this.formService.formData.investors.length > 0) {
      this.isAdditionalInvestor = true;
    } else {
      this.isAdditionalInvestor = false;
    }
    if (this.formService && this.formService.preData &&
      Object.keys(this.formService.preData.guarantor).length != 0 &&
      this.formService.preData.guarantor != undefined) {
      this.guarantorAvailable = true;
    } else {
      this.guarantorAvailable = false;
    }
    if (this.formService && this.formService.preData && this.formService.preData.investors &&
      this.formService.preData.investors.length > 0) {
      this.investorAvailable = true;
    } else {
      this.investorAvailable = false;
    }
  }
  stepChange(event: any) {
    if (event.selectedStep.errorMessage == 'borrower' &&
      this.formService.borrowerIndex == this.formService.preData.borrower.borrowerPartyDetails.length &&
      this.formService.formData.borrowerParties[this.formService.borrowerIndex - 1] != undefined) {
      this.formSeven.patchDocuments(this.formService.formData.borrowerParties[this.formService.borrowerIndex - 1].documents);
      this.formService.borrowerIndex--;
    }
    if (event.selectedStep.errorMessage != "investors" &&
      this.formService.investorIndex == 0 &&
      this.formService.preData.investors.length > 0 &&
      this.formFive.formFive.invalid) {
      this.formFive.formFive.patchValue(this.formService.preData.investors[0]);
      this.formFive.formFive.patchValue(this.formService.preData.investors[0].investorPersonalDetails);
      this.formFive.formFive.patchValue(this.formService.preData.investors[0].investorIdentityDetails);
      this.formFive.formFive.patchValue(this.formService.preData.investors[0].investorAccountDetails);
    }
    if (event.selectedStep.errorMessage != "investors" &&
      this.additionalClick == false &&
      this.formService.investorIndex == this.formService.formData.investors.length) {
      this.investorBackCount = 0;
    }
    if (this.formService.additionalInvestor == 'yes' && this.additionalClick == true) {
      this.formFive.formFive.reset();
      this.formFive.unTouchAll()
      this.additionalClick = false;
    }
    if (
      event.selectedStep.errorMessage == "guarantor" &&
      this.formService && this.formService.preData &&
      this.formService.preData.guarantor &&
      this.formService.preData.guarantor.guarantorIdentityDetails && this.formService.formData.guarantor == null
    ) {
      this.formThree.formThree.patchValue(this.formService.preData.guarantor.guarantorIdentityDetails);
      this.formThree.formThree.patchValue(this.formService.preData.guarantor.guarantorPersonalDetails);
    }
  }
  scrollToTop() {
    setTimeout(() => {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  }
}

