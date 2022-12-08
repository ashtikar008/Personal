import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-form-four',
  templateUrl: './form-four.component.html',
  styleUrls: ['./form-four.component.scss']
})
export class FormFourComponent implements OnInit {

  formFour: FormGroup;
  constructor(public fb: FormBuilder, 
    public formService:FormDataService) 
    {
    this.formFour = this.fb.group({
      bondBuyerAvailable: new FormControl('yes'),
    })
  }

  ngOnInit(): void {
  }
}
