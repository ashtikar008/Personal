import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable , throwError} from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  service_count = 0; 
  constructor(private apiService:ApiService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.apiService.getToken();
    request = request.clone({headers:request.headers.set('Authorization',`Bearer ${token}`)});
    this.service_count++;
    this.apiService.commonService.displayLoader.emit(true);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>, error) => {
        if (event instanceof HttpResponse) {
          this.service_count--;
          if (this.service_count === 0) {
            this.apiService.commonService.displayLoader.emit(false);
          }
        } 
        return event;
      }),
      catchError((error: HttpErrorResponse): Observable<any> => {
        if (error.status == 401 || error.status == 0) { 
          if (localStorage.getItem('_bt')) {
            localStorage.removeItem('_bt')
          }
          // this.router.navigate([''])
        }
        this.service_count--;
        if (this.service_count === 0) {
          this.apiService.commonService.displayLoader.emit(false);
        }
        return throwError(error)
      })
    );
  }
}
