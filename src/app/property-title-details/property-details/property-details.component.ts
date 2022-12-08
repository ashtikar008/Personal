import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  propertyDetails: FormGroup;
  public addr: any;
  setAddress(addrObj: any) {
    this.zone.run(() => {
      this.addr = addrObj;
    });
    if (this.addr != undefined) {
      let address = this.addr.name.concat(' ', this.addr.formatted_address);
      if (address != undefined) {
        this.propertyDetails.patchValue({ address: address });
      }
      let postcode = this.addr.address_components.find((x: any) => x.types[0] == "postal_code");
      if (postcode != undefined) {
        this.propertyDetails.patchValue({ propertyTypePostcode: postcode.long_name });
      } else {
        this.propertyDetails.controls['propertyTypePostcode'].setValue('');
      }
    }
  }
  constructor(public fb: FormBuilder, private zone: NgZone) {
    this.propertyDetails = this.fb.group({
      propertyClassId: new FormControl('', [Validators.required]),
      propertyType: new FormControl('', [Validators.required]),
      propertyTypePostcode: new FormControl('', Validators.pattern("^([0-9]{4})$")),
      numberOfBedrooms: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      propertyTitleVolume: new FormControl('', [Validators.required]),
      propertyFolioNo: new FormControl('', [Validators.required]),
      mortgageInterestRate: new FormControl('', [Validators.required]),
      loanAmountRequest: new FormControl('', [Validators.required]),
      propertyPurchasePrice: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

}
