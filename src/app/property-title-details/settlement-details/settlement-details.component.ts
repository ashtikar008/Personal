import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settlement-details',
  templateUrl: './settlement-details.component.html',
  styleUrls: ['./settlement-details.component.scss']
})
export class SettlementDetailsComponent implements OnInit {
  settlementDetails:FormGroup;
  constructor(public fb: FormBuilder) { 
    this.settlementDetails = this.fb.group({
      bankName: new FormControl('', [Validators.required]),
      accountName:new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required]),
      bsb: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
      swiftId: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

}
