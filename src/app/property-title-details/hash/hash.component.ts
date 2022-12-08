import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hash',
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.scss']
})
export class HashComponent implements OnInit {
  hashForm: FormGroup
  constructor(public fb: FormBuilder,private activatedRoute: ActivatedRoute,) {
    this.hashForm = this.fb.group({
      borrowerHash: new FormControl({ value: '', disabled: true }, [Validators.required]),
      scenarioHash: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params?.b_hash && params?.s_hash) {
        this.hashForm.get('borrowerHash')?.patchValue(params?.b_hash)
        this.hashForm.get('scenarioHash')?.patchValue(params?.s_hash)
      }
    })
  }

}
