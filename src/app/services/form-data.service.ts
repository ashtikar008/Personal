import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  borrowerIndex:number = 0;
  guarantorCheck: any = 'no';
  stepperIndex: any;
  investorCheck: any = 'no';
    additionalInvestor:any = 'no';
  investorIndex: number = 0;
  preData: any;
  scenarioId: any;
  progress: number = 0;
  docData: any;
  constructor() { }

  isadditionalInvestor: boolean = false;
  formData: any = {
    borrowerParties: [],
    guarantor: false,
    investors: [],
  }

  states = [
    {
      "name": "New South Wales",
      "abbreviation": "NSW"
    },
    {
      "name": "Victoria",
      "abbreviation": "VIC"
    },
    {
      "name": "Queensland",
      "abbreviation": "QLD"
    },
    {
      "name": "Tasmania",
      "abbreviation": "TAS"
    },
    {
      "name": "South Australia",
      "abbreviation": "SA"
    },
    {
      "name": "Western Australia",
      "abbreviation": "WA"
    },
    {
      "name": "Northern Territory",
      "abbreviation": "NT"
    },
    {
      "name": "Australian Capital Territory",
      "abbreviation": "ACT"
    }
  ]
}
