import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { FormDataService } from 'src/app/services/form-data.service';
import { FormSevenComponent } from '../form-seven/form-seven.component';
@Component({
  selector: 'app-form-three',
  templateUrl: './form-three.component.html',
  styleUrls: ['./form-three.component.scss']
})
export class FormThreeComponent implements OnInit {
  @ViewChild("address", { static: false }) addressField!: ElementRef;
  @ViewChild(FormSevenComponent) formSeven!: FormSevenComponent;
  public addr: any;
  formThree: FormGroup;
  setAddress(addrObj: any) {
    this.zone.run(() => {
      this.addr = addrObj;
    });
    if (this.addr != undefined) {
      let address = this.addr.name.concat(' ', this.addr.formatted_address);
      if (address != undefined) {
        this.formThree.patchValue({ address: address });
      }
      let state = this.addr.address_components.find((x: any) => x.types[0] == "administrative_area_level_1");
      if (state != undefined) {
        this.formThree.patchValue({ stateProvinceTerritory: state.short_name });
      } else {
        this.formThree.controls['stateProvinceTerritory'].setValue('');
      }
      let city = this.addr.address_components.find((x: any) => x.types[0] == "locality");
      if (city != undefined) {
        this.formThree.patchValue({ city: city.long_name });
      } else {
        this.formThree.controls['city'].setValue('');
      }
      let postcode = this.addr.address_components.find((x: any) => x.types[0] == "postal_code");
      if (postcode != undefined) {
        this.formThree.patchValue({ postCode: postcode.long_name });
      } else {
        this.formThree.controls['postCode'].setValue('');
      }
      this.addressField.nativeElement.click();
    }
  }

  constructor(public fb: FormBuilder,
    public formService: FormDataService,
    private zone: NgZone,
    private datePipe: DatePipe,) {
    this.formThree = this.fb.group({
      relationship: new FormControl('', [Validators.required]),
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
      passportId: new FormControl(''),
      nameOnPassport: new FormControl(''),
      passportExpiry: new FormControl(''),
      driverlicenseId: new FormControl(''),
      nameOnDl: new FormControl(''),
      stateOfIssuance: new FormControl(''),
      australianBusinessNumber: new FormControl(''),
      taxFileNumber: new FormControl(''),
    })
  }

  ngOnInit(): void { }
  checkAddress() {
    if (this.formThree.value.address == null || this.formThree.value.address == '') {
      this.formThree.controls['city'].setValue('');
      this.formThree.controls['PostCode'].setValue('');
      this.formThree.controls['stateProvinceTerritory'].setValue('');
    }
  }
  checkPhone() {
    let phoneNumber = `${this.formThree.value.phoneNumber}`;
    if (phoneNumber) {
      if (phoneNumber.length > 2 && phoneNumber.slice(0, 3) === '+61') {
        this.formThree.controls['phoneNumber'].setValue(phoneNumber.slice(3));
        return;
      } else if (phoneNumber.length > 2 && phoneNumber.slice(0, 2) === '61') {
        this.formThree.controls['phoneNumber'].setValue(phoneNumber.slice(2));
      } else { this.formThree.controls['phoneNumber'].setValue(+phoneNumber) }
    }
  }
  checkDate() {
    var ageDifMs = Date.now() - this.formThree.value.DOB.getTime();
    var ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age != undefined && age < 18) {
      this.formThree.controls['DOB'].setErrors({ 'incorrect': true });
    }
    if (age != undefined && age > 18) {
      let value = this.datePipe.transform(this.formThree.controls['DOB'].value, 'yyyy-MM-dd')
      this.formThree.controls['DOB'].patchValue(value)
    }
  }
  onDateChange(name: any) {
    if (name == 'passportExpiry') {
      let value = this.datePipe.transform(this.formThree.controls['passportExpiry'].value, 'yyyy-MM-dd')
      this.formThree.controls['passportExpiry'].patchValue(value)
    }
  }
  ngAfterContentChecked() {
    Object.keys(this.formThree.controls).forEach(field => {
      let control = this.formThree.get(field);
      if (control?.hasValidator(Validators.required) && control.value == '') {
        this.formThree.setErrors({ 'invalid': true });
      }
    });
  }
  unTouchAll() {
    Object.keys(this.formThree.controls).forEach(field => {
      this.formThree.get(field)?.setErrors(null);
    });
    this.formThree.setErrors({ 'invalid': true });
  }
  next() {
    Object.keys(this.formThree.controls).forEach(field => {
      let control = this.formThree.get(field);
      if (control?.hasValidator(Validators.required) && control.value == '') {
        this.formThree.setErrors({ 'invalid': true });
        control.setErrors({ 'incorrect': true });
        window.scroll({ top: 200, left: 0, behavior: 'smooth' });
      }
    });
    if (this.formThree.valid) {
      let formValue = this.formThree.getRawValue();
      this.formService.formData.guarantor = formValue;
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

      this.formService.formData.guarantor.documents = documents
    }
  }
}
