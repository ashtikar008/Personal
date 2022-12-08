import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-form-six',
  templateUrl: './form-six.component.html',
  styleUrls: ['./form-six.component.scss']
})
export class FormSixComponent implements OnInit {
  formSix: FormGroup;
  constructor(public fb: FormBuilder, public formService: FormDataService) {
    this.formSix = this.fb.group({
      additionalInvestor: new FormControl('no'),
    })
  }

  ngOnInit(): void {
  }
}
