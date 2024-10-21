import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './token.service';
 

@Injectable()
export abstract class DataService {
  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string, public tokenService: TokenService) {
  
  } 
   
   

  httpHeaderWithSpecialData() {
    const token = this.tokenService.getAccessToken();
    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', "*");
    headers = headers.append('Authorization', token);
    return headers;
  }

  get(name: string): Observable<any> { 
    const headers = this.httpHeaderWithSpecialData();
    let getContactURL = this.baseUrl + "api/" + name;
    return this.http.get(getContactURL, { headers })
      .pipe(
        map((res: any) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );

  }

  post(name: string, model: any): Observable<any> {

    let headers: any;
    if (name == 'contact/ValidateUserAndGetToken') {
      headers = new HttpHeaders().set('skip', 'true');
      headers = headers.append('content-type', 'application/json');
      headers = headers.append('Access-Control-Allow-Origin', "*");
    } else {
      headers = this.httpHeaderWithSpecialData()
    }
     
    let createContactURL = this.baseUrl + "api/" + name;
    return this.http.post(createContactURL, JSON.stringify(model), { headers })
      .pipe(
        map((res) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }

  put(name: string, model: any): Observable<any> { 
    const headers = this.httpHeaderWithSpecialData();

    let updateContactURL = this.baseUrl + "api/" + name;
    return this.http.put(updateContactURL, JSON.stringify(model), { headers })
      .pipe(
        map((res) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }

  delete(name: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Specify JSON content type
    });

    let deleteContactUrl = this.baseUrl + "api/" + name;
    return this.http.delete(deleteContactUrl, { headers })
      .pipe(
        map((res) => {

          return res;
        }),
        catchError(result => {
          return this.handleError(result);
        })
      );
  }

  handleError(result: any) {

    if (result.status === 400 || result.status === 404) {
      console.log("in 400")
      console.log(result);

      return observableThrowError(result);
    }
    if (result.status === 500) {
      console.log("in 500")
      console.log(result);

      return observableThrowError(result);
    }
    if (result.status === 403) {

      console.log("in 403")
      console.log(result);
    }

    if (result.status !== 401) {

    }


    if (result.headers === undefined) {
      return observableThrowError(result);
    }

    const applicationError = result.headers.get('Application-Error');
    return observableThrowError(applicationError || 'Server error');
  }
  
}
