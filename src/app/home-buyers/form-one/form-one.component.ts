import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormDataService } from 'src/app/services/form-data.service';
import { FormSevenComponent } from '../form-seven/form-seven.component';
@Component({
  selector: 'app-form-one',
  templateUrl: './form-one.component.html',
  styleUrls: ['./form-one.component.scss'],
})
export class FormOneComponent implements OnInit {
  formOne: FormGroup;
  hashForm: FormGroup;
  @ViewChild("address", { static: false }) addressField!: ElementRef;
  @ViewChild("emailAddress", { static: false }) emailAddress!: ElementRef;
  @ViewChild(FormSevenComponent) formSeven!: FormSevenComponent;
  public addr: any;
  setAddress(addrObj: any) {
    this.zone.run(() => {
      this.addr = addrObj;
    });
    if (this.addr != undefined) {
      let address = this.addr.name.concat(' ', this.addr.formatted_address);
      if (address != undefined) {
        this.formOne.patchValue({ address: address });
      }
      let state = this.addr.address_components.find((x: any) => x.types[0] == "administrative_area_level_1");
      if (state != undefined) {
        this.formOne.patchValue({ stateProvinceTerritory: state.short_name });
      } else {
        this.formOne.controls['stateProvinceTerritory'].setValue('');
      }
      let city = this.addr.address_components.find((x: any) => x.types[0] == "locality");
      if (city != undefined) {
        this.formOne.patchValue({ city: city.long_name });
      } else {
        this.formOne.controls['city'].setValue('');
      }
      let postcode = this.addr.address_components.find((x: any) => x.types[0] == "postal_code");
      if (postcode != undefined) {
        this.formOne.patchValue({ PostCode: postcode.long_name });
      } else {
        this.formOne.controls['PostCode'].setValue('');
      }
      this.addressField.nativeElement.click();
    }
  }

  constructor(
    public fb: FormBuilder,
    public formService: FormDataService,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) {
    this.hashForm = this.fb.group({
      borrowerId: [{ value: '', disabled: true }, [Validators.required]],
      scenarioId: [{ value: '', disabled: true }, [Validators.required]],
    })
    this.formOne = this.fb.group({

      borrowerPartyId: new FormControl(''),
      salutation: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      titleRole: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      city: new FormControl(''),
      stateProvinceTerritory: new FormControl(''),
      PostCode: new FormControl('', Validators.pattern("^([0-9]{4})$")),
      emailAddress: new FormControl('', Validators.email),
      phoneNumber: new FormControl('', Validators.pattern("^[4][0-9]{8}$")),
      DOB: new FormControl(''),
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
    });
  }

  ngOnInit(): void {
    if (this.formService.preData && this.formService.preData.borrower && this.formService.preData.borrower.borrowerPartyDetails) {
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex])
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerPersonalDetails)
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails)
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails.driversLicence)
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails.passport)
      this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerAccountDetails)
      if (this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerPersonalDetails.emailAddress != null) {
        this.formOne.get('emailAddress')?.disable()
      }
      this.checkPhone();
    }
  }
  checkPhone() {
    let phoneNumber = `${this.formOne.value.phoneNumber}`;
    if (phoneNumber) {
      if (phoneNumber.length > 2 && phoneNumber.slice(0, 3) === '+61') {
        this.formOne.controls['phoneNumber'].setValue(phoneNumber.slice(3));
        return;
      } else if (phoneNumber.length > 2 && phoneNumber.slice(0, 2) === '61') {
        this.formOne.controls['phoneNumber'].setValue(phoneNumber.slice(2));
      } else { this.formOne.controls['phoneNumber'].setValue(+phoneNumber) }
    }
  }
  checkAddress() {
    console.log(this.formOne.value)
    if (this.formOne.value.address == null || this.formOne.value.address == '') {
      this.formOne.controls['city'].setValue('');
      this.formOne.controls['PostCode'].setValue('');
      this.formOne.controls['stateProvinceTerritory'].setValue('');
    }
  }
  checkDate() {
    var ageDifMs = Date.now() - this.formOne.value.DOB?.getTime();
    var ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age != undefined && age < 18) {
      this.formOne.controls['DOB'].setErrors({ 'incorrect': true });
    }
    if (age != undefined && age > 18) {
      let value = this.datePipe.transform(this.formOne.controls['DOB'].value, 'yyyy-MM-dd')
      this.formOne.controls['DOB'].patchValue(value)
    }
  }
  onDateChange(name: any) {
    if (name == 'passportExpiry') {
      let value = this.datePipe.transform(this.formOne.controls['passportExpiry'].value, 'yyyy-MM-dd')
      this.formOne.controls['passportExpiry'].patchValue(value)
    }
  }
  pushValue(doc: any) {
    let formValue = this.formOne.getRawValue();
    this.formService.formData.borrowerParties[this.formService.borrowerIndex] = formValue;
    this.formService.formData.borrowerParties[this.formService.borrowerIndex].documents = doc;
    this.formService.borrowerIndex++;
    this.addressField.nativeElement.value = null;
    if (
      this.formService.borrowerIndex < this.formService.preData.borrower.borrowerPartyDetails.length &&
      this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex] != undefined
    ) {
      if (this.formService.borrowerIndex < this.formService.preData.borrower.borrowerPartyDetails.length &&
        this.formService.formData.borrowerParties[this.formService.borrowerIndex] != undefined) {
        this.formOne.patchValue(this.formService.formData.borrowerParties[this.formService.borrowerIndex]);
        this.formSeven.patchDocuments(this.formService.formData.borrowerParties[this.formService.borrowerIndex].documents);
        this.checkPhone();
      } else {
        this.formOne.reset();
        this.formSeven.resetDocuments();
        this.formSeven.additionalDocuments = {};
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex]);
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerPersonalDetails);
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails);
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails.driversLicence);
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerIdentityDetails.passport);
        this.formOne.patchValue(this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerAccountDetails);
        this.checkPhone();
      }
      if (this.formService.preData.borrower.borrowerPartyDetails[this.formService.borrowerIndex].borrowerPersonalDetails.emailAddress != null) {
        this.formOne.get('emailAddress')?.disable()
      } else {
        this.formOne.get('emailAddress')?.enable()
      }
    }
  }
  scrollToTop() {
    setTimeout(() => {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }, 500);
  }
}
