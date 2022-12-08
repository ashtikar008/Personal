import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-property-documents',
  templateUrl: './property-documents.component.html',
  styleUrls: ['./property-documents.component.scss']
})
export class PropertyDocumentsComponent implements OnInit {
  propertyDocuments: FormGroup;
  additionalDocForm: FormGroup;
  additionalDocuments: any = {};
  progress!: number;
  fieldName: any;
  constructor(public fb: FormBuilder,private apiService:ApiService,private toastrService: ToastrService,) {
    this.propertyDocuments = this.fb.group({
      F_AND_F_ODF_SUPPLE_IM: new FormControl('', [Validators.required]),
      DEED_OF_GUARANTEE: new FormControl('', [Validators.required]),
      DIRECT_DEBIT_AUTHORITY: new FormControl('', [Validators.required]),
    });
    this.additionalDocForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      additionalDoc: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  getFileName(event: any) {
    if (event && event.files && event.files[0]?.name) {
      return event.files[0].name;
    }
  }
  validateFile(element: any) {
    let extentions = ['png', 'jpg', 'pdf', 'jpeg', 'bmp', 'png'];
    let fileType = extentions.find(x => x == element.files[0].name.split('.').pop());
    let fileSize = element.files[0].size;
    if (fileType != undefined && fileSize < 20971520) { return true }
    else {
      if (element.files[0].size > 20971520) { this.toastrService.warning('document size should not be more than 20MB !') }
      else { this.toastrService.warning('Invalid document format!') }
      element.value = '';
      return false;
    }
  }
  onFileChange(event: any, fieldName: any, element: any) {
    let validFile = this.validateFile(element);
    if (validFile == true) {
      if ((event.target && event.target.files.length > 0) || (event.files && event.files.length > 0)) {
        let multFiles: any;
        if (event.target && event.target.files) { multFiles = event.target.files; } else { multFiles = event.files }
        let data = new FormData;
        data.append('file', multFiles[0]);
        data.append('fileName', multFiles[0].name);
        data.append('folderId', '180488849336');
        this.fieldName = fieldName;
        this.progress = 1;
        this.apiService.uploadDocs(`/document/upload-manual-document`, data).subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progress = Math.round(event.loaded / event.total * 100);
              console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              this.toastrService.success('Document uploaded successfully!');
              console.log('Document uploaded successfully!', event.body);
              if (fieldName == 'additionalDoc') {
                let title = this.additionalDocForm.value.title.split(' ').join('_').toUpperCase();
                if (title && event.body) {
                  this.additionalDocuments[title] = event.body.items[0].documentId;
                  this.additionalDocForm.reset();
                }
              } else {
                this.propertyDocuments.patchValue({
                  [fieldName]: event.body.items[0].documentId
                });
              }
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
          }
        },
          error => {
            if (error) {
              element.value = '';
              this.additionalDocForm.reset();
              this.progress = 0;
            }
          })
      }
    }
  }
  additionalDoc(event: any) {
    let title = this.additionalDocForm.value.title.split(' ').join('_').toUpperCase();
    if (event && event.files.length > 0) {
      this.additionalDocuments[title] = event.files[0];
      this.additionalDocForm.reset();
    }
  }
  deleteDoc(name:any){
    if(name){
      delete this.additionalDocuments[name]; 
    }
  }
  updateColor(progress: any) {
    if(progress < 20){
      return 'red'
    } else if (progress < 60 && progress > 20){
      return 'yellow'
    } else {
      return 'green'
    }
  }
}
