import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { catchError } from 'rxjs/operators';
import { throwError, map, Observable} from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { enum_fileNames } from 'src/app/enums/common.enum';
import { CommonService } from './common.service';
import { NgxSpinnerService } from 'ngx-spinner';

let endpoint = '';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  userData: any
  userRole: any
  userToken: any
  dtSearchTimer = 500

  constructor(public http:HttpClient ,public commonService: CommonService, public auth: AuthService , private spinner:NgxSpinnerService) {
    // endpoint = window.location.origin.replace(environment.appDomainPrefix,environment.apiDomainPrefix)+'/'
    // if(window.location.host != 'osqoadmin.dev.osqo.com.au')
    endpoint = 'https://platform-api.dev.osqo.com.au';
    this.auth.getAccessTokenSilently().subscribe(token => {
      this.userToken = token;
    });
  }

  /**
   * Purpose: Get user role and token data.
   */
   async setUserDataAndRole() {
    if(!this.userToken){
      //Get auth token.
      this.auth.getAccessTokenSilently().subscribe(token => {
        this.userToken = token;
        this.getUserRole()
      });
    }else{
      this.getUserRole()
    }
  }

  /**
   * Purpose: Get user role and token data.
   */
  async getUserRole(){
    this.http.get(endpoint + 'authorization/user-roles').subscribe((response: any) => {
      this.userRole = response.items[0]?.name;
    });
    // Get auth user data.
    this.userData = await this.auth.getUser().subscribe(user => {
      this.userData = user;
    });
    //Get complete Token data along with user data and token expiry.
    this.auth.getIdTokenClaims().subscribe(tokenData => {
    });
  }

  /**
   * Purpose: Common GET request
   * @param url 
   * @returns 
   */
  get(url: string): Observable<ApiResponse> {
    return this.http.get(endpoint + url, {}).pipe(
      map((data: any) => {
        return data
      }),
      catchError(this.handleError)
    )
  }

  globalGet(url: string) {
    return this.http.get(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Purpose: Common POST request
   * @param url 
   * @param data 
   * @returns 
   */
  post(url: string, data: any, formData_flag = false): Observable<ApiResponse> {
    if (formData_flag) {
      let formData = new FormData();
      let availableFileArray = Object.values(enum_fileNames)
      for (let key in data) {
        let inputFileKeys: any = key
        if (availableFileArray.includes(inputFileKeys) && data[key]) {
          for (var i = 0; i < data[key].length; i++) {
            formData.append(inputFileKeys, data[key][i] as File, data[key][i]['originalname']);
          }
        } else if (data[key]) {
          formData.append(key, (data[key] instanceof Object) ? JSON.stringify(data[key]) : data[key]);
        }
      }
      data = formData;
    }
    return this.http.post(endpoint + url, data, {}).pipe(
      map((data: any) => {
        return data
      }),
      catchError(this.handleError)
    );
  }
  uploadDocs(url: string, data: any,): Observable<any> {
    return this.http
      .post(endpoint + url, data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.handleError));
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
  /**
   * Purpose: Common PATCH request
   * @param url 
   * @param data 
   * @returns 
   */
  patch(url: string, data: object): Observable<ApiResponse> {
    return this.http.patch(endpoint + url, data, {}).pipe(
      map((data: any) => {
        return data
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Purpose: Common put request
   * @param url 
   * @param data 
   * @returns 
   */
   put(url: string, data: object): Observable<ApiResponse> {
    return this.http.put(endpoint + url, data, {}).pipe(
      map((data: any) => {
        return data
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Purpose: Logout Functionality
   */
  logOut() {
    localStorage.removeItem('_bt');
  }

  /**
   * Purpose: Common Error Handling
   * @param error 
   * @returns 
   */
  handleError = (error: any) => {
    this.spinner.hide();
    let errorMessage = 'Something went wrong!';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `${error.error.message}`;
    } else if (error?.error?.message) {
      // server-side error
      errorMessage = `${error.error.message}`;
    }
    this.commonService.toastrService.error('', errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Purpose: To get auth token from local storage
   * @returns 
   */
   getToken() {
    return this.userToken
  }

  getObject(Obj:any){
    return Obj;
  }
}
