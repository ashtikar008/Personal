import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDataService } from 'src/app/services/form-data.service';
@Component({
  selector: 'app-form-two',
  templateUrl: './form-two.component.html',
  styleUrls: ['./form-two.component.scss']
})
export class FormTwoComponent implements OnInit {
  formTwo: FormGroup;
  constructor(public fb: FormBuilder, public formService : FormDataService) {
    this.formTwo = this.fb.group({
      guarantor: new FormControl('yes'),
    })
  }
  ngOnInit(): void {
    
  }
}
