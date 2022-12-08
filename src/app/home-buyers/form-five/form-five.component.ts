import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from 'src/app/services/form-data.service';
import { FormSevenComponent } from '../form-seven/form-seven.component';

@Component({
  selector: 'app-form-five',
  templateUrl: './form-five.component.html',
  styleUrls: ['./form-five.component.scss']
})
export class FormFiveComponent implements OnInit {
  @ViewChild("address", { static: false }) addressField!: ElementRef;
  @ViewChild(FormSevenComponent) formSeven!: FormSevenComponent;
  public addr: any;
  formFive: FormGroup;
  setAddress(addrObj: any) {
    this.zone.run(() => {
      this.addr = addrObj;
    });
    if (this.addr != undefined) {
      let address = this.addr.name.concat(' ', this.addr.formatted_address);
      if (address != undefined) {
        this.formFive.patchValue({ address: address });
      }
      let state = this.addr.address_components.find((x: any) => x.types[0] == "administrative_area_level_1");
      if (state != undefined) {
        this.formFive.patchValue({ stateProvinceTerritory: state.short_name });
      } else {
        this.formFive.controls['stateProvinceTerritory'].setValue('');
      }
      let city = this.addr.address_components.find((x: any) => x.types[0] == "locality");
      if (city != undefined) {
        this.formFive.patchValue({ city: city.long_name });
      } else {
        this.formFive.controls['city'].setValue('');
      }
      let postcode = this.addr.address_components.find((x: any) => x.types[0] == "postal_code");
      if (postcode != undefined) {
        this.formFive.controls['postCode'].patchValue(Number(postcode.long_name));
      } else {
        this.formFive.controls['postCode'].setValue('');
      }
      this.addressField.nativeElement.click();
    }
  }
  constructor(public fb: FormBuilder,
    public formService: FormDataService,
    private zone: NgZone,
    private datePipe: DatePipe,) {
    this.formFive = this.fb.group({
      relationship: new FormControl(''),
      investorType: new FormControl('', [Validators.required]),
      taxResidence: new FormControl(''),
      placementAmount: new FormControl('', [Validators.required]),
      salutation: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      titleRole: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      stateProvinceTerritory: new FormControl('', [Validators.required]),
      postCode: new FormControl('', Validators.pattern("^([0-9]{4})$")),
      emailAddress: new FormControl('', Validators.email),
      phoneNumber: new FormControl('', Validators.pattern("^[4][0-9]{8}$")),
      DOB: new FormControl('', [Validators.required]),
      investorKycAddress: new FormControl(''),
      passportId: new FormControl(''),
      nameOnPassport: new FormControl(''),
      passportExpiry: new FormControl(''),
      driverlicenseId: new FormControl(''),
      nameOnDl: new FormControl(''),
      stateOfIssuance: new FormControl(''),
      australianBusinessNumber: new FormControl(''),
      taxFileNumber: new FormControl(''),
      accountName: new FormControl(''),
      BSB: new FormControl(''),
      accountNumber: new FormControl(''),
      bankName: new FormControl(''),
      branch: new FormControl(''),
      swiftId: new FormControl(''),
      folderId: new FormControl(''),
      borrowerId: new FormControl(''),
      kycStatus: new FormControl(''),
    })
  }

  ngOnInit(): void {

  }
  checkAddress() {
    if (this.formFive.value.address == null || this.formFive.value.address == '') {
      this.formFive.controls['city'].setValue('');
      this.formFive.controls['postCode'].setValue('');
      this.formFive.controls['stateProvinceTerritory'].setValue('');
    }
  }
  checkPhone() {
    let phoneNumber = `${this.formFive.value.phoneNumber}`;
    if (phoneNumber) {
      if (phoneNumber.length > 2 && phoneNumber.slice(0, 3) === '+61') {
        this.formFive.controls['phoneNumber'].setValue(phoneNumber.slice(3));
        return;
      } else if (phoneNumber.length > 2 && phoneNumber.slice(0, 2) === '61') {
        this.formFive.controls['phoneNumber'].setValue(phoneNumber.slice(2));
      } else { this.formFive.controls['phoneNumber'].setValue(+phoneNumber) }
    }
  }
  checkDate() {
    var ageDifMs = Date.now() - this.formFive.value.DOB.getTime();
    var ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age != undefined && age < 18) {
      this.formFive.controls['DOB'].setErrors({ 'incorrect': true });
    }
    if (age != undefined && age > 18) {
      let value = this.datePipe.transform(this.formFive.controls['DOB'].value, 'yyyy-MM-dd')
      this.formFive.controls['DOB'].patchValue(value)
    }
  }
  onDateChange(name: any) {
    if (name == 'passportExpiry') {
      let value = this.datePipe.transform(this.formFive.controls['passportExpiry'].value, 'yyyy-MM-dd')
      this.formFive.controls['passportExpiry'].patchValue(value)
    }
  }
  pushValue() {
    if (this.formFive.valid) {
      let formFive = this.formFive.getRawValue();
      this.formService.formData.investors[this.formService.investorIndex] = formFive;
      let documents: any = Object.assign({},
        {
          identity: {
            PASSPORT: this.formSeven.formSeven.value.PASSPORT,
            DRIVING_LICENCE: this.formSeven.formSeven.value.DRIVING_LICENCE
          },
          financial: {
            SALARY_SLIP: this.formSeven.formSeven.value.SALARY_SLIP,
            IDENTITY_PAYG: this.formSeven.formSeven.value.IDENTITY_PAYG,
            MISC: this.formSeven.formSeven.value.MISC
          },
          additionalDocuments: this.formSeven.additionalDocuments
        }
      )
      this.formService.formData.investors[this.formService.investorIndex].documents = documents;
    }
  }
  unTouchAll() {
    Object.keys(this.formFive.controls).forEach(field => {
      this.formFive.get(field)?.setErrors(null);
    });
    this.formFive.setErrors({ 'invalid': true });
  }
}
